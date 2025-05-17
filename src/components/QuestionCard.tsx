
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

interface QuestionCardProps {
  question: string;
  isRevealing?: boolean;
  isAIGenerated?: boolean;
}

const QuestionCard = ({ question, isRevealing = false, isAIGenerated = false }: QuestionCardProps) => {
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
        <CardContent className={`
          p-8 bg-gradient-to-br rounded-lg border-2 relative overflow-hidden
          ${isAIGenerated 
            ? 'from-purple-500/10 to-indigo-500/10 border-purple-500/20' 
            : 'from-primary/10 to-accent/10 border-primary/20'
          }
        `}>
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 opacity-20">
            <Sparkles className="h-12 w-12" />
          </div>
          <div className="absolute bottom-0 left-0 h-32 w-32 bg-accent/10 rounded-full blur-xl -ml-16 -mb-16" />
          <div className="absolute top-0 left-0 h-24 w-24 bg-primary/10 rounded-full blur-xl -ml-12 -mt-12" />
          
          <div className="flex flex-col items-center relative z-10">
            <h3 className="text-2xl font-bold text-center mb-2">Qui est le plus susceptible de...</h3>
            <p className="text-xl text-center font-medium">{question}</p>
            
            {isAIGenerated && (
              <div className="flex items-center mt-4 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30">
                <Sparkles className="h-3 w-3 text-purple-500 mr-1.5" />
                <span className="text-xs text-purple-500">Générée par IA</span>
              </div>
            )}
          </div>
        </CardContent>

        {isRevealing && (
          <div className="absolute inset-0 rotate-y-180 backface-hidden p-8 bg-gradient-to-br from-accent/10 to-primary/10 rounded-lg border-2 border-accent/20 flex items-center justify-center relative overflow-hidden">
            {/* Decorative elements for back of card */}
            <div className="absolute top-0 left-0 opacity-20">
              <Sparkles className="h-12 w-12" />
            </div>
            <div className="absolute bottom-0 right-0 h-32 w-32 bg-primary/10 rounded-full blur-xl -mr-16 -mb-16" />
            
            <p className="text-2xl font-bold text-center relative z-10">
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
