
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronLeft, Play, X, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';

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

const QuickGame = () => {
  const navigate = useNavigate();
  const [players, setPlayers] = useState<string[]>(['']);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>(predefinedQuestions.slice(0, 5));
  
  const addPlayer = () => {
    setPlayers([...players, '']);
  };
  
  const removePlayer = (index: number) => {
    const newPlayers = [...players];
    newPlayers.splice(index, 1);
    setPlayers(newPlayers);
  };
  
  const updatePlayer = (index: number, name: string) => {
    const newPlayers = [...players];
    newPlayers[index] = name;
    setPlayers(newPlayers);
  };
  
  const toggleQuestion = (question: string) => {
    if (selectedQuestions.includes(question)) {
      setSelectedQuestions(selectedQuestions.filter(q => q !== question));
    } else {
      setSelectedQuestions([...selectedQuestions, question]);
    }
  };
  
  const startGame = () => {
    // Vérifier que tous les joueurs ont un nom
    const validPlayers = players.filter(name => name.trim() !== '');
    if (validPlayers.length < 2) {
      alert('Il faut au moins 2 joueurs pour jouer');
      return;
    }
    
    if (selectedQuestions.length === 0) {
      alert('Sélectionne au moins une question pour jouer');
      return;
    }
    
    // Créer les données du jeu
    const playerData = validPlayers.map((name, index) => ({
      id: index + 1,
      name: name.trim()
    }));
    
    const gameCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    // Enregistrer les données du jeu
    sessionStorage.setItem('gameData', JSON.stringify({
      gameCode,
      players: playerData,
      questions: selectedQuestions
    }));
    
    // Naviguer vers la page de jeu
    navigate(`/play/${gameCode}`);
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
        
        <h1 className="text-3xl font-bold mb-8">Partie rapide</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Joueurs</h2>
            
            <div className="space-y-3 mb-4">
              {players.map((player, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={player}
                    onChange={(e) => updatePlayer(index, e.target.value)}
                    placeholder={`Joueur ${index + 1}`}
                  />
                  
                  {players.length > 1 && (
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => removePlayer(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            
            <Button 
              variant="outline" 
              onClick={addPlayer}
              disabled={players.length >= 10}
              className="w-full"
            >
              Ajouter un joueur
            </Button>
            
            <div className="mt-6 text-sm text-muted-foreground text-center">
              Ajoute entre 2 et 10 joueurs pour jouer
            </div>
          </Card>
          
          <div className="flex flex-col">
            <Card className="p-6 mb-6 flex-grow">
              <h2 className="text-xl font-bold mb-4">Questions ({selectedQuestions.length})</h2>
              
              <div className="max-h-64 overflow-y-auto pr-2">
                {predefinedQuestions.map((question, index) => (
                  <div 
                    key={index}
                    className={`
                      flex items-center gap-2 p-2 rounded-md cursor-pointer mb-1
                      ${selectedQuestions.includes(question) ? 'bg-primary/20' : 'hover:bg-secondary'}
                    `}
                    onClick={() => toggleQuestion(question)}
                  >
                    <div className={`
                      w-5 h-5 rounded-full flex items-center justify-center
                      ${selectedQuestions.includes(question) ? 'bg-primary text-white' : 'border border-muted-foreground'}
                    `}>
                      {selectedQuestions.includes(question) && <Check className="h-3 w-3" />}
                    </div>
                    <span>Qui est le plus susceptible de {question}</span>
                  </div>
                ))}
              </div>
            </Card>
            
            <Button 
              size="lg" 
              className="gap-2"
              onClick={startGame}
              disabled={players.filter(p => p.trim()).length < 2 || selectedQuestions.length === 0}
            >
              <Play className="h-5 w-5" />
              Commencer la partie
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickGame;
