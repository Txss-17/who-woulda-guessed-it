
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Notification } from '@/types/social';
import { toast } from 'sonner';

export const useNotifications = (userId?: string) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotifications(data || []);
      setUnreadCount(data?.filter(n => !n.read).length || 0);
    } catch (error) {
      console.error('Erreur lors de la récupération des notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) throw error;
      fetchNotifications();
    } catch (error) {
      console.error('Erreur lors du marquage comme lu:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!userId) return;
    
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId)
        .eq('read', false);

      if (error) throw error;
      fetchNotifications();
    } catch (error) {
      console.error('Erreur lors du marquage de toutes comme lues:', error);
    }
  };

  const createNotification = async (
    targetUserId: string,
    title: string,
    content: string,
    type: Notification['notification_type'],
    relatedId?: string
  ) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: targetUserId,
          title,
          content,
          notification_type: type,
          related_id: relatedId
        });

      if (error) throw error;
    } catch (error) {
      console.error('Erreur lors de la création de la notification:', error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchNotifications();
      
      // S'abonner aux nouvelles notifications en temps réel
      const channel = supabase
        .channel('notifications')
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        }, (payload) => {
          fetchNotifications();
          // Afficher une toast pour la nouvelle notification
          const newNotification = payload.new as Notification;
          toast(newNotification.title, {
            description: newNotification.content
          });
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [userId]);

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    createNotification,
    fetchNotifications
  };
};
