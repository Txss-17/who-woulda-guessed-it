import { Edit2, Trash2, Lock, Globe, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CustomQuestion } from '@/hooks/useCustomQuestions';

interface CustomQuestionListProps {
  questions: CustomQuestion[];
  onEdit: (question: CustomQuestion) => void;
  onDelete: (id: number) => void;
}

const gameTypeColors = {
  friendly: 'bg-blue-100 text-blue-800 border-blue-200',
  love: 'bg-pink-100 text-pink-800 border-pink-200',
  spicy: 'bg-orange-100 text-orange-800 border-orange-200',
  crazy: 'bg-purple-100 text-purple-800 border-purple-200'
};

const gameTypeLabels = {
  friendly: 'Amical',
  love: 'Amour',
  spicy: 'Pimenté',
  crazy: 'Délirant'
};

const CustomQuestionList = ({ questions, onEdit, onDelete }: CustomQuestionListProps) => {
  if (questions.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground text-lg mb-2">
          Aucune question personnalisée
        </p>
        <p className="text-sm text-muted-foreground">
          Créez votre première question pour commencer
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {questions.map((question) => (
        <Card key={question.id} className="p-4 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              <div className="text-lg font-medium leading-relaxed">
                <span className="text-muted-foreground">Qui est le plus susceptible de </span>
                <span>{question.contenu}</span>
                <span className="text-muted-foreground"> ?</span>
              </div>
              
              <div className="flex items-center gap-3 text-sm">
                <Badge 
                  variant="secondary" 
                  className={gameTypeColors[question.type_jeu as keyof typeof gameTypeColors]}
                >
                  {gameTypeLabels[question.type_jeu as keyof typeof gameTypeLabels]}
                </Badge>
                
                <div className="flex items-center gap-1 text-muted-foreground">
                  {question.is_public ? (
                    <>
                      <Globe className="h-3 w-3" />
                      <span>Publique</span>
                    </>
                  ) : (
                    <>
                      <Lock className="h-3 w-3" />
                      <span>Privée</span>
                    </>
                  )}
                </div>
                
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(question.created_at).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => onEdit(question)}
                className="hover:bg-primary/10"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => onDelete(question.id)}
                className="hover:bg-destructive/10 text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default CustomQuestionList;