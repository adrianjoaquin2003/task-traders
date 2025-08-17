import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

/**
 * Hook to track unread messages for a specific job conversation
 * Returns the count of unread messages between job poster and professional
 */
export const useUnreadMessages = (jobId: string, jobPosterId: string, professionalId: string) => {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !jobId || !jobPosterId || !professionalId) {
      setUnreadCount(0);
      setLoading(false);
      return;
    }

    const fetchUnreadCount = async () => {
      try {
        // Find the conversation for this job between these participants
        const { data: conversation, error: convError } = await supabase
          .from('conversations')
          .select('id')
          .eq('job_id', jobId)
          .eq('job_poster_id', jobPosterId)
          .eq('professional_id', professionalId)
          .maybeSingle();

        if (convError) {
          console.error('Error fetching conversation:', convError);
          return;
        }

        if (!conversation) {
          setUnreadCount(0);
          return;
        }

        // Count unread messages in this conversation where the current user is the recipient
        const { count, error: countError } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('conversation_id', conversation.id)
          .eq('recipient_id', user.id)
          .is('read_at', null);

        if (countError) {
          console.error('Error counting unread messages:', countError);
          return;
        }

        setUnreadCount(count || 0);
      } catch (error) {
        console.error('Error in fetchUnreadCount:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUnreadCount();

    // Set up real-time subscription for message updates
    const channel = supabase
      .channel('unread-messages')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `recipient_id=eq.${user.id}`
        },
        () => {
          // Refetch unread count when messages change
          fetchUnreadCount();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, jobId, jobPosterId, professionalId]);

  return { unreadCount, loading };
};