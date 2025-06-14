
import React from 'react';
import SecureMessageInput from './SecureMessageInput';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
  gameId?: string;
  recipientId?: string;
}

const MessageInput = ({ 
  onSendMessage, 
  disabled = false, 
  placeholder = "Tapez votre message...",
  gameId,
  recipientId
}: MessageInputProps) => {
  const handleMessageSent = () => {
    // Trigger refresh or update in parent component
    // This maintains compatibility with existing code
  };

  // Convert gameId to number if it exists
  const partyId = gameId ? parseInt(gameId, 10) : undefined;

  return (
    <div className={disabled ? 'opacity-50 pointer-events-none' : ''}>
      <SecureMessageInput
        onMessageSent={handleMessageSent}
        partyId={partyId}
        recipientId={recipientId}
        placeholder={placeholder}
      />
    </div>
  );
};

export default MessageInput;
