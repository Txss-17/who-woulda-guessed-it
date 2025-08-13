
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
import { Copy, Share2, QrCode, Link as LinkIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import QRCodeGenerator from '@/components/QRCodeGenerator';

interface ShareGameDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gameCode: string;
  gameData: any;
}

const ShareGameDialog = ({ open, onOpenChange, gameCode, gameData }: ShareGameDialogProps) => {
  const { toast } = useToast();
  const [showQR, setShowQR] = useState(false);
  
  const shareUrl = `${window.location.origin}/join/${gameCode}`;
  
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
          text: `Rejoins ma partie QuiVote avec le code ${gameCode} !`,
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
            <QrCode className="h-5 w-5" />
            Inviter des joueurs
          </DialogTitle>
          <DialogDescription>
            Partage ce QR code ou ce lien pour que tes amis rejoignent la partie
          </DialogDescription>
        </DialogHeader>
        
        {showQR ? (
          <div className="space-y-4 animate-fade-in">
            <div className="flex justify-center">
              <QRCodeGenerator 
                value={shareUrl}
                size={200}
                title={`QuiVote - Partie ${gameCode}`}
              />
            </div>
            <Button 
              variant="outline" 
              onClick={() => setShowQR(false)}
              className="w-full"
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
                className="flex-1 bg-purple-50 border-purple-200"
              />
              <Button variant="outline" size="icon" onClick={copyLink} className="hover:bg-purple-100">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <Button 
                onClick={shareNative} 
                className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Share2 className="h-4 w-4" />
                Partager
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowQR(true)} 
                className="gap-2 border-purple-200 hover:bg-purple-50 hover:border-purple-300"
              >
                <QrCode className="h-4 w-4" />
                QR Code
              </Button>
            </div>
            
            <div className="text-center bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
              <p className="text-sm text-purple-600 mb-2 font-medium">Ou partage ce code :</p>
              <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-purple-200 shadow-sm">
                <span className="text-xl font-bold tracking-wider text-purple-700 font-mono">{gameCode}</span>
                <Button variant="ghost" size="sm" onClick={() => {
                  navigator.clipboard.writeText(gameCode);
                  toast({ title: "Code copié !" });
                }} className="hover:bg-purple-100">
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
