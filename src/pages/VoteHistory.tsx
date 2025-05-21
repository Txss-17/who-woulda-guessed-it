
import { useParams } from "react-router-dom";
import VoteHistoryLoading from "@/components/vote-history/VoteHistoryLoading";
import VoteHistoryError from "@/components/vote-history/VoteHistoryError";
import VoteHistoryHeader from "@/components/vote-history/VoteHistoryHeader";
import QuestionResultCard from "@/components/vote-history/QuestionResultCard";
import { useVoteHistory } from "@/hooks/useVoteHistory";

const VoteHistory = () => {
  const { gameId } = useParams();
  const { gameData, loading } = useVoteHistory(gameId);

  if (loading) {
    return <VoteHistoryLoading />;
  }

  if (!gameData) {
    return <VoteHistoryError />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 py-6 px-4">
      <div className="container mx-auto max-w-4xl">
        <VoteHistoryHeader 
          playerCount={gameData.playerCount} 
          date={gameData.date} 
        />
        
        <div className="space-y-10">
          {gameData.questions.map((question, index) => (
            <QuestionResultCard 
              key={question.questionId} 
              question={question} 
              index={index} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default VoteHistory;
