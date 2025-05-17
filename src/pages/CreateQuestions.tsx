
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ChevronLeft, Plus, Save, Trash2, Eye, Lock, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import QuestionCard from '@/components/QuestionCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BackgroundDecoration, Blob } from '@/components/DecorativeElements';

type QuestionVisibility = 'private' | 'public';

interface CustomQuestion {
  id: string;
  text: string;
  visibility: QuestionVisibility;
  createdAt: Date;
}

const CreateQuestions = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [newQuestion, setNewQuestion] = useState('');
  const [questions, setQuestions] = useState<CustomQuestion[]>([]);
  const [editingQuestion, setEditingQuestion] = useState<CustomQuestion | null>(null);
  const [activeTab, setActiveTab] = useState('create');
  const [isPublic, setIsPublic] = useState(false);
  const [previewQuestion, setPreviewQuestion] = useState<string | null>(null);
  
  const handleCreateQuestion = () => {
    if (!newQuestion.trim()) {
      toast({
        title: "Question vide",
        description: "Merci d'entrer une question valide",
        variant: "destructive",
      });
      return;
    }
    
    // Assurer le typage correct pour visibility
    const visibility: QuestionVisibility = isPublic ? 'public' : 'private';
    
    const newQuestionObj: CustomQuestion = {
      id: Date.now().toString(),
      text: newQuestion.trim(),
      visibility,
      createdAt: new Date(),
    };
    
    setQuestions([...questions, newQuestionObj]);
    setNewQuestion('');
    setIsPublic(false);
    
    toast({
      title: "Question créée",
      description: "Ta question a été ajoutée avec succès",
    });
  };
  
  const handleEditQuestion = (question: CustomQuestion) => {
    setEditingQuestion(question);
    setNewQuestion(question.text);
    setIsPublic(question.visibility === 'public');
    setActiveTab('create');
  };
  
  const handleUpdateQuestion = () => {
    if (!editingQuestion) return;
    
    // Assurer le typage correct pour visibility
    const visibility: QuestionVisibility = isPublic ? 'public' : 'private';
    
    const updatedQuestions = questions.map(q => 
      q.id === editingQuestion.id 
      ? { ...q, text: newQuestion, visibility } 
      : q
    );
    
    setQuestions(updatedQuestions);
    setEditingQuestion(null);
    setNewQuestion('');
    setIsPublic(false);
    
    toast({
      title: "Question mise à jour",
      description: "Ta question a été modifiée avec succès",
    });
  };
  
  const handleDeleteQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
    
    if (editingQuestion?.id === id) {
      setEditingQuestion(null);
      setNewQuestion('');
    }
    
    toast({
      title: "Question supprimée",
      description: "Ta question a été supprimée avec succès",
    });
  };
  
  const handlePreviewQuestion = (text: string) => {
    setPreviewQuestion(text);
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
                  onClick={editingQuestion ? handleUpdateQuestion : handleCreateQuestion}
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
                
                {editingQuestion && (
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setEditingQuestion(null);
                      setNewQuestion('');
                      setIsPublic(false);
                    }}
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
            </Card>
          </TabsContent>
          
          <TabsContent value="my-questions" className="mt-4">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Mes questions ({questions.length})</h2>
              
              {questions.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Tu n'as pas encore créé de questions.
                </p>
              ) : (
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
                          onClick={() => handleEditQuestion(question)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDeleteQuestion(question.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="mt-6 flex justify-center">
                <Button 
                  variant="outline"
                  onClick={() => {
                    setActiveTab('create');
                    setEditingQuestion(null);
                    setNewQuestion('');
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

export default CreateQuestions;
