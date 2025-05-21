
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import PlayerAvatar from "@/components/PlayerAvatar";
import { GameHistoryItem } from "@/types/user";
import { ChevronLeft, Users, Trophy } from "lucide-react";
import { motion } from "framer-motion";

const VoteHistory = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [gameData, setGameData] = useState<GameHistoryItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simuler le chargement des données historiques
    setTimeout(() => {
      const mockGameData: GameHistoryItem = {
        gameId: gameId || "game-1",
        date: new Date().toISOString(),
        gameType: "friendly",
        playerCount: 5,
        questions: [
          {
            questionId: "q1",
            questionText: "oublier le nom de quelqu'un juste après avoir été présenté",
            votes: [
              { playerId: "p1", playerName: "Alex", count: 3 },
              { playerId: "p2", playerName: "Jordan", count: 1 },
              { playerId: "p3", playerName: "Sam", count: 0 },
              { playerId: "p4", playerName: "Riley", count: 0 },
              { playerId: "p5", playerName: "Taylor", count: 1 },
            ],
            winner: { playerId: "p1", playerName: "Alex" }
          },
          {
            questionId: "q2",
            questionText: "se perdre en utilisant le GPS",
            votes: [
              { playerId: "p1", playerName: "Alex", count: 1 },
              { playerId: "p2", playerName: "Jordan", count: 0 },
              { playerId: "p3", playerName: "Sam", count: 3 },
              { playerId: "p4", playerName: "Riley", count: 0 },
              { playerId: "p5", playerName: "Taylor", count: 1 },
            ],
            winner: { playerId: "p3", playerName: "Sam" }
          },
          {
            questionId: "q3",
            questionText: "devenir célèbre sur les réseaux sociaux",
            votes: [
              { playerId: "p1", playerName: "Alex", count: 1 },
              { playerId: "p2", playerName: "Jordan", count: 0 },
              { playerId: "p3", playerName: "Sam", count: 1 },
              { playerId: "p4", playerName: "Riley", count: 3 },
              { playerId: "p5", playerName: "Taylor", count: 0 },
            ],
            winner: { playerId: "p4", playerName: "Riley" }
          }
        ]
      };
      
      setGameData(mockGameData);
      setLoading(false);
    }, 1000);
  }, [gameId]);

  if (loading) {
    return (
      <div className="container mx-auto mt-8 text-center">
        <div className="w-16 h-16 mx-auto border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p>Chargement du récapitulatif...</p>
      </div>
    );
  }

  if (!gameData) {
    return (
      <div className="container mx-auto mt-8 text-center">
        <p>Historique non trouvé</p>
        <Button onClick={() => navigate("/")} className="mt-4">Retour à l'accueil</Button>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 py-6 px-4">
      <div className="container mx-auto max-w-4xl">
        <Button 
          variant="ghost" 
          className="mb-6" 
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="h-4 w-4 mr-2" /> Retour
        </Button>
        
        <div className="mb-8 text-center">
          <motion.h1 
            className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-primary bg-clip-text text-transparent mb-2"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Récapitulatif des votes
          </motion.h1>
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{gameData.playerCount} joueurs</span>
            <span className="mx-2">•</span>
            <span>{formatDate(gameData.date)}</span>
          </div>
        </div>
        
        <div className="space-y-10">
          {gameData.questions.map((question, index) => (
            <motion.div 
              key={question.questionId}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
            >
              <Card className="bg-card/80 backdrop-blur-sm border-2 overflow-hidden">
                <CardContent className="p-6">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-center mb-2">
                      Qui est le plus susceptible de...
                    </h2>
                    <p className="text-lg text-center">{question.questionText}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {question.votes.map((vote) => {
                      const isWinner = vote.playerId === question.winner?.playerId;
                      const colorClass = isWinner 
                        ? "bg-gradient-to-br from-primary/20 to-accent/20 border-primary/30" 
                        : "bg-card border-muted";
                      
                      return (
                        <motion.div
                          key={vote.playerId}
                          className={`rounded-xl border-2 p-4 flex flex-col items-center ${colorClass}`}
                          whileHover={{ scale: 1.05 }}
                          initial={{ scale: isWinner ? 0.9 : 1 }}
                          animate={{ 
                            scale: 1,
                            rotate: isWinner ? [0, -2, 2, -2, 0] : 0
                          }}
                          transition={{ 
                            duration: isWinner ? 0.5 : 0.3,
                            delay: isWinner ? 0.5 + index * 0.2 : 0
                          }}
                        >
                          <div className="relative mb-2">
                            <PlayerAvatar 
                              name={vote.playerName} 
                              size="lg"
                              highlighted={isWinner}
                            />
                            
                            {isWinner && (
                              <div className="absolute -top-2 -right-2 bg-primary rounded-full w-8 h-8 flex items-center justify-center text-primary-foreground">
                                <Trophy className="h-4 w-4" />
                              </div>
                            )}
                          </div>
                          
                          <p className="font-medium text-center">{vote.playerName}</p>
                          
                          <div className="mt-3 flex items-center">
                            <div className="text-2xl font-bold">{vote.count}</div>
                            <div className="text-xs ml-1 text-muted-foreground">
                              {vote.count > 1 ? "votes" : "vote"}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VoteHistory;
