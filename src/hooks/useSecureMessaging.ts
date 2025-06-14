
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { sanitizeContent, validateMessageContent, messageRateLimiter, logSecurityEvent } from '@/utils/security';
import { useToast } from '@/hooks/use-toast';

export const useSecureMessaging = () => {
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const sendSecureMessage = async (
    content: string,
    partyId?: number,
    recipientId?: string
  ) => {
    try {
      setIsSending(true);

      // Get current user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        await logSecurityEvent('unauthorized_message_attempt', { partyId, recipientId });
        toast({
          title: "Non autorisé",
          description: "Vous devez être connecté pour envoyer des messages",
          variant: "destructive"
        });
        return { success: false, error: 'User not authenticated' };
      }

      // Rate limiting
      if (!messageRateLimiter.isAllowed(user.id)) {
        await logSecurityEvent('message_rate_limit_exceeded', { userId: user.id });
        toast({
          title: "Trop de messages",
          description: "Veuillez attendre avant d'envoyer un autre message",
          variant: "destructive"
        });
        return { success: false, error: 'Rate limit exceeded' };
      }

      // Validate content
      if (!validateMessageContent(content)) {
        await logSecurityEvent('invalid_message_content', { 
          userId: user.id, 
          contentLength: content.length 
        });
        toast({
          title: "Message invalide",
          description: "Le message doit contenir entre 1 et 1000 caractères",
          variant: "destructive"
        });
        return { success: false, error: 'Invalid message content' };
      }

      // Sanitize content
      const sanitizedContent = sanitizeContent(content);

      // If sending to a party, verify membership
      if (partyId) {
        const { data: membership } = await supabase
          .from('game_players')
          .select('id')
          .eq('game_id', partyId)
          .eq('user_id', user.id)
          .single();

        if (!membership) {
          await logSecurityEvent('unauthorized_party_message', { 
            userId: user.id, 
            partyId 
          });
          toast({
            title: "Non autorisé",
            description: "Vous ne participez pas à cette partie",
            variant: "destructive"
          });
          return { success: false, error: 'Not a party member' };
        }
      }

      // Send the message
      const { error: sendError } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          content: sanitizedContent,
          party_id: partyId,
          recipient_id: recipientId,
          is_private: !!recipientId
        });

      if (sendError) {
        await logSecurityEvent('message_send_error', { 
          userId: user.id, 
          error: sendError.message 
        });
        toast({
          title: "Erreur",
          description: "Impossible d'envoyer le message",
          variant: "destructive"
        });
        return { success: false, error: sendError.message };
      }

      await logSecurityEvent('message_sent', { 
        userId: user.id, 
        partyId, 
        recipientId,
        contentLength: sanitizedContent.length
      });

      return { success: true };

    } catch (error) {
      await logSecurityEvent('message_exception', { 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      toast({
        title: "Erreur inattendue",
        description: "Une erreur s'est produite lors de l'envoi du message",
        variant: "destructive"
      });
      return { success: false, error: 'Unexpected error' };
    } finally {
      setIsSending(false);
    }
  };

  return {
    sendSecureMessage,
    isSending
  };
};
