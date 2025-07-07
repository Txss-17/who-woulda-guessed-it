import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Player } from '@/types/onlineGame';

interface DatabaseGame {
  id: string;
  code: string;
  host_id: string | null;
  host_name: string;
  status: string;
  max_players: number;
  players: any;
  questions: any;
  current_question: number;
  game_type: string;
  created_at: string;
  updated_at: string;
}

interface RealtimeGameData {
  id: string;
  code: string;
  host_id: string | null;
  host_name: string;
  status: 'waiting' | 'playing' | 'finished';
  max_players: number;
  players: Player[];
  questions: string[];
  current_question: number;
  game_type: string;
  created_at: string;
  updated_at: string;
}

// Fonction utilitaire pour convertir les données de la base
const convertDatabaseGame = (dbGame: DatabaseGame): RealtimeGameData => {
  return {
    ...dbGame,
    status: dbGame.status as 'waiting' | 'playing' | 'finished',
    players: Array.isArray(dbGame.players) ? dbGame.players as Player[] : [],
    questions: Array.isArray(dbGame.questions) ? dbGame.questions as string[] : []
  };
};

export const useRealtimeGameSync = (gameCode: string | null) => {
  const [gameData, setGameData] = useState<RealtimeGameData | null>(null);
  const [isHost, setIsHost] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Charger une partie existante par son code
  const loadGame = async (code: string) => {
    try {
      const { data, error } = await supabase
        .from('realtime_games')
        .select('*')
        .eq('code', code.toUpperCase())
        .single();

      if (error) {
        console.error('Erreur lors du chargement de la partie:', error);
        return null;
      }

      return convertDatabaseGame(data as DatabaseGame);
    } catch (error) {
      console.error('Erreur lors du chargement de la partie:', error);
      return null;
    }
  };

  // Créer une nouvelle partie
  const createGame = async (code: string, hostName: string, questions: string[]) => {
    try {
      const { data, error } = await supabase
        .from('realtime_games')
        .insert({
          code: code.toUpperCase(),
          host_name: hostName,
          players: [],
          questions: questions,
          status: 'waiting',
          max_players: 8,
          game_type: 'classic'
        })
        .select()
        .single();

      if (error) {
        console.error('Erreur lors de la création de la partie:', error);
        return null;
      }

      return convertDatabaseGame(data as DatabaseGame);
    } catch (error) {
      console.error('Erreur lors de la création de la partie:', error);
      return null;
    }
  };

  // Ajouter un joueur à la partie
  const addPlayerToGame = async (player: Player) => {
    if (!gameData) return false;

    try {
      // Vérifier si le joueur existe déjà
      const existingPlayers = gameData.players || [];
      const playerExists = existingPlayers.some(p => p.id === player.id);
      
      if (playerExists) {
        return true; // Le joueur est déjà dans la partie
      }

      const updatedPlayers = [...existingPlayers, player];

      const { data, error } = await supabase
        .from('realtime_games')
        .update({ 
          players: updatedPlayers as any,
          updated_at: new Date().toISOString()
        })
        .eq('code', gameData.code)
        .select()
        .single();

      if (error) {
        console.error('Erreur lors de l\'ajout du joueur:', error);
        return false;
      }

      setGameData(convertDatabaseGame(data as DatabaseGame));
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'ajout du joueur:', error);
      return false;
    }
  };

  // Initialiser le hook avec le code de la partie
  useEffect(() => {
    if (!gameCode) {
      setIsLoading(false);
      return;
    }

    const initializeGame = async () => {
      setIsLoading(true);
      const game = await loadGame(gameCode);
      
      if (game) {
        setGameData(game);
        
        // Vérifier si l'utilisateur actuel est l'hôte
        const playerData = sessionStorage.getItem('playerData');
        if (playerData) {
          try {
            const currentPlayer = JSON.parse(playerData);
            setIsHost(game.players[0]?.id === currentPlayer.id);
          } catch (error) {
            console.error('Erreur lors du parsing des données du joueur:', error);
          }
        }
      }
      
      setIsLoading(false);
    };

    initializeGame();
  }, [gameCode]);

  // Écouter les changements en temps réel
  useEffect(() => {
    if (!gameCode) return;

    const channel = supabase
      .channel(`game_${gameCode}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'realtime_games',
          filter: `code=eq.${gameCode.toUpperCase()}`
        },
        (payload) => {
          console.log('Mise à jour temps réel:', payload);
          if (payload.eventType === 'UPDATE' && payload.new) {
            setGameData(convertDatabaseGame(payload.new as DatabaseGame));
          } else if (payload.eventType === 'DELETE') {
            setGameData(null);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [gameCode]);

  return {
    gameData,
    isHost,
    isLoading,
    addPlayerToGame,
    createGame,
    loadGame
  };
};