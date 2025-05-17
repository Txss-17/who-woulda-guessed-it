
import { Eye, Trash2, Lock, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CustomQuestion } from '@/types/questions';

interface QuestionListProps {
  questions: CustomQuestion[];
  onEdit: (question: CustomQuestion) => void;
  onDelete: (id: string) => void;
}

const QuestionList = ({ questions, onEdit, onDelete }: QuestionListProps) => {
  if (questions.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-8">
        Tu n'as pas encore créé de questions.
      </p>
    );
  }

  return (
    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
      {questions.map((question) => (
        <div 
          key={question.id}
          className="flex items-center justify-between p-3 bg-card border rounded-md"
        >
          <div>
            <p className="font-medium">Qui est le plus susceptible de {question.text}</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center text-xs text-muted-foreground gap-1">
                {question.visibility === 'public' ? (
                  <Globe className="h-3 w-3" />
                ) : (
                  <Lock className="h-3 w-3" />
                )}
                {question.visibility === 'public' ? 'Publique' : 'Privée'}
              </div>
              <span className="text-xs text-muted-foreground">
                • {question.createdAt.toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => onEdit(question)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => onDelete(question.id)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuestionList;
