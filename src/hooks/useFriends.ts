
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Friendship } from '@/types/social';
import { toast } from 'sonner';

export const useFriends = (userId?: string) => {
  const [friends, setFriends] = useState<Friendship[]>([]);
  const [pendingRequests, setPendingRequests] = useState<Friendship[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchFriends = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('friendships')
        .select('*')
        .or(`user_id.eq.${userId},friend_id.eq.${userId}`)
        .eq('status', 'accepted');

      if (error) throw error;
      
      // Type assertion for friendship status
      const typedFriends: Friendship[] = (data || []).map(friendship => ({
        ...friendship,
        status: friendship.status as 'pending' | 'accepted' | 'blocked'
      }));
      
      setFriends(typedFriends);
    } catch (error) {
      console.error('Erreur lors de la récupération des amis:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingRequests = async () => {
    if (!userId) return;
    
    try {
      const { data, error } = await supabase
        .from('friendships')
        .select('*')
        .eq('friend_id', userId)
        .eq('status', 'pending');

      if (error) throw error;
      
      // Type assertion for friendship status
      const typedRequests: Friendship[] = (data || []).map(friendship => ({
        ...friendship,
        status: friendship.status as 'pending' | 'accepted' | 'blocked'
      }));
      
      setPendingRequests(typedRequests);
    } catch (error) {
      console.error('Erreur lors de la récupération des demandes:', error);
    }
  };

  const sendFriendRequest = async (friendId: string) => {
    if (!userId) return;
    
    try {
      const { error } = await supabase
        .from('friendships')
        .insert({
          user_id: userId,
          friend_id: friendId,
          status: 'pending'
        });

      if (error) throw error;
      toast.success('Demande d\'ami envoyée !');
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la demande:', error);
      toast.error('Erreur lors de l\'envoi de la demande');
    }
  };

  const acceptFriendRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('friendships')
        .update({ status: 'accepted' })
        .eq('id', requestId);

      if (error) throw error;
      toast.success('Demande d\'ami acceptée !');
      fetchFriends();
      fetchPendingRequests();
    } catch (error) {
      console.error('Erreur lors de l\'acceptation:', error);
      toast.error('Erreur lors de l\'acceptation');
    }
  };

  const rejectFriendRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('friendships')
        .delete()
        .eq('id', requestId);

      if (error) throw error;
      toast.success('Demande d\'ami refusée');
      fetchPendingRequests();
    } catch (error) {
      console.error('Erreur lors du refus:', error);
      toast.error('Erreur lors du refus');
    }
  };

  useEffect(() => {
    if (userId) {
      fetchFriends();
      fetchPendingRequests();
    }
  }, [userId]);

  return {
    friends,
    pendingRequests,
    loading,
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    fetchFriends
  };
};
