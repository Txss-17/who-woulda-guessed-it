
import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Button } from '@/components/ui/button';
import { Copy, Download, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface QRCodeGeneratorProps {
  value: string;
  size?: number;
  className?: string;
  showActions?: boolean;
  title?: string;
}

const QRCodeGenerator = ({ 
  value, 
  size = 200, 
  className = "", 
  showActions = true,
  title = "QR Code"
}: QRCodeGeneratorProps) => {
  const { toast } = useToast();
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const generateQR = async () => {
      try {
        setIsLoading(true);
        const dataUrl = await QRCode.toDataURL(value, {
          width: size,
          margin: 2,
          color: {
            dark: '#1f2937', // Couleur sombre
            light: '#ffffff' // Couleur claire
          },
          errorCorrectionLevel: 'M'
        });
        setQrDataUrl(dataUrl);
      } catch (error) {
        console.error('Erreur lors de la génération du QR code:', error);
        toast({
          title: "Erreur",
          description: "Impossible de générer le QR code",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (value) {
      generateQR();
    }
  }, [value, size, toast]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(value);
    toast({
      title: "Lien copié !",
      description: "Le lien a été copié dans le presse-papiers"
    });
  };

  const downloadQR = () => {
    if (qrDataUrl) {
      const link = document.createElement('a');
      link.download = `qr-code-${Date.now()}.png`;
      link.href = qrDataUrl;
      link.click();
      toast({
        title: "QR code téléchargé !",
        description: "Le QR code a été sauvegardé"
      });
    }
  };

  const shareQR = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: "Rejoins ma partie QuiVote !",
          url: value
        });
      } catch (error) {
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`} style={{ width: size, height: size }}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="relative group">
        <img 
          src={qrDataUrl} 
          alt="QR Code pour rejoindre la partie"
          className="rounded-lg shadow-lg transition-transform group-hover:scale-105"
          style={{ width: size, height: size }}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg"></div>
      </div>
      
      {showActions && (
        <div className="flex gap-2 justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={copyToClipboard}
            className="gap-2"
          >
            <Copy className="h-4 w-4" />
            Copier lien
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={downloadQR}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Télécharger
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={shareQR}
            className="gap-2"
          >
            <Share2 className="h-4 w-4" />
            Partager
          </Button>
        </div>
      )}
    </div>
  );
};

export default QRCodeGenerator;
