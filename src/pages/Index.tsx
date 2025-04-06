
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  UserPlus, 
  PlayCircle, 
  PlusCircle,
  Menu,
  ChevronRight
} from 'lucide-react';
import GameCard from '@/components/GameCard';
import { Blob, BackgroundDecoration, PatternBackground } from '@/components/DecorativeElements';

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
    <div className="relative min-h-screen bg-background overflow-hidden">
      <PatternBackground />
      <Blob color="primary" position="top-right" size="lg" className="-mt-20 -mr-20 opacity-30" />
      <Blob color="accent" position="bottom-left" size="lg" className="-mb-20 -ml-20 opacity-30" />
      
      <header className="container mx-auto py-6 px-4 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-2">
          <div className="text-primary h-8 w-8">
            <Users className="text-primary" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">
            <span className="text-primary">Who's Most </span>
            <span className="text-accent">Likely?</span>
          </h1>
        </div>
        <Button variant="ghost" size="icon">
          <Menu className="h-6 w-6" />
        </Button>
      </header>

      <main className="container mx-auto px-4 pt-4 pb-20 relative z-10">
        <section className="max-w-3xl mx-auto mb-16">
          <div className="text-center relative">
            <div className="absolute -top-16 right-0 text-yellow-300 hidden md:block">
              <img src="/lovable-uploads/e68db015-66ed-46a4-8499-41b3a5896ccd.png" alt="Decorative stars" className="w-32 h-32 object-contain" />
            </div>
            
            <h2 className="text-3xl sm:text-5xl font-bold mb-6 leading-tight">
              Le jeu social du <span className="text-primary">Qui est le</span> <span className="text-accent block">susceptible de...</span>
            </h2>
            
            <div className="flex flex-col md:flex-row items-center gap-8 justify-center mb-8">
              <div className="w-32 h-32 relative">
                <div className="absolute inset-0 bg-primary/10 rounded-lg transform -rotate-6"></div>
                <div className="absolute inset-0 bg-primary/20 rounded-lg transform rotate-3"></div>
                <div className="relative bg-white/80 border-2 border-primary/20 rounded-lg p-3 transform rotate-2 shadow-lg">
                  <img 
                    src="/lovable-uploads/e68db015-66ed-46a4-8499-41b3a5896ccd.png" 
                    alt="Liste de questions" 
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              
              <p className="text-lg max-w-xl text-center md:text-left">
                Joue en ligne ou IRL, crée tes questions, vote anonymement et découvre ce que tes amis pensent vraiment de toi !
              </p>
            </div>

            <form onSubmit={handleJoinGame} className="relative max-w-lg mx-auto">
              <div className="relative">
                <Input
                  placeholder="Entrez un code de partie"
                  value={gameCode}
                  onChange={(e) => setGameCode(e.target.value)}
                  className="pr-28 h-14 text-lg rounded-full bg-white/80 border-2 border-primary/20 shadow-lg"
                />
                <Button 
                  type="submit" 
                  className="absolute right-1 top-1 rounded-full h-12 px-6 bg-primary hover:bg-primary/90"
                >
                  Rejoindre
                </Button>
              </div>
            </form>
            
            <div className="absolute -bottom-16 right-4 md:right-0">
              <div className="relative w-28 h-28">
                <div className="absolute inset-0 bg-primary/30 rounded-full blur-xl"></div>
                <div className="relative bg-primary/10 rounded-full flex items-center justify-center w-full h-full">
                  <div className="text-primary text-5xl font-bold">?</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-5xl mx-auto">
          <h3 className="text-2xl sm:text-3xl font-bold mb-8 flex items-center">
            Choisis ton mode de jeu
            <div className="ml-4 relative">
              <div className="absolute -top-4 -right-12">
                <img 
                  src="/lovable-uploads/e68db015-66ed-46a4-8499-41b3a5896ccd.png" 
                  alt="Decorative elements" 
                  className="w-16 h-16 object-contain" 
                />
              </div>
            </div>
          </h3>
          
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
              rightIcon={<ChevronRight className="h-5 w-5" />}
            />

            <GameCard
              title="Créer tes questions"
              description="Personnalise ton expérience avec tes propres questions"
              icon={<PlusCircle className="h-6 w-6" />}
              onClick={() => navigate('/create-questions')}
              rightIcon={<ChevronRight className="h-5 w-5" />}
            />
            
            <GameCard
              title="Partie en ligne"
              description="Rejoins d'autres joueurs en ligne pour des parties publiques"
              icon={<Users className="h-6 w-6" />}
              onClick={() => navigate('/online')}
              rightIcon={<ChevronRight className="h-5 w-5" />}
            />
          </div>
        </section>
      </main>

      <footer className="bg-background border-t py-6 relative z-10">
        <div className="container mx-auto text-center text-muted-foreground text-sm">
          © 2025 Who's Most Likely? - Le jeu social ultime entre amis
        </div>
      </footer>
    </div>
  );
};

export default Index;
