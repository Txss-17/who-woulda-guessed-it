
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface QRCodeDisplayProps {
  gameCode: string;
}

const QRCodeDisplay = ({ gameCode }: QRCodeDisplayProps) => {
  const { toast } = useToast();
  const [qrUrl, setQrUrl] = useState<string>('');
  
  useEffect(() => {
    // In a real app, we would use a real QR code generator
    // For now, we'll use a placeholder image
    setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${window.location.origin}/join/${gameCode}`);
  }, [gameCode]);

  const copyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/join/${gameCode}`);
    toast({
      title: "Lien copié !",
      description: "Partagez-le avec vos amis pour qu'ils rejoignent la partie",
    });
  };

  return (
    <div className="flex flex-col items-center space-y-6 p-6 bg-white rounded-xl shadow-lg animate-fade-in relative">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 -mr-2 -mt-2 text-primary/30">
        <Sparkles className="h-12 w-12 opacity-60" />
      </div>
      <div className="absolute bottom-0 left-0 h-24 w-24 bg-accent/5 rounded-full blur-xl -ml-12 -mb-12" />
      
      <h2 className="text-2xl font-bold text-center">Partagez ce code pour jouer</h2>
      
      <div className="flex items-center justify-center w-full bg-secondary/50 rounded-lg py-3 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-60" />
        <span className="text-3xl font-bold tracking-wider text-primary relative z-10">{gameCode}</span>
        <Button variant="ghost" size="icon" onClick={copyLink} className="ml-2 relative z-10">
          <Copy className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="bg-white p-3 rounded-lg shadow-md relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg" />
        <img 
          src={qrUrl} 
          alt="QR Code" 
          className="w-48 h-48 relative z-10"
        />
      </div>
      
      <p className="text-sm text-muted-foreground text-center">
        Scannez ce QR code ou partagez le code pour que vos amis rejoignent la partie
      </p>
    </div>
  );
};

export default QRCodeDisplay;
