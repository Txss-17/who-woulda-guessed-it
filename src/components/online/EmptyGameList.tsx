
import { Button } from '@/components/ui/button';

interface EmptyGameListProps {
  onSwitchToMatchmaking: () => void;
}

const EmptyGameList = ({ onSwitchToMatchmaking }: EmptyGameListProps) => {
  return (
    <div className="text-center py-10">
      <p className="text-muted-foreground">Aucune partie publique disponible.</p>
      <Button
        variant="outline"
        onClick={onSwitchToMatchmaking}
        className="mt-4"
      >
        Essayer le matchmaking
      </Button>
    </div>
  );
};

export default EmptyGameList;
