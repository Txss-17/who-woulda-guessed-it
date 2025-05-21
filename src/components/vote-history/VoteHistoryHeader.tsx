
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface VoteHistoryHeaderProps {
  playerCount: number;
  date: string;
}

const VoteHistoryHeader = ({ playerCount, date }: VoteHistoryHeaderProps) => {
  const navigate = useNavigate();
  
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
    <>
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
          <span>{playerCount} joueurs</span>
          <span className="mx-2">•</span>
          <span>{formatDate(date)}</span>
        </div>
      </div>
    </>
  );
};

export default VoteHistoryHeader;
