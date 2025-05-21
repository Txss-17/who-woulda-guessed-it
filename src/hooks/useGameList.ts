
import { useState, useEffect } from 'react';
import { OnlineGame, Player } from '@/types/onlineGame';

export const useGameList = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [publicGames, setPublicGames] = useState<OnlineGame[]>([]);

  // Simuler le chargement des parties publiques
  useEffect(() => {
    setIsLoading(true);
    
    setTimeout(() => {
      const fakeGames: OnlineGame[] = [
        {
          id: 'game1',
          name: 'Soirée Fun',
          players: { 
            count: 3, 
            max: 6, 
            list: [
              { id: 'p1', name: 'Alex', status: 'online' },
              { id: 'p2', name: 'Robin', status: 'online' },
              { id: 'p3', name: 'Charlie', status: 'online' }
            ]
          },
          host: 'Alex',
          type: 'classic',
          status: 'waiting'
        },
        {
          id: 'game2',
          name: 'Questions Love',
          players: { 
            count: 2, 
            max: 4,
            list: [
              { id: 'p4', name: 'Jordan', status: 'online' },
              { id: 'p5', name: 'Sam', status: 'online' }
            ]
          },
          host: 'Jordan',
          type: 'love',
          status: 'waiting'
        },
        {
          id: 'game3',
          name: 'Entre amis',
          players: { 
            count: 4, 
            max: 5,
            list: [
              { id: 'p6', name: 'Taylor', status: 'online' },
              { id: 'p7', name: 'Morgan', status: 'online' },
              { id: 'p8', name: 'Casey', status: 'online' },
              { id: 'p9', name: 'Riley', status: 'online' }
            ] 
          },
          host: 'Taylor',
          type: 'friendly',
          status: 'waiting'
        },
        {
          id: 'game4',
          name: 'Party Night',
          players: { 
            count: 5, 
            max: 8,
            list: [
              { id: 'p10', name: 'Sam', status: 'online' },
              { id: 'p11', name: 'Alex', status: 'online' },
              { id: 'p12', name: 'Jamie', status: 'online' },
              { id: 'p13', name: 'Blake', status: 'online' },
              { id: 'p14', name: 'Quinn', status: 'online' }
            ]
          },
          host: 'Sam',
          type: 'party',
          status: 'playing'
        }
      ];
      
      setPublicGames(fakeGames);
      setIsLoading(false);
    }, 1500);
  }, []);

  return {
    isLoading,
    publicGames
  };
};
