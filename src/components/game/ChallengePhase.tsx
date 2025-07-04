import { useState } from 'react';
import { Player } from '@/types/onlineGame';
import PlayerAvatar from '@/components/PlayerAvatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dice6, Trophy, CheckCircle, Eye, EyeOff, Clock } from 'lucide-react';

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
  const [showWinner, setShowWinner] = useState(false);

  const drawChallengeGiver = () => {
    setIsDrawing(true);
    setShowWinner(true);
    
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
              <Trophy className="h-6 w-6 text-yellow-500" />
              Résultats de cette manche
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {showWinner ? (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="flex flex-col items-center p-4 bg-yellow-50 rounded-lg border-2 border-yellow-200">
                    <PlayerAvatar
                      name={winner.name}
                      size="lg"
                      highlighted={true}
                      status={winner.status}
                    />
                    <span className="mt-2 text-xl font-bold text-yellow-700">{winner.name}</span>
                    <span className="text-sm text-yellow-600">A reçu le plus de votes</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-muted-foreground">
                  <Eye className="h-8 w-8 mx-auto mb-2" />
                  <p>Les résultats sont cachés...</p>
                </div>
              </div>
            )}
            
            <div className="text-center">
              <p className="text-muted-foreground mb-4">
                {isDrawing ? "Tirage au sort en cours..." : "Tirage au sort pour choisir qui donnera le gage"}
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
            <CardTitle className="text-center">Attribution du gage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Seul le donneur de gage voit qui a gagné et peut écrire le gage */}
            {currentPlayer.id === challengeGiver.id ? (
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="text-center mb-4">
                    <p className="text-sm text-blue-600 mb-2">Vous avez été tiré au sort !</p>
                    <div className="flex justify-center gap-4 items-center">
                      <div className="flex flex-col items-center">
                        <PlayerAvatar
                          name={challengeGiver.name}
                          size="md"
                          highlighted={true}
                          status={challengeGiver.status}
                        />
                        <span className="mt-1 font-medium text-sm">{challengeGiver.name}</span>
                        <span className="text-xs text-blue-600">Vous donnez le gage</span>
                      </div>
                      <span className="text-2xl">→</span>
                      <div className="flex flex-col items-center">
                        <PlayerAvatar
                          name={winner.name}
                          size="md"
                          highlighted={true}
                          status={winner.status}
                        />
                        <span className="mt-1 font-medium text-sm">{winner.name}</span>
                        <span className="text-xs text-orange-600">Doit faire le gage</span>
                      </div>
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
                  <EyeOff className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                  <p className="text-gray-600 mb-2">Tirage au sort terminé</p>
                  <p className="text-sm text-gray-500">
                    Un joueur a été sélectionné pour donner un gage...
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
                      <span className="text-sm text-orange-600">C'est à vous !</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <p className="text-sm text-orange-600 mb-2">Votre gage :</p>
                  <p className="text-lg font-medium text-orange-800">{challenge}</p>
                </div>

                <Button 
                  onClick={markChallengeComplete}
                  className="w-full gap-2 bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4" />
                  J'ai fait le gage !
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <Clock className="h-12 w-12 mx-auto mb-3 text-gray-400 animate-pulse" />
                  <p className="text-gray-600 mb-2">Gage en cours d'exécution</p>
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
            <p className="text-muted-foreground">Passage à la question suivante...</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ChallengePhase;
