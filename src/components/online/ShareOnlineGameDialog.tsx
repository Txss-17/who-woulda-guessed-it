
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Copy, Share2, QrCode, Users, Sparkles, Link as LinkIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import QRCodeGenerator from '@/components/QRCodeGenerator';
import { OnlineGame } from '@/types/onlineGame';

interface ShareOnlineGameDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  game: OnlineGame;
}

const ShareOnlineGameDialog = ({ open, onOpenChange, game }: ShareOnlineGameDialogProps) => {
  const { toast } = useToast();
  const [showQR, setShowQR] = useState(false);
  
  const shareUrl = `${window.location.origin}/join/${game.id}`;
  
  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Lien copié !",
      description: "Partage ce lien avec tes amis pour qu'ils rejoignent la partie",
    });
  };
  
  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `QuiVote - ${game.name}`,
          text: `Rejoins ma partie "${game.name}" sur QuiVote !`,
          url: shareUrl,
        });
      } catch (error) {
        copyLink();
      }
    } else {
      copyLink();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-purple-700">
            <Sparkles className="h-5 w-5 text-primary animate-pulse" />
            Inviter des amis
          </DialogTitle>
          <DialogDescription>
            Partage ce QR code ou ce lien pour que tes amis rejoignent "{game.name}"
          </DialogDescription>
        </DialogHeader>
        
        {showQR ? (
          <div className="space-y-4 animate-fade-in">
            <div className="flex justify-center">
              <QRCodeGenerator 
                value={shareUrl}
                size={200}
                title={`QuiVote - ${game.name}`}
              />
            </div>
            <Button 
              variant="outline" 
              onClick={() => setShowQR(false)}
              className="w-full transition-all hover:scale-105"
            >
              <LinkIcon className="h-4 w-4 mr-2" />
              Retour au lien
            </Button>
          </div>
        ) : (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center gap-2">
              <Input
                value={shareUrl}
                readOnly
                className="flex-1 bg-secondary/50"
              />
              <Button 
                variant="outline" 
                size="icon" 
                onClick={copyLink}
                className="hover:scale-110 transition-transform"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <Button 
                onClick={shareNative} 
                className="gap-2 bg-gradient-to-r from-primary to-accent hover:shadow-lg transition-all hover:scale-105"
              >
                <Share2 className="h-4 w-4" />
                Partager
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowQR(true)} 
                className="gap-2 hover:scale-105 transition-transform"
              >
                <QrCode className="h-4 w-4" />
                QR Code
              </Button>
            </div>
            
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 p-4 rounded-xl border border-primary/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Statut de la partie</span>
                <div className="flex items-center gap-1 text-primary">
                  <Users className="h-3 w-3" />
                  <span className="text-xs">{game.players.count}/{game.players.max}</span>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                Type : {game.type} • Hôte : {game.host}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ShareOnlineGameDialog;
