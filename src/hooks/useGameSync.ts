
import { useState, useEffect } from 'react';
import { Player } from '@/types/onlineGame';

interface GameData {
  gameCode: string | null;
  players: Player[];
  questions: string[];
  aiGenerated: boolean;
  hostId: string; // ID de l'hôte pour identification
}

// Simuler une synchronisation globale avec localStorage partagé - SEULEMENT pour les données de jeu
const SYNC_KEY = 'game_sync_';

export const useGameSync = (gameCode: string | null) => {
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [isHost, setIsHost] = useState(false);

  const syncKey = gameCode ? `${SYNC_KEY}${gameCode}` : null;

  // Fonction pour sauvegarder les données synchronisées (SEULEMENT les données de jeu)
  const saveGameData = (data: GameData) => {
    if (syncKey) {
      localStorage.setItem(syncKey, JSON.stringify(data));
      setGameData(data);
    }
  };

  // Fonction pour ajouter un joueur à la partie
  const addPlayerToGame = (player: Player) => {
    if (!gameData || !syncKey) return;

    const existingData = localStorage.getItem(syncKey);
    let currentData = gameData;

    if (existingData) {
      try {
        currentData = JSON.parse(existingData);
      } catch (error) {
        console.error('Erreur parsing game data:', error);
      }
    }

    // Vérifier si le joueur existe déjà
    const playerExists = currentData.players.some(p => p.id === player.id);
    if (!playerExists) {
      const updatedData = {
        ...currentData,
        players: [...currentData.players, player]
      };
      saveGameData(updatedData);
    }
  };

  // Fonction pour initialiser la partie (hôte seulement)
  const initializeGame = (hostPlayer: Player, questions: string[]) => {
    if (!syncKey) return;

    const newGameData: GameData = {
      gameCode: gameCode!,
      players: [hostPlayer],
      questions,
      aiGenerated: false,
      hostId: hostPlayer.id // Marquer qui est l'hôte
    };

    saveGameData(newGameData);
    setIsHost(true);
    
    // Sauvegarder SEULEMENT les données du joueur actuel dans sessionStorage
    // PAS les données de tous les joueurs
    sessionStorage.setItem('currentPlayerData', JSON.stringify(hostPlayer));
  };

  // Fonction pour rejoindre une partie (invité)
  const joinGame = (guestPlayer: Player) => {
    if (!gameData || !syncKey) return;

    // Sauvegarder SEULEMENT les données du joueur invité
    sessionStorage.setItem('currentPlayerData', JSON.stringify(guestPlayer));
    
    // Ajouter le joueur à la partie partagée
    addPlayerToGame(guestPlayer);
    
    // L'invité n'est PAS l'hôte
    setIsHost(false);
  };

  // Écouter les changements dans localStorage (SEULEMENT pour les données de jeu)
  useEffect(() => {
    if (!syncKey) return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === syncKey && e.newValue) {
        try {
          const newData = JSON.parse(e.newValue);
          setGameData(newData);
        } catch (error) {
          console.error('Erreur lors de la synchronisation:', error);
        }
      }
    };

    // Charger les données initiales de la partie
    const existingData = localStorage.getItem(syncKey);
    if (existingData) {
      try {
        const data = JSON.parse(existingData);
        setGameData(data);
        
        // Vérifier si l'utilisateur actuel est l'hôte en comparant avec ses propres données
        const currentPlayerData = sessionStorage.getItem('currentPlayerData');
        if (currentPlayerData) {
          const currentPlayer = JSON.parse(currentPlayerData);
          setIsHost(data.hostId === currentPlayer.id);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      }
    }

    // Écouter les changements
    window.addEventListener('storage', handleStorageChange);

    // Polling pour détecter les changements
    const interval = setInterval(() => {
      const currentData = localStorage.getItem(syncKey);
      if (currentData) {
        try {
          const data = JSON.parse(currentData);
          setGameData(prevData => {
            if (JSON.stringify(prevData) !== JSON.stringify(data)) {
              return data;
            }
            return prevData;
          });
        } catch (error) {
          console.error('Erreur polling:', error);
        }
      }
    }, 2000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [syncKey]);

  return {
    gameData,
    isHost,
    addPlayerToGame,
    initializeGame,
    joinGame,
    saveGameData
  };
};
