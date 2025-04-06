
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  UserPlus, 
  PlayCircle, 
  PlusCircle,
  Menu
} from 'lucide-react';
import GameCard from '@/components/GameCard';

const Index = () => {
  const navigate = useNavigate();
  const [gameCode, setGameCode] = useState('');

  const generateRandomCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleCreateGame = () => {
    const newGameCode = generateRandomCode();
    navigate(`/create-game/${newGameCode}`);
  };

  const handleJoinGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (gameCode.trim()) {
      navigate(`/join/${gameCode.trim()}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      <header className="container mx-auto py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Users className="text-primary h-8 w-8" />
          <h1 className="text-2xl font-bold gradient-text">Who's Most Likely?</h1>
        </div>
        <Button variant="ghost" size="icon">
          <Menu className="h-6 w-6" />
        </Button>
      </header>

      <main className="container mx-auto px-4 pt-8 pb-20">
        <section className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-bold mb-3">
            Le jeu social du <span className="gradient-text">Qui est le plus susceptible de...</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Joue en ligne ou IRL, crée tes questions, vote anonymement et découvre ce que tes amis pensent vraiment de toi !
          </p>

          <div className="bg-card rounded-xl p-6 shadow-lg mb-12">
            <form onSubmit={handleJoinGame} className="flex flex-col sm:flex-row gap-2">
              <Input
                placeholder="Entre un code de partie"
                value={gameCode}
                onChange={(e) => setGameCode(e.target.value)}
                className="text-center sm:text-left"
              />
              <Button type="submit" className="whitespace-nowrap">
                Rejoindre
              </Button>
            </form>
          </div>
        </section>

        <section className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold mb-6">Choisis ton mode de jeu</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GameCard
              title="Créer une partie"
              description="Crée une nouvelle partie et invite tes amis à jouer"
              icon={<UserPlus className="h-6 w-6" />}
              onClick={handleCreateGame}
            />
            
            <GameCard
              title="Partie rapide"
              description="Joue immédiatement avec des questions prédéfinies"
              icon={<PlayCircle className="h-6 w-6" />}
              onClick={() => navigate('/quick-game')}
            />

            <GameCard
              title="Créer tes questions"
              description="Personnalise ton expérience avec tes propres questions"
              icon={<PlusCircle className="h-6 w-6" />}
              onClick={() => navigate('/create-questions')}
            />
            
            <GameCard
              title="Partie en ligne"
              description="Rejoins d'autres joueurs en ligne pour des parties publiques"
              icon={<Users className="h-6 w-6" />}
              onClick={() => navigate('/online')}
            />
          </div>
        </section>
      </main>

      <footer className="bg-background border-t py-6">
        <div className="container mx-auto text-center text-muted-foreground text-sm">
          © 2025 Who's Most Likely? - Le jeu social ultime entre amis
        </div>
      </footer>
    </div>
  );
};

export default Index;
