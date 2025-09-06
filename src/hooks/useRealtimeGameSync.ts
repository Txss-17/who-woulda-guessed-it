import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Player } from '@/types/quickGame';

interface DatabaseGame {
  id: number;
  code_invitation: string;
  host_user_id: string | null;
  statut: string;
  max_players: number | null;
  created_at: string | null;
  updated_at?: string | null;
  type_jeu: string;
}


interface RealtimeGameData {
  id: number;
  code: string;
  host_id: string | null;
  host_name?: string;
  status: 'waiting' | 'playing' | 'finished';
  max_players: number;
  players: Player[];
  questions: string[];
  current_question?: number;
  game_type?: string;
  created_at?: string | null;
  updated_at?: string | null;
}


// Fonction utilitaire pour convertir les données de la base
const mapPlayers = (rows: any[]): Player[] => {
  return (rows || []).map((r) => ({
    id: String(r.id),
    name: r.pseudo_temporaire || 'Joueur',
    status: 'onroom' as const,
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(r.pseudo_temporaire || 'Joueur')}&background=10b981&color=fff`
  }));
};

export const useRealtimeGameSync = (gameCode: string | null) => {
  const [gameData, setGameData] = useState<RealtimeGameData | null>(null);
  const [isHost, setIsHost] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Charger une partie existante par son code
  const loadGame = async (code: string) => {
    try {
      const { data: party, error } = await supabase
        .from('parties')
        .select('*')
        .eq('code_invitation', code.toUpperCase())
        .maybeSingle();

      if (error) {
        console.error('Erreur lors du chargement de la partie:', error);
        return null;
      }

      if (!party) return null;

      // Charger les joueurs
      const { data: playerRows, error: playersError } = await supabase
        .from('game_players')
        .select('id, pseudo_temporaire')
        .eq('game_id', (party as any).id);

      if (playersError) {
        console.error('Erreur lors du chargement des joueurs:', playersError);
      }

      const mapped: RealtimeGameData = {
        id: (party as any).id,
        code: (party as any).code_invitation,
        host_id: (party as any).host_user_id || null,
        host_name: 'Hôte',
        status: ((party as any).statut === 'playing' ? 'playing' : 'waiting'),
        max_players: (party as any).max_players || 8,
        players: mapPlayers(playerRows || []),
        questions: [],
        created_at: (party as any).date_creation || null,
        updated_at: null,
      };

      return mapped;
    } catch (error) {
      console.error('Erreur lors du chargement de la partie:', error);
      return null;
    }
  };

  const createGame = async (code: string, hostName: string, questions: string[]) => {
    try {
      console.log('Création de la partie avec le code:', code, 'et hôte:', hostName);
      
      const { data, error } = await supabase
        .from('parties')
        .insert({
          code_invitation: code.toUpperCase(),
          type_jeu: 'classic',
          mode: 'standard',
          statut: 'waiting',
          max_players: 8,
          invite_link: null,
          host_user_id: null,
        })
        .select()
        .maybeSingle();

      if (error) {
        console.error('Erreur lors de la création de la partie:', error);
        return null;
      }

      if (!data) return null;

      console.log('Partie créée avec succès:', data);

      // Ajouter immédiatement l'hôte à la partie
      console.log('Ajout de l\'hôte à la partie:', hostName);
      const { data: hostPlayer, error: hostError } = await supabase
        .from('game_players')
        .insert({
          game_id: (data as any).id,
          pseudo_temporaire: hostName,
          user_id: null,
        })
        .select('id, pseudo_temporaire')
        .maybeSingle();

      if (hostError) {
        console.error('Erreur lors de l\'ajout de l\'hôte:', hostError);
        // Continuer même si l'ajout de l'hôte échoue, il sera ajouté plus tard
      } else {
        console.log('Hôte ajouté avec succès:', hostPlayer);
      }

      // Ajouter les questions à la partie
      if (questions.length > 0) {
        const questionsToInsert = questions.map((text, index) => ({
          party_id: (data as any).id,
          question_text: text,
          question_index: index
        }));

        const { error: questionsError } = await supabase
          .from('party_questions')
          .insert(questionsToInsert);

        if (questionsError) {
          console.error('Erreur ajout questions:', questionsError);
        }

        // Créer l'état de jeu initial
        const { error: gameStateError } = await supabase
          .from('game_state')
          .insert({
            party_id: (data as any).id,
            current_question_index: 0,
            current_phase: 'waiting',
            total_questions: questions.length
          });

        if (gameStateError) {
          console.error('Erreur création game_state:', gameStateError);
        }
      }

      // Charger la partie avec ses joueurs (qui incluent maintenant l'hôte)
      const mapped = await loadGame(code);
      if (mapped) {
        setGameData(mapped);
        // Marquer comme hôte si c'est le premier joueur
        if (mapped.players && mapped.players.length > 0) {
          setIsHost(true);
        }
      }
      
      return mapped;
    } catch (error) {
      console.error('Erreur lors de la création de la partie:', error);
      return null;
    }
  };

  const addPlayerToGame = async (player: Player) => {
    if (!gameData) return null;

    try {
      const existingPlayers = gameData.players || [];
      // Si la session a déjà un ID joueur DB présent dans la partie, on le réutilise (évite la réinsertion au rafraîchissement)
      try {
        const stored = sessionStorage.getItem('playerData');
        const sessionId = stored ? JSON.parse(stored).id : undefined;
        if (sessionId) {
          const existingById = existingPlayers.find((p) => String(p.id) === String(sessionId));
          if (existingById) {
            console.log('Joueur déjà présent, réutilisation:', existingById);
            return existingById;
          }
        }
      } catch (_) {}

      // Vérifier par nom pour éviter les doublons
      const existingByName = existingPlayers.find((p) => p.name === player.name);
      if (existingByName) {
        console.log('Joueur avec ce nom déjà présent:', existingByName);
        return existingByName;
      }

      console.log('Ajout d\'un nouveau joueur:', player.name);
      const { data, error } = await supabase
        .from('game_players')
        .insert({
          game_id: gameData.id,
          pseudo_temporaire: player.name,
          user_id: null,
        })
        .select('id, pseudo_temporaire')
        .maybeSingle();

      if (error || !data) {
        console.error("Erreur lors de l'ajout du joueur:", error);
        return null;
      }

      const created: Player = {
        id: String((data as any).id),
        name: (data as any).pseudo_temporaire || player.name,
        status: 'onroom' as const,
        avatar:
          player.avatar ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            (data as any).pseudo_temporaire || player.name
          )}&background=10b981&color=fff`,
      };

      console.log('Joueur créé avec succès:', created);

      // Mettre à jour l'état local immédiatement
      setGameData({ ...gameData, players: [...existingPlayers, created] });

      return created;
    } catch (error) {
      console.error("Erreur lors de l'ajout du joueur:", error);
      return null;
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
        
        // Vérifier si l'utilisateur actuel est l'hôte (simple: premier joueur)
        const playerData = sessionStorage.getItem('playerData');
        if (playerData) {
          try {
            const currentPlayer = JSON.parse(playerData);
            setIsHost(game.players[0]?.name?.toLowerCase() === currentPlayer.name?.toLowerCase());
          } catch (error) {
            console.error('Erreur lors du parsing des données du joueur:', error);
          }
        }
      }
      
      setIsLoading(false);
    };

    initializeGame();
  }, [gameCode]);

  useEffect(() => {
    if (!gameCode || !gameData) return;

    // Écoute des changements sur la partie (statut)
    const partyChannel = supabase
      .channel(`party_${gameCode}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'parties',
          filter: `code_invitation=eq.${gameCode.toUpperCase()}`
        },
        async (payload) => {
          if (payload.new) {
            const refreshed = await loadGame(gameCode);
            if (refreshed) setGameData(refreshed);
          }
        }
      )
      .subscribe();

    // Écoute des changements sur les joueurs de la partie
    const playersChannel = supabase
      .channel(`party_players_${gameCode}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'game_players',
          filter: `game_id=eq.${gameData.id}`
        },
        async () => {
          const refreshed = await loadGame(gameCode);
          if (refreshed) setGameData(refreshed);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(partyChannel);
      supabase.removeChannel(playersChannel);
    };
  }, [gameCode, gameData?.id]);

  return {
    gameData,
    isHost,
    isLoading,
    addPlayerToGame,
    createGame,
    loadGame
  };
};