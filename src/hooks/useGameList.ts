
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Player } from '@/types/quickGame';

interface OnlineGame {
  id: string;
  name: string;
  players: {
    count: number;
    max: number;
    list: Player[];
  };
  host: string;
  type: any;
  status: 'waiting' | 'playing';
}

export const useGameList = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [publicGames, setPublicGames] = useState<OnlineGame[]>([]);

  // Charger les vraies parties publiques depuis Supabase
  useEffect(() => {
    const loadPublicGames = async () => {
      setIsLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('parties')
          .select('*')
          .eq('party_type', 'public')
          .eq('statut', 'waiting')
          .order('date_creation', { ascending: false });

        if (error) {
          console.error('Erreur lors du chargement des parties:', error);
          setPublicGames([]);
          return;
        }

        const games: OnlineGame[] = (data || []).map(game => {
          return {
            id: String(game.id),
            name: game.invite_link || `Partie ${game.code_invitation}`,
            players: {
              count: 0,
              max: game.max_players || 8,
              list: [] as Player[]
            },
            host: game.host_user_id || 'Hôte',
            type: (game.type_jeu || 'classic') as any,
            status: (game.statut === 'playing' ? 'playing' : 'waiting')
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
          table: 'parties'
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
