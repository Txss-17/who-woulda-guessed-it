
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Message } from '@/types/social';
import { toast } from 'sonner';

export const useMessages = (userId?: string, partyId?: number) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMessages = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      let query = supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true });

      if (partyId) {
        query = query.eq('party_id', partyId);
      } else {
        query = query.or(`sender_id.eq.${userId},recipient_id.eq.${userId}`);
      }

      const { data, error } = await query;

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (content: string, recipientId?: string) => {
    if (!userId) return;
    
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: userId,
          recipient_id: recipientId,
          party_id: partyId,
          content,
          message_type: 'text',
          is_private: !!recipientId
        });

      if (error) throw error;
      fetchMessages();
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      toast.error('Erreur lors de l\'envoi du message');
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ read_at: new Date().toISOString() })
        .eq('id', messageId);

      if (error) throw error;
    } catch (error) {
      console.error('Erreur lors du marquage comme lu:', error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchMessages();
      
      // S'abonner aux nouveaux messages en temps réel
      const channel = supabase
        .channel('messages')
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: partyId ? `party_id=eq.${partyId}` : `recipient_id=eq.${userId}`
        }, () => {
          fetchMessages();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [userId, partyId]);

  return {
    messages,
    loading,
    sendMessage,
    markAsRead,
    fetchMessages
  };
};
