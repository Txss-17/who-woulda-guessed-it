
import QRCodeGenerator from './QRCodeGenerator';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface QRCodeDisplayProps {
  gameCode: string;
  isQuickGame?: boolean;
}

const QRCodeDisplay = ({ gameCode, isQuickGame = false }: QRCodeDisplayProps) => {
  const { toast } = useToast();
  
  const gameUrl = isQuickGame 
    ? `${window.location.origin}/join-quick/${gameCode}`
    : `${window.location.origin}/join/${gameCode}`;

  const copyGameCode = () => {
    navigator.clipboard.writeText(gameCode);
    toast({
      title: "Code copié !",
      description: "Le code de la partie a été copié"
    });
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-white via-purple-50 to-pink-50 border-purple-200 shadow-lg relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 -mr-2 -mt-2 text-primary/30">
        <Sparkles className="h-12 w-12 opacity-60 animate-pulse" />
      </div>
      <div className="absolute bottom-0 left-0 h-24 w-24 bg-accent/5 rounded-full blur-xl -ml-12 -mb-12" />
      
      <div className="text-center space-y-6 relative z-10">
        <h2 className="text-2xl font-bold text-purple-700">Partage cette partie</h2>
        
        <div className="flex items-center justify-center w-full bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl py-4 px-6 relative overflow-hidden border border-purple-200">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-200/20 to-pink-200/20" />
          <span className="text-3xl font-bold tracking-wider text-purple-700 relative z-10 font-mono">{gameCode}</span>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={copyGameCode} 
            className="ml-3 relative z-10 hover:bg-purple-200/50 text-purple-600"
          >
            <Copy className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex justify-center">
          <QRCodeGenerator 
            value={gameUrl}
            size={240}
            title={`QuiVote - Partie ${gameCode}`}
            className="animate-fade-in"
          />
        </div>
        
        <p className="text-sm text-purple-600/80 max-w-sm mx-auto">
          Scanne ce QR code ou partage le code <span className="font-bold">{gameCode}</span> pour que tes amis rejoignent la partie
        </p>
      </div>
    </Card>
  );
};

export default QRCodeDisplay;
