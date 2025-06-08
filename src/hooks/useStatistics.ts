
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserStatistic, LeaderboardEntry } from '@/types/gamification';

export const useStatistics = (userId?: string) => {
  const [userStats, setUserStats] = useState<UserStatistic[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUserStatistics = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_statistics')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;
      setUserStats(data || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaderboard = async (category: string = 'global') => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('leaderboards')
        .select(`
          *,
          profiles(pseudo, avatar_url)
        `)
        .eq('category', category)
        .order('rank', { ascending: true })
        .limit(50);

      if (error) throw error;
      setLeaderboard(data || []);
    } catch (error) {
      console.error('Erreur lors de la récupération du classement:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatistic = async (statType: string, value: number = 1) => {
    if (!userId) return;
    
    try {
      await supabase.rpc('update_user_stats', {
        user_uuid: userId,
        stat_name: statType,
        increment_value: value
      });
      fetchUserStatistics();
    } catch (error) {
      console.error('Erreur lors de la mise à jour des statistiques:', error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserStatistics();
    }
    fetchLeaderboard();
  }, [userId]);

  return {
    userStats,
    leaderboard,
    loading,
    updateStatistic,
    fetchLeaderboard,
    fetchUserStatistics
  };
};
