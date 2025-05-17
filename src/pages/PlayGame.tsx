
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import QuestionCard from '@/components/QuestionCard';
import PlayerAvatar from '@/components/PlayerAvatar';
import Confetti from '@/components/Confetti';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowRight, 
  ChevronLeft, 
  Users,
  Sparkles
} from 'lucide-react';

interface Player {
  id: number;
  name: string;
  avatar?: string;
}

interface GameData {
  gameCode: string;
  players: Player[];
  questions: string[];
  aiGenerated?: boolean;
}

const PlayGame = () => {
  const { gameCode } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [votingPhase, setVotingPhase] = useState(true);
  const [votes, setVotes] = useState<Record<number, number>>({});
  const [showConfetti, setShowConfetti] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  
  useEffect(() => {
    const storedGameData = sessionStorage.getItem('gameData');
    if (storedGameData) {
      setGameData(JSON.parse(storedGameData));
    } else {
      toast({
        title: "Erreur",
        description: "Données de jeu non trouvées",
        variant: "destructive"
      });
      navigate('/');
    }
  }, [navigate, toast]);
  
  const handleVote = (player: Player) => {
    if (!votingPhase) return;
    
    setSelectedPlayer(player);
  };
  
  const confirmVote = () => {
    if (!selectedPlayer || !votingPhase) return;
    
    setVotingPhase(false);
    
    const newVotes: Record<number, number> = {};
    
    if (gameData) {
      gameData.players.forEach(player => {
        newVotes[player.id] = Math.floor(Math.random() * 4);
      });
      
      newVotes[selectedPlayer.id] = (newVotes[selectedPlayer.id] || 0) + 1;
      
      setVotes(newVotes);
      
      setTimeout(() => {
        setShowConfetti(true);
      }, 2000);
    }
  };
  
  const nextQuestion = () => {
    if (!gameData) return;
    
    if (currentQuestionIndex < gameData.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setVotingPhase(true);
      setSelectedPlayer(null);
      setVotes({});
      setShowConfetti(false);
    } else {
      setGameOver(true);
    }
  };
  
  const getWinningPlayer = (): Player | null => {
    if (!gameData || Object.keys(votes).length === 0) return null;
    
    const playerIdWithMaxVotes = Object.entries(votes)
      .reduce((max, [playerId, voteCount]) => {
        return voteCount > votes[parseInt(max)] ? playerId : max;
      }, Object.keys(votes)[0]);
    
    return gameData.players.find(p => p.id === parseInt(playerIdWithMaxVotes)) || null;
  };
  
  const winningPlayer = getWinningPlayer();
  
  if (!gameData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Chargement du jeu...</p>
      </div>
    );
  }
  
  const currentQuestion = gameData.questions[currentQuestionIndex];

  if (gameOver) {
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
              <Button onClick={() => navigate('/')}>Accueil</Button>
              <Button variant="outline" onClick={() => {
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
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30 py-4 px-4">
      <Confetti active={showConfetti} />
      
      <div className="container mx-auto max-w-3xl">
        <div className="flex justify-between items-center mb-6">
          <Button 
            variant="ghost"
            size="sm"
            onClick={() => {
              if (confirm("Quitter la partie ?")) {
                navigate('/');
              }
            }}
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Quitter
          </Button>
          
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {gameData.players.length} joueurs
            </span>
          </div>
          
          <div className="text-sm font-medium">
            Question {currentQuestionIndex + 1}/{gameData.questions.length}
          </div>
        </div>
        
        <div className="mb-8">
          <QuestionCard 
            question={currentQuestion} 
            isAIGenerated={gameData.aiGenerated}
          />
        </div>
        
        {votingPhase ? (
          <div className="bg-card p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium mb-4 text-center">Vote pour un joueur</h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
              {gameData.players.map(player => (
                <div 
                  key={player.id}
                  className={`
                    flex flex-col items-center p-3 rounded-lg cursor-pointer transition-all
                    ${selectedPlayer?.id === player.id 
                      ? 'bg-primary/20 border-2 border-primary' 
                      : 'hover:bg-secondary'}
                  `}
                  onClick={() => handleVote(player)}
                >
                  <PlayerAvatar
                    name={player.name}
                    image={player.avatar}
                    size="md"
                    highlighted={selectedPlayer?.id === player.id}
                  />
                  <span className="mt-2 font-medium text-sm">{player.name}</span>
                </div>
              ))}
            </div>
            
            <div className="flex justify-center">
              <Button 
                onClick={confirmVote}
                disabled={!selectedPlayer}
              >
                Confirmer mon vote
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-card p-6 rounded-lg shadow-md animate-reveal">
            <h3 className="text-lg font-medium mb-6 text-center">Résultats</h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
              {gameData.players.map(player => (
                <div 
                  key={player.id}
                  className={`
                    flex flex-col items-center p-3 rounded-lg
                    ${winningPlayer?.id === player.id ? 'bg-primary/20 border-2 border-primary animate-pulse-slow' : ''}
                  `}
                >
                  <PlayerAvatar
                    name={player.name}
                    image={player.avatar}
                    size="md"
                    highlighted={winningPlayer?.id === player.id}
                    count={votes[player.id] || 0}
                  />
                  <span className="mt-2 font-medium text-sm">{player.name}</span>
                </div>
              ))}
            </div>
            
            {winningPlayer && (
              <div className="text-center mb-6">
                <p className="text-xl font-bold">
                  {winningPlayer.name} est le plus susceptible de {currentQuestion.toLowerCase()}
                </p>
              </div>
            )}
            
            <div className="flex justify-center">
              <Button 
                onClick={nextQuestion}
                className="gap-2"
              >
                Question suivante
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayGame;
