
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { OnlineGame, Player } from '@/types/onlineGame';

export const useGameList = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [publicGames, setPublicGames] = useState<OnlineGame[]>([]);

  // Charger les vraies parties publiques depuis Supabase
  useEffect(() => {
    const loadPublicGames = async () => {
      setIsLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('realtime_games')
          .select('*')
          .eq('status', 'waiting')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Erreur lors du chargement des parties:', error);
          setPublicGames([]);
          return;
        }

        // Convertir les données en format OnlineGame
        const games: OnlineGame[] = (data || []).map(game => {
          const players = Array.isArray(game.players) ? (game.players as any[]).filter(p => p && typeof p === 'object' && p.id && p.name) as Player[] : [];
          return {
            id: game.code,
            name: `Partie de ${game.host_name}`,
            players: {
              count: players.length,
              max: game.max_players,
              list: players
            },
            host: game.host_name,
            type: game.game_type as 'classic' | 'love' | 'friendly' | 'party',
            status: 'waiting' as const
          };
        });

        setPublicGames(games);
      } catch (error) {
        console.error('Erreur lors du chargement des parties:', error);
        setPublicGames([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadPublicGames();

    // Écouter les changements en temps réel
    const channel = supabase
      .channel('public_games')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'realtime_games'
        },
        () => {
          // Recharger la liste quand une partie change
          loadPublicGames();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    isLoading,
    publicGames
  };
};
