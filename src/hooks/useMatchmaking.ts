
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameType } from '@/types/onlineGame';
import { useToast } from '@/hooks/use-toast';

export const useMatchmaking = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [matchmaking, setMatchmaking] = useState(false);
  const [matchmakingType, setMatchmakingType] = useState<GameType>('classic');
  const [countdown, setCountdown] = useState(0);

  const startMatchmaking = (type: GameType) => {
    setMatchmaking(true);
    setMatchmakingType(type);
    setCountdown(10);
    
    // Simuler le compte à rebours et trouver une partie
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          
          // Simuler qu'on a trouvé une partie
          toast({
            title: 'Partie trouvée !',
            description: "Redirection vers la salle d'attente..."
          });
          
          setTimeout(() => {
            // Générer un code aléatoire et naviguer vers la salle d'attente
            const gameCode = Math.random().toString(36).substring(2, 8).toUpperCase();
            sessionStorage.setItem('playerData', JSON.stringify({
              name: 'Joueur' + Math.floor(Math.random() * 1000),
              id: Date.now(),
              gameCode
            }));
            navigate(`/waiting-room/${gameCode}`);
          }, 1000);
          
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  };
  
  const cancelMatchmaking = () => {
    setMatchmaking(false);
    setCountdown(0);
  };

  return {
    matchmaking,
    matchmakingType,
    countdown,
    startMatchmaking,
    cancelMatchmaking
  };
};
