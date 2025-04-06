
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  ChevronLeft, 
  Settings,
  Play,
  Plus
} from 'lucide-react';
import QRCodeDisplay from '@/components/QRCodeDisplay';
import PlayerAvatar from '@/components/PlayerAvatar';

// Données fictives pour simuler des joueurs qui rejoignent
const fakePlayers = [
  { id: 1, name: 'Alex', avatar: undefined },
  { id: 2, name: 'Sam', avatar: undefined },
  { id: 3, name: 'Jordan', avatar: undefined },
  { id: 4, name: 'Taylor', avatar: undefined },
];

const predefinedQuestions = [
  "...dormir au boulot?",
  "...oublier l'anniversaire de son/sa partenaire?",
  "...devenir célèbre sur TikTok?",
  "...dépenser tout son argent en une journée?",
  "...adopter 10 chats?",
  "...quitter son travail pour voyager?",
  "...se perdre même avec un GPS?",
  "...gagner à la loterie et tout perdre en un an?",
  "...faire une gaffe embarrassante en public?",
  "...survivre à une apocalypse zombie?"
];

const CreateGame = () => {
  const { gameCode } = useParams();
  const navigate = useNavigate();
  
  const [players, setPlayers] = useState<typeof fakePlayers>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [availableQuestions, setAvailableQuestions] = useState<string[]>(predefinedQuestions);

  useEffect(() => {
    // Simuler des joueurs qui rejoignent progressivement
    const timer = setInterval(() => {
      if (players.length < fakePlayers.length) {
        setPlayers(prev => [...prev, fakePlayers[prev.length]]);
      } else {
        clearInterval(timer);
      }
    }, 1500);

    return () => clearInterval(timer);
  }, [players.length]);

  const addQuestion = (question: string) => {
    setSelectedQuestions(prev => [...prev, question]);
    setAvailableQuestions(prev => prev.filter(q => q !== question));
  };

  const removeQuestion = (question: string) => {
    setSelectedQuestions(prev => prev.filter(q => q !== question));
    setAvailableQuestions(prev => [...prev, question]);
  };

  const startGame = () => {
    if (selectedQuestions.length > 0 && players.length > 0) {
      // Enregistrer les données du jeu dans sessionStorage pour y accéder dans la page de jeu
      sessionStorage.setItem('gameData', JSON.stringify({
        gameCode,
        players,
        questions: selectedQuestions
      }));
      navigate(`/play/${gameCode}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30 py-6 px-4">
      <div className="container mx-auto max-w-4xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Retour
        </Button>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h1 className="text-3xl font-bold mb-6">Créer une partie</h1>
            
            <Card className="p-6 mb-8">
              <h2 className="text-xl font-bold mb-4">Joueurs ({players.length})</h2>
              
              <div className="flex flex-wrap gap-3 mb-4">
                {players.map(player => (
                  <PlayerAvatar
                    key={player.id}
                    name={player.name}
                    image={player.avatar}
                    size="md"
                  />
                ))}
                {players.length < 10 && (
                  <div className="h-12 w-12 rounded-full border-2 border-dashed border-muted-foreground/50 flex items-center justify-center">
                    <Plus className="h-5 w-5 text-muted-foreground/50" />
                  </div>
                )}
              </div>
              
              <p className="text-sm text-muted-foreground mb-4">
                En attente de joueurs... Partagez le code ou le QR code pour inviter plus de joueurs.
              </p>
            </Card>
            
            <Card className="p-6 mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Questions sélectionnées ({selectedQuestions.length})</h2>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" /> Options
                </Button>
              </div>
              
              {selectedQuestions.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  Sélectionnez des questions dans la liste ci-dessous
                </p>
              ) : (
                <ul className="space-y-2">
                  {selectedQuestions.map(question => (
                    <li 
                      key={question} 
                      className="flex justify-between items-center p-2 bg-secondary rounded-md"
                    >
                      <span>Qui est le plus susceptible de {question}</span>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => removeQuestion(question)}
                      >
                        Retirer
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
            
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Questions disponibles</h2>
              
              <ul className="space-y-2 max-h-64 overflow-y-auto pr-2">
                {availableQuestions.map(question => (
                  <li 
                    key={question} 
                    className="flex justify-between items-center p-2 hover:bg-secondary/50 rounded-md cursor-pointer"
                    onClick={() => addQuestion(question)}
                  >
                    <span>Qui est le plus susceptible de {question}</span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                    >
                      Ajouter
                    </Button>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
          
          <div className="flex flex-col">
            <QRCodeDisplay gameCode={gameCode || ''} />
            
            <div className="flex-1 flex items-end justify-center mt-8">
              <Button 
                size="lg" 
                className="gap-2"
                disabled={selectedQuestions.length === 0 || players.length === 0}
                onClick={startGame}
              >
                <Play className="h-5 w-5" />
                Commencer la partie
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateGame;
