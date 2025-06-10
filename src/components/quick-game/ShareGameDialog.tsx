
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
import { Copy, Share2, QrCode } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import QRCodeDisplay from '@/components/QRCodeDisplay';

interface ShareGameDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gameCode: string;
  gameData: any;
}

const ShareGameDialog = ({ open, onOpenChange, gameCode, gameData }: ShareGameDialogProps) => {
  const { toast } = useToast();
  const [showQR, setShowQR] = useState(false);
  
  const shareUrl = `${window.location.origin}/join-quick/${gameCode}`;
  
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
          title: 'QuiVote - Partie rapide',
          text: `Rejoins ma partie QuiVote !`,
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
          <DialogTitle>Inviter des joueurs</DialogTitle>
          <DialogDescription>
            Partage ce lien pour que tes amis rejoignent la partie
          </DialogDescription>
        </DialogHeader>
        
        {showQR ? (
          <div className="space-y-4">
            <QRCodeDisplay gameCode={gameCode} />
            <Button 
              variant="outline" 
              onClick={() => setShowQR(false)}
              className="w-full"
            >
              Retour au lien
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Input
                value={shareUrl}
                readOnly
                className="flex-1"
              />
              <Button variant="outline" size="icon" onClick={copyLink}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <Button onClick={shareNative} className="gap-2">
                <Share2 className="h-4 w-4" />
                Partager
              </Button>
              <Button variant="outline" onClick={() => setShowQR(true)} className="gap-2">
                <QrCode className="h-4 w-4" />
                QR Code
              </Button>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Ou partage ce code :</p>
              <div className="inline-flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-full">
                <span className="text-xl font-bold tracking-wider text-primary">{gameCode}</span>
                <Button variant="ghost" size="sm" onClick={() => {
                  navigator.clipboard.writeText(gameCode);
                  toast({ title: "Code copié !" });
                }}>
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ShareGameDialog;
