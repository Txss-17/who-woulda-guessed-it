
import { createContext, useContext, useState, ReactNode } from 'react';
import { CustomQuestion, QuestionVisibility } from '@/types/questions';
import { useToast } from '@/hooks/use-toast';

interface QuestionsContextType {
  questions: CustomQuestion[];
  addQuestion: (text: string, visibility: QuestionVisibility) => void;
  updateQuestion: (id: string, text: string, visibility: QuestionVisibility) => void;
  deleteQuestion: (id: string) => void;
}

const QuestionsContext = createContext<QuestionsContextType | undefined>(undefined);

export const QuestionsProvider = ({ children }: { children: ReactNode }) => {
  const [questions, setQuestions] = useState<CustomQuestion[]>([]);
  const { toast } = useToast();

  const addQuestion = (text: string, visibility: QuestionVisibility) => {
    const newQuestion: CustomQuestion = {
      id: Date.now().toString(),
      text: text.trim(),
      visibility,
      createdAt: new Date(),
    };

    setQuestions((prevQuestions) => [...prevQuestions, newQuestion]);
    
    toast({
      title: "Question créée",
      description: "Ta question a été ajoutée avec succès",
    });
  };

  const updateQuestion = (id: string, text: string, visibility: QuestionVisibility) => {
    setQuestions((prevQuestions) => 
      prevQuestions.map((q) => 
        q.id === id 
          ? { ...q, text, visibility }
          : q
      )
    );
    
    toast({
      title: "Question mise à jour",
      description: "Ta question a été modifiée avec succès",
    });
  };

  const deleteQuestion = (id: string) => {
    setQuestions((prevQuestions) => prevQuestions.filter((q) => q.id !== id));
    
    toast({
      title: "Question supprimée",
      description: "Ta question a été supprimée avec succès",
    });
  };

  return (
    <QuestionsContext.Provider value={{ questions, addQuestion, updateQuestion, deleteQuestion }}>
      {children}
    </QuestionsContext.Provider>
  );
};

export const useQuestions = () => {
  const context = useContext(QuestionsContext);
  if (context === undefined) {
    throw new Error('useQuestions must be used within a QuestionsProvider');
  }
  return context;
};
