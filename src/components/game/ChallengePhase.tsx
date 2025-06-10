
import { useState } from 'react';
import { Player } from '@/types/onlineGame';
import PlayerAvatar from '@/components/PlayerAvatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dice6, Trophy, CheckCircle } from 'lucide-react';

interface ChallengePhaseProps {
  winner: Player;
  players: Player[];
  currentPlayer: Player;
  onChallengeComplete: () => void;
}

const ChallengePhase = ({ winner, players, currentPlayer, onChallengeComplete }: ChallengePhaseProps) => {
  const [phase, setPhase] = useState<'draw' | 'write-challenge' | 'execute-challenge' | 'completed'>('draw');
  const [challengeGiver, setChallengeGiver] = useState<Player | null>(null);
  const [challenge, setChallenge] = useState('');
  const [isDrawing, setIsDrawing] = useState(false);

  const drawChallengeGiver = () => {
    setIsDrawing(true);
    
    // Exclure le gagnant du tirage au sort
    const eligiblePlayers = players.filter(p => p.id !== winner.id);
    
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * eligiblePlayers.length);
      const selectedPlayer = eligiblePlayers[randomIndex];
      setChallengeGiver(selectedPlayer);
      setPhase('write-challenge');
      setIsDrawing(false);
    }, 2000);
  };

  const submitChallenge = () => {
    if (challenge.trim()) {
      setPhase('execute-challenge');
    }
  };

  const markChallengeComplete = () => {
    setPhase('completed');
    setTimeout(() => {
      onChallengeComplete();
    }, 2000);
  };

  return (
    <div className="bg-card p-6 rounded-lg shadow-md space-y-6">
      {phase === 'draw' && (
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2">
              <Trophy className="h-6 w-6 text-yellow-500" />
              Gagnant de cette manche !
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center">
              <div className="flex flex-col items-center">
                <PlayerAvatar
                  name={winner.name}
                  size="lg"
                  highlighted={true}
                  status={winner.status}
                />
                <span className="mt-2 text-xl font-bold">{winner.name}</span>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-muted-foreground mb-4">
                Tirage au sort pour choisir qui donnera le gage...
              </p>
              <Button 
                onClick={drawChallengeGiver}
                disabled={isDrawing}
                className="gap-2"
              >
                <Dice6 className={`h-4 w-4 ${isDrawing ? 'animate-spin' : ''}`} />
                {isDrawing ? 'Tirage en cours...' : 'Lancer le tirage'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {phase === 'write-challenge' && challengeGiver && (
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Gage à donner</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="flex justify-center gap-4 items-center mb-4">
                <div className="flex flex-col items-center">
                  <PlayerAvatar
                    name={challengeGiver.name}
                    size="md"
                    highlighted={true}
                    status={challengeGiver.status}
                  />
                  <span className="mt-1 font-medium">{challengeGiver.name}</span>
                  <span className="text-sm text-muted-foreground">Donne le gage</span>
                </div>
                <span className="text-2xl">→</span>
                <div className="flex flex-col items-center">
                  <PlayerAvatar
                    name={winner.name}
                    size="md"
                    highlighted={true}
                    status={winner.status}
                  />
                  <span className="mt-1 font-medium">{winner.name}</span>
                  <span className="text-sm text-muted-foreground">Exécute le gage</span>
                </div>
              </div>
            </div>

            {currentPlayer.id === challengeGiver.id ? (
              <div className="space-y-4">
                <Textarea
                  placeholder="Écris un gage pour le gagnant..."
                  value={challenge}
                  onChange={(e) => setChallenge(e.target.value)}
                  className="min-h-[100px]"
                />
                <Button 
                  onClick={submitChallenge}
                  disabled={!challenge.trim()}
                  className="w-full"
                >
                  Valider le gage
                </Button>
              </div>
            ) : (
              <div className="text-center text-muted-foreground">
                En attente que {challengeGiver.name} écrive le gage...
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {phase === 'execute-challenge' && challengeGiver && (
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Exécution du gage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center mb-4">
              <div className="flex justify-center mb-4">
                <div className="flex flex-col items-center">
                  <PlayerAvatar
                    name={winner.name}
                    size="lg"
                    highlighted={true}
                    status={winner.status}
                  />
                  <span className="mt-2 text-xl font-bold">{winner.name}</span>
                </div>
              </div>
              
              <div className="bg-secondary/50 p-4 rounded-lg mb-4">
                <p className="text-sm text-muted-foreground mb-1">
                  Gage donné par {challengeGiver.name} :
                </p>
                <p className="text-lg font-medium">{challenge}</p>
              </div>
            </div>

            {currentPlayer.id === winner.id ? (
              <Button 
                onClick={markChallengeComplete}
                className="w-full gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                J'ai fait le gage !
              </Button>
            ) : (
              <div className="text-center text-muted-foreground">
                En attente que {winner.name} confirme avoir fait le gage...
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {phase === 'completed' && (
        <Card className="text-center">
          <CardContent className="pt-6">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Gage accompli !</h3>
            <p className="text-muted-foreground">Passage à la question suivante...</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ChallengePhase;
