
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Download, Share, FileText, FileImage } from "lucide-react";
import { toast } from "sonner";
import { GameHistoryItem } from "@/types/user";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

interface VoteHistoryExportProps {
  gameData: GameHistoryItem;
}

const VoteHistoryExport: React.FC<VoteHistoryExportProps> = ({ gameData }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);

  // Fonction simple pour obtenir le canvas avec les options correctes
  const getElementCanvas = async () => {
    const element = document.getElementById('vote-history-container');
    if (!element) {
      throw new Error("Could not find element to export");
    }

    return await html2canvas(element, {
      logging: false,
      useCORS: true,
      background: "#ffffff"
    });
  };

  const downloadAsPDF = async () => {
    try {
      setIsExporting(true);
      
      const canvas = await getElementCanvas();
      
      const imgData = canvas.toDataURL('image/jpeg', 0.8);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`vote-history-${gameData.gameId}.pdf`);
      
      toast.success("PDF téléchargé avec succès!");
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast.error("Erreur lors de l'export en PDF");
    } finally {
      setIsExporting(false);
    }
  };

  const downloadAsImage = async () => {
    try {
      setIsExporting(true);
      
      const canvas = await getElementCanvas();
      
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `vote-history-${gameData.gameId}.png`;
      link.click();
      
      toast.success("Image téléchargée avec succès!");
    } catch (error) {
      console.error("Error exporting image:", error);
      toast.error("Erreur lors de l'export en image");
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = async () => {
    try {
      const canvas = await getElementCanvas();
      
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => resolve(blob as Blob), 'image/png', 0.8);
      });

      if (navigator.share) {
        await navigator.share({
          title: 'Résultats du jeu "Qui est le plus susceptible de..."',
          files: [new File([blob], 'vote-history.png', { type: 'image/png' })]
        });
      } else {
        setShowShareDialog(true);
      }
    } catch (error) {
      console.error("Error sharing:", error);
      toast.error("Erreur lors du partage");
    }
  };

  return (
    <>
      <div className="flex justify-center gap-3 mb-8">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Download size={18} />
              Exporter
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48">
            <div className="flex flex-col gap-2">
              <Button 
                variant="ghost" 
                className="justify-start" 
                onClick={downloadAsPDF}
                disabled={isExporting}
              >
                <FileText className="mr-2" size={18} />
                Format PDF
              </Button>
              <Button 
                variant="ghost" 
                className="justify-start" 
                onClick={downloadAsImage}
                disabled={isExporting}
              >
                <FileImage className="mr-2" size={18} />
                Format image
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <Button 
          variant="default" 
          onClick={handleShare} 
          disabled={isExporting} 
          className="flex items-center gap-2"
        >
          <Share size={18} />
          Partager
        </Button>
      </div>

      <AlertDialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Partager les résultats</AlertDialogTitle>
            <AlertDialogDescription>
              Pour partager cette image, téléchargez-la d'abord puis utilisez vos applications de médias sociaux.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={downloadAsImage}>Télécharger l'image</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default VoteHistoryExport;
