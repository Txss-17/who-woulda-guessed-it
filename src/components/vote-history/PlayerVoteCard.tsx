
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import PlayerAvatar from "@/components/PlayerAvatar";

interface PlayerVoteCardProps {
  playerId: string;
  playerName: string;
  voteCount: number;
  isWinner: boolean;
  index: number;
}

const PlayerVoteCard = ({ playerId, playerName, voteCount, isWinner, index }: PlayerVoteCardProps) => {
  const colorClass = isWinner 
    ? "bg-gradient-to-br from-primary/20 to-accent/20 border-primary/30" 
    : "bg-card border-muted";
    
  return (
    <motion.div
      key={playerId}
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
          name={playerName} 
          size="lg"
          highlighted={isWinner}
        />
        
        {isWinner && (
          <div className="absolute -top-2 -right-2 bg-primary rounded-full w-8 h-8 flex items-center justify-center text-primary-foreground">
            <Trophy className="h-4 w-4" />
          </div>
        )}
      </div>
      
      <p className="font-medium text-center">{playerName}</p>
      
      <div className="mt-3 flex items-center">
        <div className="text-2xl font-bold">{voteCount}</div>
        <div className="text-xs ml-1 text-muted-foreground">
          {voteCount > 1 ? "votes" : "vote"}
        </div>
      </div>
    </motion.div>
  );
};

export default PlayerVoteCard;
