
import { useState, useEffect } from 'react';
import { Player } from '@/types/onlineGame';

interface GameData {
  gameCode: string | null;
  players: Player[];
  questions: string[];
  aiGenerated: boolean;
}

// Simuler une synchronisation globale avec localStorage partagé
const SYNC_KEY = 'game_sync_';

export const useGameSync = (gameCode: string | null) => {
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [isHost, setIsHost] = useState(false);

  const syncKey = gameCode ? `${SYNC_KEY}${gameCode}` : null;

  // Fonction pour sauvegarder les données synchronisées
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
      
      // Mettre à jour aussi sessionStorage pour compatibilité
      sessionStorage.setItem('gameData', JSON.stringify(updatedData));
    }
  };

  // Fonction pour initialiser la partie (hôte)
  const initializeGame = (hostPlayer: Player, questions: string[]) => {
    if (!syncKey) return;

    const newGameData: GameData = {
      gameCode: gameCode!,
      players: [hostPlayer],
      questions,
      aiGenerated: false
    };

    saveGameData(newGameData);
    setIsHost(true);
    
    // Mettre à jour sessionStorage
    sessionStorage.setItem('gameData', JSON.stringify(newGameData));
    sessionStorage.setItem('playerData', JSON.stringify(hostPlayer));
  };

  // Écouter les changements dans localStorage
  useEffect(() => {
    if (!syncKey) return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === syncKey && e.newValue) {
        try {
          const newData = JSON.parse(e.newValue);
          setGameData(newData);
          // Synchroniser avec sessionStorage
          sessionStorage.setItem('gameData', JSON.stringify(newData));
        } catch (error) {
          console.error('Erreur lors de la synchronisation:', error);
        }
      }
    };

    // Charger les données initiales
    const existingData = localStorage.getItem(syncKey);
    if (existingData) {
      try {
        const data = JSON.parse(existingData);
        setGameData(data);
        
        // Vérifier si l'utilisateur actuel est l'hôte
        const playerData = sessionStorage.getItem('playerData');
        if (playerData) {
          const currentPlayer = JSON.parse(playerData);
          setIsHost(data.players[0]?.id === currentPlayer.id);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      }
    }

    // Écouter les changements
    window.addEventListener('storage', handleStorageChange);

    // Polling pour détecter les changements (pour les onglets de même origine)
    const interval = setInterval(() => {
      const currentData = localStorage.getItem(syncKey);
      if (currentData) {
        try {
          const data = JSON.parse(currentData);
          setGameData(prevData => {
            if (JSON.stringify(prevData) !== JSON.stringify(data)) {
              sessionStorage.setItem('gameData', JSON.stringify(data));
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
    saveGameData
  };
};
