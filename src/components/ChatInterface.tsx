import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Send, MessageCircle, ArrowLeft } from 'lucide-react';
import { useChat, type Conversation } from '@/hooks/useChat';
import { useAuth } from '@/hooks/useAuth';
import { formatDistanceToNow } from 'date-fns';

interface ChatInterfaceProps {
  jobId?: string;
  onClose?: () => void;
}

/**
 * ChatInterface Component - Complete chat system for job-related conversations
 * 
 * Features:
 * - Conversation list with job context
 * - Real-time messaging with read receipts
 * - Message threads organized by job
 * - Responsive design for mobile and desktop
 */
const ChatInterface: React.FC<ChatInterfaceProps> = ({ jobId, onClose }) => {
  const { user } = useAuth();
  const {
    conversations,
    messages,
    activeConversation,
    loading,
    fetchMessages,
    sendMessage,
    setActiveConversation
  } = useChat();

  const [newMessage, setNewMessage] = useState('');
  const [showConversationList, setShowConversationList] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Filter conversations by job if jobId is provided
  const filteredConversations = jobId 
    ? conversations.filter(conv => conv.job_id === jobId)
    : conversations;

  /**
   * Handles sending a new message
   */
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeConversation || !newMessage.trim()) return;

    await sendMessage(activeConversation, newMessage);
    setNewMessage('');
  };

  /**
   * Opens a conversation and fetches its messages
   */
  const openConversation = (conversationId: string) => {
    fetchMessages(conversationId);
    setShowConversationList(false);
  };

  /**
   * Goes back to conversation list (mobile)
   */
  const backToConversations = () => {
    setActiveConversation(null);
    setShowConversationList(true);
  };

  /**
   * Gets initials for avatar display
   */
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  /**
   * Formats message timestamp
   */
  const formatMessageTime = (timestamp: string) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  };

  if (!user) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6 text-center">
          <MessageCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Please sign in to access chat</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex h-[600px] max-w-4xl mx-auto bg-background border rounded-lg overflow-hidden">
      {/* Conversation List */}
      <div className={`w-full md:w-1/3 border-r ${showConversationList ? 'block' : 'hidden md:block'}`}>
        <div className="p-4 border-b bg-muted/50">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Conversations</h3>
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
          </div>
          {jobId && (
            <p className="text-sm text-muted-foreground mt-1">
              For this job only
            </p>
          )}
        </div>
        
        <ScrollArea className="h-[calc(100%-80px)]">
          {filteredConversations.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              <MessageCircle className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm">No conversations yet</p>
            </div>
          ) : (
            <div className="space-y-1 p-2">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => openConversation(conversation.id)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                    activeConversation === conversation.id ? 'bg-primary/10' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback>
                        {getInitials(conversation.other_participant?.full_name || 'Unknown')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm truncate">
                          {conversation.other_participant?.full_name || 'Unknown User'}
                        </p>
                        <span className="text-xs text-muted-foreground">
                          {formatMessageTime(conversation.last_message_at)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {conversation.job?.title}
                      </p>
                      <Badge variant="secondary" className="text-xs mt-1">
                        {conversation.job?.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Chat Messages */}
      <div className={`flex-1 flex flex-col ${showConversationList ? 'hidden md:flex' : 'flex'}`}>
        {activeConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b bg-muted/50">
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={backToConversations}
                  className="md:hidden"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <div className="flex-1">
                  {(() => {
                    const conversation = conversations.find(c => c.id === activeConversation);
                    return conversation ? (
                      <div>
                        <h4 className="font-semibold">
                          {conversation.other_participant?.full_name}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {conversation.job?.title}
                        </p>
                      </div>
                    ) : null;
                  })()}
                </div>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => {
                    const isOwn = message.sender_id === user.id;
                    return (
                      <div
                        key={message.id}
                        className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            isOwn
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 ${isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                            {formatMessageTime(message.created_at)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t">
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1"
                />
                <Button type="submit" size="icon">
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <MessageCircle className="w-12 h-12 mx-auto mb-4" />
              <p>Select a conversation to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;