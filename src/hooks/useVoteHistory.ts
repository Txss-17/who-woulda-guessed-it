
import { useState, useEffect } from "react";
import { GameHistoryItem } from "@/types/user";

export const useVoteHistory = (gameId?: string) => {
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

  return { gameData, loading };
};
