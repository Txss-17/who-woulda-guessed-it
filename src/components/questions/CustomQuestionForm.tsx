import { useState, useEffect } from 'react';
import { Eye, Lock, Globe, Save, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { CustomQuestion } from '@/hooks/useCustomQuestions';

interface CustomQuestionFormProps {
  editingQuestion: CustomQuestion | null;
  onSave: (question: { contenu: string; isPublic: boolean; typeJeu: string }) => void;
  onCancel?: () => void;
}

const gameTypes = [
  { value: 'friendly', label: 'Amical' },
  { value: 'love', label: 'Amour' },
  { value: 'spicy', label: 'Pimenté' },
  { value: 'crazy', label: 'Délirant' }
];

const CustomQuestionForm = ({ editingQuestion, onSave, onCancel }: CustomQuestionFormProps) => {
  const [contenu, setContenu] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [typeJeu, setTypeJeu] = useState('friendly');
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (editingQuestion) {
      setContenu(editingQuestion.contenu);
      setIsPublic(editingQuestion.is_public);
      setTypeJeu(editingQuestion.type_jeu);
    } else {
      setContenu('');
      setIsPublic(false);
      setTypeJeu('friendly');
    }
  }, [editingQuestion]);

  const handleSubmit = () => {
    if (!contenu.trim()) return;

    onSave({
      contenu: contenu.trim(),
      isPublic,
      typeJeu
    });
    
    // Reset form if not editing
    if (!editingQuestion) {
      setContenu('');
      setIsPublic(false);
      setTypeJeu('friendly');
      setShowPreview(false);
    }
  };

  const gameTypeColors = {
    friendly: 'text-blue-600',
    love: 'text-pink-600',
    spicy: 'text-orange-600',
    crazy: 'text-purple-600'
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-4">
          {editingQuestion ? 'Modifier la question' : 'Nouvelle question'}
        </h2>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="question" className="block mb-2">
            Qui est le plus susceptible de...
          </Label>
          <Textarea
            id="question"
            placeholder="...faire un marathon sans entraînement ?"
            value={contenu}
            onChange={(e) => setContenu(e.target.value)}
            className="h-24"
          />
        </div>

        <div>
          <Label htmlFor="gameType" className="block mb-2">
            Type de jeu
          </Label>
          <Select value={typeJeu} onValueChange={setTypeJeu}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez un type" />
            </SelectTrigger>
            <SelectContent>
              {gameTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  <span className={gameTypeColors[type.value as keyof typeof gameTypeColors]}>
                    {type.label}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="public"
            checked={isPublic}
            onCheckedChange={setIsPublic}
          />
          <Label htmlFor="public" className="flex items-center gap-2">
            {isPublic ? <Globe className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
            {isPublic ? 'Question publique' : 'Question privée'}
          </Label>
        </div>

        <div className="text-sm text-muted-foreground">
          {isPublic 
            ? "Cette question sera visible par tous les joueurs" 
            : "Cette question ne sera visible que par vous"
          }
        </div>
      </div>
      
      <div className="flex gap-3">
        <Button 
          onClick={handleSubmit}
          disabled={!contenu.trim()}
          className="flex gap-2"
        >
          {editingQuestion ? (
            <>
              <Save className="h-4 w-4" />
              Mettre à jour
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              Ajouter la question
            </>
          )}
        </Button>
        
        {contenu && (
          <Button 
            variant="outline"
            onClick={() => setShowPreview(!showPreview)}
            className="flex gap-2"
          >
            <Eye className="h-4 w-4" />
            {showPreview ? 'Masquer' : 'Aperçu'}
          </Button>
        )}
        
        {editingQuestion && onCancel && (
          <Button 
            variant="outline"
            onClick={onCancel}
          >
            Annuler
          </Button>
        )}
      </div>
      
      {showPreview && contenu && (
        <Card className="p-4 bg-gradient-to-r from-primary/10 to-secondary/10">
          <h3 className="text-sm text-muted-foreground mb-2">Aperçu:</h3>
          <div className="text-lg font-medium">
            <span>Qui est le plus susceptible de </span>
            <span className={gameTypeColors[typeJeu as keyof typeof gameTypeColors]}>
              {contenu}
            </span>
            <span> ?</span>
          </div>
          <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
            <span className={gameTypeColors[typeJeu as keyof typeof gameTypeColors]}>
              {gameTypes.find(t => t.value === typeJeu)?.label}
            </span>
            <span>•</span>
            {isPublic ? (
              <span className="flex items-center gap-1">
                <Globe className="h-3 w-3" />
                Publique
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <Lock className="h-3 w-3" />
                Privée
              </span>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default CustomQuestionForm;