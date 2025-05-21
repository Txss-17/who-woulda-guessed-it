
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Confetti from '@/components/Confetti';
import { BarChart } from 'lucide-react';

interface GameResultProps {
  gameCode: string | undefined;
  gameData: {
    questions: string[];
    players: any[];
  };
  gameResults: any[];
}

const GameResult = ({ gameCode, gameData, gameResults }: GameResultProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30 py-8 px-4">
      <div className="container mx-auto max-w-2xl text-center">
        <Confetti active={true} />
        
        <h1 className="text-4xl font-bold mb-6 gradient-text">Partie terminée !</h1>
        
        <div className="bg-card p-8 rounded-xl shadow-lg mb-8 animate-reveal">
          <h2 className="text-2xl font-medium mb-4">Merci d'avoir joué !</h2>
          <p className="text-muted-foreground mb-6">
            Tu as joué {gameData.questions.length} questions avec {gameData.players.length} joueurs.
          </p>
          
          <div className="flex justify-center gap-3">
            <Button onClick={() => navigate('/')} variant="outline">Accueil</Button>
            <Button 
              onClick={() => navigate(`/vote-history/${gameCode}`)}
              className="gap-2"
            >
              <BarChart className="h-4 w-4" />
              Voir les votes
            </Button>
            <Button onClick={() => {
              const newGameCode = Math.random().toString(36).substring(2, 8).toUpperCase();
              navigate(`/create-game/${newGameCode}`);
            }}>
              Rejouer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameResult;
