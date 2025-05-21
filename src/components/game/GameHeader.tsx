
import { Button } from '@/components/ui/button';
import { ChevronLeft, MessageSquare, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface GameHeaderProps {
  playersCount: number;
  currentQuestionIndex: number;
  totalQuestions: number;
  onOpenMessaging: () => void;
}

const GameHeader = ({ 
  playersCount, 
  currentQuestionIndex, 
  totalQuestions,
  onOpenMessaging 
}: GameHeaderProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex justify-between items-center mb-6">
      <Button 
        variant="ghost"
        size="sm"
        onClick={() => {
          if (confirm("Quitter la partie ?")) {
            navigate('/');
          }
        }}
      >
        <ChevronLeft className="h-4 w-4 mr-1" /> Quitter
      </Button>
      
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onOpenMessaging}
        >
          <MessageSquare className="h-4 w-4 mr-1" /> Messages
        </Button>
        
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {playersCount} joueurs
          </span>
        </div>
      </div>
      
      <div className="text-sm font-medium">
        Question {currentQuestionIndex + 1}/{totalQuestions}
      </div>
    </div>
  );
};

export default GameHeader;
