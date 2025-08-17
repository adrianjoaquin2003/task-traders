import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { useChat } from '@/hooks/useChat';
import { useAuth } from '@/hooks/useAuth';
import { useUnreadMessages } from '@/hooks/useUnreadMessages';

interface ChatButtonProps {
  jobId: string;
  jobPosterId: string;
  professionalId: string;
  onStartChat: (conversationId: string) => void;
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'default' | 'sm' | 'lg';
}

/**
 * ChatButton Component - Initiates or continues chat conversations
 * 
 * Automatically handles:
 * - Creating new conversations between job poster and professional
 * - Finding existing conversations for the same job
 * - Starting chat with proper context
 */
const ChatButton: React.FC<ChatButtonProps> = ({
  jobId,
  jobPosterId,
  professionalId,
  onStartChat,
  variant = 'outline',
  size = 'default'
}) => {
  const { user } = useAuth();
  const { conversations, createConversation } = useChat();
  const { unreadCount } = useUnreadMessages(jobId, jobPosterId, professionalId);

  const handleStartChat = async () => {
    if (!user) return;

    // Check if conversation already exists for this job and these participants
    const existingConversation = conversations.find(
      conv => conv.job_id === jobId && 
      conv.job_poster_id === jobPosterId && 
      conv.professional_id === professionalId
    );

    if (existingConversation) {
      // Use existing conversation
      onStartChat(existingConversation.id);
    } else {
      // Create new conversation
      const conversationId = await createConversation(jobId, professionalId, jobPosterId);
      if (conversationId) {
        onStartChat(conversationId);
      }
    }
  };

  // Only show chat button if user is involved in this job
  const isJobPoster = user?.id === jobPosterId;
  const isProfessional = user?.id === professionalId;
  
  if (!user || (!isJobPoster && !isProfessional)) {
    return null;
  }

  return (
    <Button
      onClick={handleStartChat}
      variant={variant}
      size={size}
      className="flex items-center gap-2 relative"
    >
      <MessageCircle className="w-4 h-4" />
      Chat
      {unreadCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </Button>
  );
};

export default ChatButton;