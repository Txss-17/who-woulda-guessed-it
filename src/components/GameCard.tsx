
import { Card } from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';
import { cn } from "@/lib/utils";

interface GameCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  rightIcon?: React.ReactNode;
  className?: string;
}

const GameCard = ({ 
  title, 
  description, 
  icon, 
  onClick,
  rightIcon,
  className 
}: GameCardProps) => {
  return (
    <Card 
      className={cn(
        "relative overflow-hidden group cursor-pointer hover:shadow-lg transition-all duration-300 border-2 border-primary/10",
        className
      )}
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white to-secondary/30 opacity-80 z-0" />
      <div className="p-6 relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-primary/20 p-3 rounded-full text-primary">
            {icon}
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {rightIcon || <ChevronRight className="h-5 w-5" />}
          </div>
        </div>
        
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
    </Card>
  );
};

export default GameCard;
