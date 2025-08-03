import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  read_at: string | null;
  created_at: string;
  updated_at: string;
  sender_profile?: {
    full_name: string;
    email: string;
  };
}

export interface Conversation {
  id: string;
  job_id: string;
  job_poster_id: string;
  professional_id: string;
  last_message_at: string;
  created_at: string;
  job?: {
    title: string;
    status: string;
  };
  other_participant?: {
    full_name: string;
    email: string;
  };
}

/**
 * Custom hook for managing chat conversations and messages
 * 
 * Features:
 * - Real-time message updates using Supabase realtime
 * - Conversation management for job-related chats
 * - Message sending with optimistic updates
 * - Read status tracking
 */
export const useChat = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  /**
   * Fetches all conversations for the current user
   * Includes job details and other participant info
   */
  const fetchConversations = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          job:jobs(title, status)
        `)
        .or(`job_poster_id.eq.${user.id},professional_id.eq.${user.id}`)
        .order('last_message_at', { ascending: false });

      if (error) {
        console.error('Error fetching conversations:', error);
        return;
      }

      // Fetch participant profiles separately
      const conversationsWithProfiles = await Promise.all(
        (data || []).map(async (conv) => {
          const otherUserId = user.id === conv.job_poster_id ? conv.professional_id : conv.job_poster_id;
          
          const { data: profileData } = await supabase
            .from('profiles')
            .select('full_name, email')
            .eq('user_id', otherUserId)
            .single();

          return {
            ...conv,
            other_participant: profileData || { full_name: 'Unknown', email: '' }
          };
        })
      );

      setConversations(conversationsWithProfiles);
    } catch (error) {
      console.error('Conversation fetch error:', error);
    }
  };

  /**
   * Fetches messages for a specific conversation
   */
  const fetchMessages = async (conversationId: string) => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        return;
      }

      // Fetch sender profiles separately
      const messagesWithProfiles = await Promise.all(
        (data || []).map(async (message) => {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('full_name, email')
            .eq('user_id', message.sender_id)
            .single();

          return {
            ...message,
            sender_profile: profileData || { full_name: 'Unknown', email: '' }
          };
        })
      );

      setMessages(messagesWithProfiles);
      setActiveConversation(conversationId);

      // Mark messages as read
      await markMessagesAsRead(conversationId);
    } catch (error) {
      console.error('Message fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Sends a new message in the conversation
   */
  const sendMessage = async (conversationId: string, content: string) => {
    if (!user || !content.trim()) return;

    try {
      // Get conversation details to determine recipient
      const conversation = conversations.find(c => c.id === conversationId);
      if (!conversation) return;

      const recipientId = user.id === conversation.job_poster_id 
        ? conversation.professional_id 
        : conversation.job_poster_id;

      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          recipient_id: recipientId,
          content: content.trim(),
          job_id: conversation.job_id
        })
        .select()
        .single();

      if (error) {
        toast({
          title: "Error sending message",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      // Fetch sender profile for the new message
      const { data: profileData } = await supabase
        .from('profiles')
        .select('full_name, email')
        .eq('user_id', user.id)
        .single();

      const messageWithProfile = {
        ...data,
        sender_profile: profileData || { full_name: 'Unknown', email: '' }
      };

      // Update conversation's last message time
      await supabase
        .from('conversations')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', conversationId);

      // Optimistically add message to local state
      setMessages(prev => [...prev, messageWithProfile]);

    } catch (error) {
      console.error('Send message error:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  /**
   * Creates a new conversation between job poster and professional
   */
  const createConversation = async (jobId: string, professionalId: string, jobPosterId: string) => {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .insert({
          job_id: jobId,
          job_poster_id: jobPosterId,
          professional_id: professionalId
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating conversation:', error);
        return null;
      }

      await fetchConversations();
      return data.id;
    } catch (error) {
      console.error('Create conversation error:', error);
      return null;
    }
  };

  /**
   * Marks messages as read for the current user
   */
  const markMessagesAsRead = async (conversationId: string) => {
    if (!user) return;

    try {
      await supabase
        .from('messages')
        .update({ read_at: new Date().toISOString() })
        .eq('conversation_id', conversationId)
        .eq('recipient_id', user.id)
        .is('read_at', null);
    } catch (error) {
      console.error('Mark as read error:', error);
    }
  };

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user) return;

    // Subscribe to new messages
    const messageChannel = supabase
      .channel('messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `recipient_id=eq.${user.id}`
      }, (payload) => {
        console.log('New message received:', payload);
        // If we're viewing this conversation, add the message
        if (payload.new.conversation_id === activeConversation) {
          setMessages(prev => [...prev, payload.new as Message]);
        }
        // Refresh conversations to update last message time
        fetchConversations();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(messageChannel);
    };
  }, [user, activeConversation]);

  // Fetch conversations on mount
  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  return {
    conversations,
    messages,
    activeConversation,
    loading,
    fetchMessages,
    sendMessage,
    createConversation,
    setActiveConversation
  };
};