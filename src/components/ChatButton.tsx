import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { useChat } from '@/hooks/useChat';
import { useAuth } from '@/hooks/useAuth';

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
      className="flex items-center gap-2"
    >
      <MessageCircle className="w-4 h-4" />
      Chat
    </Button>
  );
};

export default ChatButton;