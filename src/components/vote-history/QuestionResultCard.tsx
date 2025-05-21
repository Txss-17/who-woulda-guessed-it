
import { Card, CardContent } from "@/components/ui/card";
import { GameQuestionResult } from "@/types/user";
import { motion } from "framer-motion";
import PlayerVoteCard from "./PlayerVoteCard";

interface QuestionResultCardProps {
  question: GameQuestionResult;
  index: number;
}

const QuestionResultCard = ({ question, index }: QuestionResultCardProps) => {
  return (
    <motion.div 
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
            {question.votes.map((vote, voteIndex) => {
              const isWinner = vote.playerId === question.winner?.playerId;
              
              return (
                <PlayerVoteCard
                  key={vote.playerId}
                  playerId={vote.playerId}
                  playerName={vote.playerName}
                  voteCount={vote.count}
                  isWinner={isWinner}
                  index={voteIndex}
                />
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default QuestionResultCard;
