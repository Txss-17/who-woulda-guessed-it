
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';
import { validateMessageContent, sanitizeContent } from '@/utils/security';
import { useSecureMessaging } from '@/hooks/useSecureMessaging';

interface SecureMessageInputProps {
  onMessageSent?: () => void;
  partyId?: number;
  recipientId?: string;
  placeholder?: string;
}

const SecureMessageInput = ({ 
  onMessageSent, 
  partyId, 
  recipientId, 
  placeholder = "Tapez votre message..." 
}: SecureMessageInputProps) => {
  const [message, setMessage] = useState('');
  const { sendSecureMessage, isSending } = useSecureMessaging();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateMessageContent(message)) {
      return;
    }

    const result = await sendSecureMessage(message, partyId, recipientId);
    
    if (result.success) {
      setMessage('');
      onMessageSent?.();
    }
  };

  const isValid = validateMessageContent(message);
  const characterCount = message.length;
  const maxLength = 1000;

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="relative">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={placeholder}
          className="resize-none pr-20"
          rows={3}
          maxLength={maxLength}
          disabled={isSending}
        />
        <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
          {characterCount}/{maxLength}
        </div>
      </div>
      
      {!isValid && message.length > 0 && (
        <p className="text-sm text-red-500">
          Le message doit contenir entre 1 et {maxLength} caractères
        </p>
      )}
      
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={!isValid || isSending || message.trim().length === 0}
          size="sm"
          className="gap-2"
        >
          <Send className="h-4 w-4" />
          {isSending ? 'Envoi...' : 'Envoyer'}
        </Button>
      </div>
    </form>
  );
};

export default SecureMessageInput;
