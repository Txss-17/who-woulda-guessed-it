
import { Card } from '@/components/ui/card';
import { useGameList } from '@/hooks/useGameList';
import GameItem from './GameItem';
import GameListLoading from './GameListLoading';
import EmptyGameList from './EmptyGameList';
import { useToast } from '@/hooks/use-toast';

interface GameListProps {
  onSwitchToMatchmaking: () => void;
}

const GameList = ({ onSwitchToMatchmaking }: GameListProps) => {
  const { isLoading, publicGames } = useGameList();
  const { toast } = useToast();
  
  const handleJoinGame = (gameId: string) => {
    // Simuler la tentative de rejoindre une partie
    toast({
      title: "Rejoindre la partie",
      description: "Tentative de connexion à la partie...",
    });
    
    // Ici on pourrait rediriger vers la salle d'attente de la partie
    console.log('Joining game:', gameId);
  };
  
  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-6">Parties disponibles</h2>
      
      {isLoading ? (
        <GameListLoading />
      ) : publicGames.length === 0 ? (
        <EmptyGameList onSwitchToMatchmaking={onSwitchToMatchmaking} />
      ) : (
        <div className="space-y-4">
          {publicGames.map(game => (
            <GameItem key={game.id} game={game} onJoin={handleJoinGame} />
          ))}
        </div>
      )}
    </Card>
  );
};

export default GameList;
