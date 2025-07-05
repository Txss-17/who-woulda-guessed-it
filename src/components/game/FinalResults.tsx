import { Player } from '@/types/onlineGame';
import PlayerAvatar from '@/components/PlayerAvatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Users, ArrowRight } from 'lucide-react';

interface QuestionResult {
  questionText: string;
  votes: { playerId: string; playerName: string; count: number }[];
  winner: { playerId: string; playerName: string };
}

interface FinalResultsProps {
  players: Player[];
  gameResults: QuestionResult[];
  onFinish: () => void;
}

const FinalResults = ({ players, gameResults, onFinish }: FinalResultsProps) => {
  // Calculer les scores totaux
  const totalScores = players.map(player => {
    const totalVotes = gameResults.reduce((sum, result) => {
      const playerVotes = result.votes.find(v => v.playerId === player.id);
      return sum + (playerVotes?.count || 0);
    }, 0);
    
    const wins = gameResults.filter(result => result.winner.playerId === player.id).length;
    
    return {
      player,
      totalVotes,
      wins,
      score: totalVotes * 10 + wins * 50 // Points pour votes reçus + bonus pour victoires
    };
  }).sort((a, b) => b.score - a.score);

  return (
    <div className="space-y-6">
      {/* Classement final */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            Classement Final
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {totalScores.map((result, index) => (
              <div 
                key={result.player.id}
                className={`flex items-center gap-4 p-4 rounded-lg ${
                  index === 0 ? 'bg-yellow-50 border-2 border-yellow-200' :
                  index === 1 ? 'bg-gray-50 border border-gray-200' :
                  index === 2 ? 'bg-orange-50 border border-orange-200' :
                  'bg-white border border-gray-100'
                }`}
              >
                <div className="text-2xl font-bold text-gray-500 w-8">
                  {index + 1}
                </div>
                <PlayerAvatar
                  name={result.player.name}
                  size="md"
                  highlighted={index === 0}
                  status={result.player.status}
                />
                <div className="flex-1">
                  <div className="font-semibold">{result.player.name}</div>
                  <div className="text-sm text-gray-600">
                    {result.totalVotes} votes • {result.wins} victoires
                  </div>
                </div>
                <div className="text-xl font-bold text-primary">
                  {result.score} pts
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Détail par question */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Détail des votes par question
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {gameResults.map((result, questionIndex) => (
              <div key={questionIndex} className="border-b pb-4 last:border-b-0">
                <h4 className="font-medium mb-3 text-gray-800">
                  Question {questionIndex + 1}: {result.questionText}
                </h4>
                
                <div className="space-y-2">
                  {result.votes
                    .filter(vote => vote.count > 0)
                    .sort((a, b) => b.count - a.count)
                    .map((vote, voteIndex) => {
                      const isWinner = vote.playerId === result.winner.playerId;
                      const player = players.find(p => p.id === vote.playerId);
                      
                      return (
                        <div 
                          key={vote.playerId}
                          className={`flex items-center gap-3 p-3 rounded ${
                            isWinner 
                              ? 'bg-green-50 border border-green-200' 
                              : 'bg-gray-50'
                          }`}
                        >
                          <PlayerAvatar
                            name={vote.playerName}
                            size="sm"
                            highlighted={isWinner}
                            status={player?.status || 'offline'}
                          />
                          <div className="flex-1">
                            <span className="font-medium">{vote.playerName}</span>
                            {isWinner && (
                              <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                Gagnant
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{vote.count}</span>
                            <span className="text-sm text-gray-500">
                              vote{vote.count > 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                </div>
                
                {/* Afficher qui a voté pour qui */}
                <div className="mt-3 text-sm text-gray-600">
                  <details className="cursor-pointer">
                    <summary className="font-medium hover:text-gray-800">
                      Voir qui a voté pour qui
                    </summary>
                    <div className="mt-2 space-y-1 pl-4">
                      {/* Simulation des votes individuels */}
                      {players.map(voter => {
                        const votedFor = result.votes.find(v => v.count > 0);
                        if (votedFor) {
                          return (
                            <div key={voter.id} className="flex items-center gap-2 text-xs">
                              <span className="font-medium">{voter.name}</span>
                              <ArrowRight className="h-3 w-3" />
                              <span>{votedFor.playerName}</span>
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </details>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <Button onClick={onFinish} className="px-8">
          Terminer la partie
        </Button>
      </div>
    </div>
  );
};

export default FinalResults;