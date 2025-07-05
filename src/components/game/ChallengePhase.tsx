import { useState } from 'react';
import { Player } from '@/types/onlineGame';
import PlayerAvatar from '@/components/PlayerAvatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dice6, CheckCircle, Clock, EyeOff } from 'lucide-react';

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
    }, 3000);
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
              <Dice6 className="h-6 w-6 text-primary" />
              Tirage au sort en cours
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center py-8">
              <div className="bg-gray-50 p-6 rounded-lg">
                <EyeOff className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                <p className="text-gray-600 mb-2">Les résultats sont cachés</p>
                <p className="text-sm text-gray-500 mb-4">
                  Tirage au sort pour désigner qui donnera le gage...
                </p>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-muted-foreground mb-4">
                {isDrawing ? "Tirage au sort en cours..." : "Cliquez pour lancer le tirage au sort"}
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
            <CardTitle className="text-center">Phase de gage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Seul le donneur de gage voit cette interface */}
            {currentPlayer.id === challengeGiver.id ? (
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="text-center mb-4">
                    <p className="text-lg font-medium text-blue-700 mb-2">Vous avez été sélectionné !</p>
                    <p className="text-sm text-blue-600">
                      Vous devez donner un gage à un joueur (son identité vous sera révélée)
                    </p>
                  </div>
                  
                  <div className="flex justify-center mb-4">
                    <div className="flex flex-col items-center p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <PlayerAvatar
                        name={winner.name}
                        size="md"
                        highlighted={true}
                        status={winner.status}
                      />
                      <span className="mt-2 font-medium text-sm">{winner.name}</span>
                      <span className="text-xs text-orange-600">Doit faire le gage</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium">Entrez le gage pour {winner.name} :</label>
                  <Textarea
                    placeholder="Écrivez un gage amusant mais respectueux..."
                    value={challenge}
                    onChange={(e) => setChallenge(e.target.value)}
                    className="min-h-[100px]"
                  />
                  <Button 
                    onClick={submitChallenge}
                    disabled={!challenge.trim()}
                    className="w-full"
                  >
                    Envoyer le gage
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <Clock className="h-12 w-12 mx-auto mb-3 text-gray-400 animate-pulse" />
                  <p className="text-gray-600 mb-2">Phase de gage en cours</p>
                  <p className="text-sm text-gray-500">
                    Un joueur est en train de préparer un gage...
                  </p>
                </div>
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
            {/* Seul le gagnant voit le gage et peut le marquer comme terminé */}
            {currentPlayer.id === winner.id ? (
              <div className="space-y-4">
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <div className="text-center mb-4">
                    <p className="text-lg font-medium text-orange-700 mb-2">C'est à vous !</p>
                    <p className="text-sm text-orange-600">
                      Vous avez reçu le plus de votes et devez réaliser ce gage
                    </p>
                  </div>
                  
                  <div className="bg-white p-4 rounded border">
                    <p className="text-sm text-orange-600 mb-2 font-medium">Votre gage :</p>
                    <p className="text-lg">{challenge}</p>
                  </div>
                </div>

                <Button 
                  onClick={markChallengeComplete}
                  className="w-full gap-2 bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4" />
                  J'ai réalisé le gage !
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <Clock className="h-12 w-12 mx-auto mb-3 text-gray-400 animate-pulse" />
                  <p className="text-gray-600 mb-2">Gage en cours de réalisation</p>
                  <p className="text-sm text-gray-500">
                    Un joueur est en train de faire son gage...
                  </p>
                </div>
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
            <p className="text-muted-foreground">Affichage des résultats finaux...</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ChallengePhase;