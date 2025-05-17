
import { useState, useEffect } from 'react';
import { Eye, Lock, Globe, Save, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from '@/hooks/use-toast';
import QuestionCard from '@/components/QuestionCard';
import { QuestionVisibility, CustomQuestion } from '@/types/questions';

interface QuestionFormProps {
  editingQuestion: CustomQuestion | null;
  onSave: (question: Omit<CustomQuestion, 'id' | 'createdAt'>) => void;
  onCancel?: () => void;
}

const QuestionForm = ({ editingQuestion, onSave, onCancel }: QuestionFormProps) => {
  const { toast } = useToast();
  const [newQuestion, setNewQuestion] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [previewQuestion, setPreviewQuestion] = useState<string | null>(null);

  // Initialize form when editing question changes
  useEffect(() => {
    if (editingQuestion) {
      setNewQuestion(editingQuestion.text);
      setIsPublic(editingQuestion.visibility === 'public');
    } else {
      setNewQuestion('');
      setIsPublic(false);
    }
  }, [editingQuestion]);

  const handleSubmit = () => {
    if (!newQuestion.trim()) {
      toast({
        title: "Question vide",
        description: "Merci d'entrer une question valide",
        variant: "destructive",
      });
      return;
    }

    // Ensure correct type for visibility
    const visibility: QuestionVisibility = isPublic ? 'public' : 'private';
    
    onSave({
      text: newQuestion.trim(),
      visibility
    });
    
    // Reset form
    setNewQuestion('');
    setIsPublic(false);
    setPreviewQuestion(null);
  };

  const handlePreviewQuestion = (text: string) => {
    setPreviewQuestion(text);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">
        {editingQuestion ? 'Modifier la question' : 'Nouvelle question'}
      </h2>
      
      <div className="mb-6">
        <Label htmlFor="question" className="block mb-2">Qui est le plus susceptible de...</Label>
        <Textarea
          id="question"
          placeholder="...faire un marathon sans entraînement ?"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          className="mb-4 h-24"
        />
        
        <div className="flex items-center space-x-2">
          <Switch
            id="public"
            checked={isPublic}
            onCheckedChange={setIsPublic}
          />
          <Label htmlFor="public" className="flex items-center gap-1">
            {isPublic ? <Globe className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
            {isPublic ? 'Publique' : 'Privée'}
          </Label>
        </div>
      </div>
      
      <div className="flex gap-3">
        <Button 
          className="flex gap-2"
          onClick={handleSubmit}
        >
          {editingQuestion ? (
            <>
              <Save className="h-4 w-4" />
              Mettre à jour
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              Ajouter
            </>
          )}
        </Button>
        
        {newQuestion && (
          <Button 
            variant="outline"
            onClick={() => handlePreviewQuestion(newQuestion)}
            className="flex gap-2"
          >
            <Eye className="h-4 w-4" />
            Aperçu
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
      
      {previewQuestion && (
        <div className="mt-6">
          <h3 className="text-sm text-muted-foreground mb-2">Aperçu:</h3>
          <QuestionCard question={previewQuestion} />
        </div>
      )}
    </div>
  );
};

export default QuestionForm;
