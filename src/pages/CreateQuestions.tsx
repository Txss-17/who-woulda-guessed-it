
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronLeft, Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BackgroundDecoration, Blob } from '@/components/DecorativeElements';
import { QuestionsProvider, useQuestions } from '@/context/QuestionsContext';
import QuestionForm from '@/components/questions/QuestionForm';
import QuestionList from '@/components/questions/QuestionList';
import { CustomQuestion } from '@/types/questions';

const CreateQuestionsContent = () => {
  const navigate = useNavigate();
  const { questions, addQuestion, updateQuestion, deleteQuestion } = useQuestions();
  
  const [activeTab, setActiveTab] = useState('create');
  const [editingQuestion, setEditingQuestion] = useState<CustomQuestion | null>(null);
  
  const handleCreateQuestion = (question: { text: string; visibility: 'public' | 'private' }) => {
    addQuestion(question.text, question.visibility);
  };
  
  const handleUpdateQuestion = (question: { text: string; visibility: 'public' | 'private' }) => {
    if (!editingQuestion) return;
    updateQuestion(editingQuestion.id, question.text, question.visibility);
    setEditingQuestion(null);
  };
  
  const handleEditQuestion = (question: CustomQuestion) => {
    setEditingQuestion(question);
    setActiveTab('create');
  };
  
  const handleDeleteQuestion = (id: string) => {
    deleteQuestion(id);
    
    if (editingQuestion?.id === id) {
      setEditingQuestion(null);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30 py-6 px-4">
      <Blob color="primary" position="top-right" size="lg" className="-mt-20 -mr-20 opacity-20" />
      <Blob color="accent" position="bottom-left" size="lg" className="-mb-20 -ml-20 opacity-20" />
      <BackgroundDecoration variant="minimal" position="bottom-right" className="opacity-10" />
      
      <div className="container mx-auto max-w-4xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Retour
        </Button>
        
        <h1 className="text-3xl font-bold mb-8">Crée tes questions</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create">Créer</TabsTrigger>
            <TabsTrigger value="my-questions">Mes questions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="create" className="mt-4">
            <Card className="p-6">
              <QuestionForm 
                editingQuestion={editingQuestion}
                onSave={editingQuestion ? handleUpdateQuestion : handleCreateQuestion}
                onCancel={() => setEditingQuestion(null)}
              />
            </Card>
          </TabsContent>
          
          <TabsContent value="my-questions" className="mt-4">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Mes questions ({questions.length})</h2>
              
              <QuestionList 
                questions={questions} 
                onEdit={handleEditQuestion}
                onDelete={handleDeleteQuestion}
              />
              
              <div className="mt-6 flex justify-center">
                <Button 
                  variant="outline"
                  onClick={() => {
                    setActiveTab('create');
                    setEditingQuestion(null);
                  }}
                  className="flex gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Créer une question
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Wrapper component that provides the questions context
const CreateQuestions = () => (
  <QuestionsProvider>
    <CreateQuestionsContent />
  </QuestionsProvider>
);

export default CreateQuestions;
