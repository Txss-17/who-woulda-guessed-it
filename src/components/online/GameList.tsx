
import { Card } from '@/components/ui/card';
import { useGameList } from '@/hooks/useGameList';
import GameItem from './GameItem';
import GameListLoading from './GameListLoading';
import EmptyGameList from './EmptyGameList';

interface GameListProps {
  onSwitchToMatchmaking: () => void;
}

const GameList = ({ onSwitchToMatchmaking }: GameListProps) => {
  const { isLoading, publicGames } = useGameList();
  
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
            <GameItem key={game.id} game={game} />
          ))}
        </div>
      )}
    </Card>
  );
};

export default GameList;
