
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronLeft, Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BackgroundDecoration, Blob } from '@/components/DecorativeElements';
import { useCustomQuestions, CustomQuestion } from '@/hooks/useCustomQuestions';
import CustomQuestionForm from '@/components/questions/CustomQuestionForm';
import CustomQuestionList from '@/components/questions/CustomQuestionList';
import { useAuth } from '@/hooks/useAuth';

const CreateQuestionsContent = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    questions, 
    loading, 
    createQuestion, 
    updateQuestion, 
    deleteQuestion 
  } = useCustomQuestions();
  
  const [activeTab, setActiveTab] = useState('create');
  const [editingQuestion, setEditingQuestion] = useState<CustomQuestion | null>(null);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30 py-6 px-4">
        <div className="container mx-auto max-w-4xl">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-6"
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Retour
          </Button>
          
          <Card className="p-8 text-center">
            <h2 className="text-xl font-bold mb-4">Connexion requise</h2>
            <p className="text-muted-foreground mb-6">
              Vous devez être connecté pour créer et gérer vos questions personnalisées.
            </p>
            <Button onClick={() => navigate('/auth')}>
              Se connecter
            </Button>
          </Card>
        </div>
      </div>
    );
  }
  
  const handleCreateQuestion = async (question: { contenu: string; isPublic: boolean; typeJeu: string }) => {
    await createQuestion(question.contenu, question.isPublic, question.typeJeu);
  };
  
  const handleUpdateQuestion = async (question: { contenu: string; isPublic: boolean; typeJeu: string }) => {
    if (!editingQuestion) return;
    await updateQuestion(editingQuestion.id, question.contenu, question.isPublic);
    setEditingQuestion(null);
    setActiveTab('my-questions');
  };
  
  const handleEditQuestion = (question: CustomQuestion) => {
    setEditingQuestion(question);
    setActiveTab('create');
  };
  
  const handleDeleteQuestion = async (id: number) => {
    await deleteQuestion(id);
    
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
              <CustomQuestionForm 
                editingQuestion={editingQuestion}
                onSave={editingQuestion ? handleUpdateQuestion : handleCreateQuestion}
                onCancel={() => {
                  setEditingQuestion(null);
                  setActiveTab('my-questions');
                }}
              />
            </Card>
          </TabsContent>
          
          <TabsContent value="my-questions" className="mt-4">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">
                  Mes questions ({questions.length})
                </h2>
                <Button 
                  onClick={() => {
                    setActiveTab('create');
                    setEditingQuestion(null);
                  }}
                  className="flex gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Nouvelle question
                </Button>
              </div>
              
              {loading ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Chargement...</p>
                </div>
              ) : (
                <CustomQuestionList 
                  questions={questions} 
                  onEdit={handleEditQuestion}
                  onDelete={handleDeleteQuestion}
                />
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const CreateQuestions = () => <CreateQuestionsContent />;

export default CreateQuestions;
