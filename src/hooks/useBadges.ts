
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Badge, UserBadge } from '@/types/gamification';

export const useBadges = (userId?: string) => {
  const [allBadges, setAllBadges] = useState<Badge[]>([]);
  const [userBadges, setUserBadges] = useState<UserBadge[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAllBadges = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('badges')
        .select('*')
        .order('rarity', { ascending: true });

      if (error) throw error;
      setAllBadges(data || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des badges:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserBadges = async () => {
    if (!userId) return;
    
    try {
      const { data, error } = await supabase
        .from('user_badges')
        .select(`
          *,
          badge:badges(*)
        `)
        .eq('user_id', userId)
        .order('earned_at', { ascending: false });

      if (error) throw error;
      setUserBadges(data || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des badges utilisateur:', error);
    }
  };

  const checkAndAwardBadges = async () => {
    if (!userId) return;
    
    try {
      await supabase.rpc('check_and_award_badges', { user_uuid: userId });
      fetchUserBadges();
    } catch (error) {
      console.error('Erreur lors de la vérification des badges:', error);
    }
  };

  useEffect(() => {
    fetchAllBadges();
    if (userId) {
      fetchUserBadges();
    }
  }, [userId]);

  return {
    allBadges,
    userBadges,
    loading,
    checkAndAwardBadges,
    fetchUserBadges
  };
};
