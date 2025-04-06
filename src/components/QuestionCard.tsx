
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface QuestionCardProps {
  question: string;
  isRevealing?: boolean;
}

const QuestionCard = ({ question, isRevealing = false }: QuestionCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className={`relative w-full max-w-md mx-auto perspective-1000 ${isRevealing ? 'cursor-pointer' : ''}`}
      onClick={() => isRevealing && setIsFlipped(!isFlipped)}
    >
      <Card 
        className={`
          transform-style-3d transition-transform duration-700 w-full
          ${isFlipped ? 'rotate-y-180' : ''}
          ${isRevealing ? 'hover:shadow-xl' : ''}
        `}
      >
        <CardContent className="p-8 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg border-2 border-primary/20 backface-hidden">
          <div className="flex flex-col items-center">
            <h3 className="text-2xl font-bold text-center mb-2">Qui est le plus susceptible de...</h3>
            <p className="text-xl text-center font-medium">{question}</p>
          </div>
        </CardContent>

        {isRevealing && (
          <div className="absolute inset-0 rotate-y-180 backface-hidden p-8 bg-gradient-to-br from-accent/10 to-primary/10 rounded-lg border-2 border-accent/20 flex items-center justify-center">
            <p className="text-2xl font-bold text-center">
              Cliquez pour voir la question
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

// Add these CSS utilities to your global CSS or use inline styles
const styles = `
  .perspective-1000 {
    perspective: 1000px;
  }
  .transform-style-3d {
    transform-style: preserve-3d;
  }
  .backface-hidden {
    backface-visibility: hidden;
  }
  .rotate-y-180 {
    transform: rotateY(180deg);
  }
`;

export default QuestionCard;
