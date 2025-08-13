import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronLeft, Play, Check, Sparkles, RefreshCw } from 'lucide-react';
import { 
  QuestionType, 
  generateQuestions, 
  getPredefinedQuestions 
} from '@/services/questionGenerator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface Question {
  id: string;
  text: string;
}

const QuickGame = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [questions, setQuestions] = useState<Question[]>(getPredefinedQuestions());
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [questionSource, setQuestionSource] = useState<'predefined' | 'ai'>('predefined');
  const [questionType, setQuestionType] = useState<QuestionType>('classic');
  const [isGenerating, setIsGenerating] = useState(false);

  // Initialiser les questions sélectionnées par défaut
  useEffect(() => {
    if (questionSource === 'predefined') {
      setSelectedQuestions(questions.slice(0, 5).map(q => q.id));
    }
  }, [questionSource, questions]);

  const toggleQuestion = (questionId: string) => {
    if (selectedQuestions.includes(questionId)) {
      setSelectedQuestions(selectedQuestions.filter(id => id !== questionId));
    } else {
      setSelectedQuestions([...selectedQuestions, questionId]);
    }
  };

  const generateAIQuestions = async () => {
    try {
      setIsGenerating(true);
      const aiQuestions = await generateQuestions(questionType, 10);
      setQuestions(aiQuestions);
      setSelectedQuestions(aiQuestions.slice(0, 6).map(q => q.id));

      toast({
        title: "Questions générées",
        description: `5 questions de type "${questionType}" ont été sélectionnées automatiquement`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de générer les questions",
        variant: "destructive",
      });
      console.error("Erreur de génération:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const createGame = () => {
    if (selectedQuestions.length === 0) {
      toast({
        title: "Aucune question",
        description: "Sélectionne au moins une question pour jouer",
        variant: "destructive",
      });
      return;
    }

    const selectedQuestionTexts = questions
      .filter(q => selectedQuestions.includes(q.id))
      .map(q => q.text);

    const newGameCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    // On ne crée pas les joueurs ici. Seul l'hôte choisira son nom
    // sur l’écran suivant et les autres joueurs rejoindront via code/QR/lien
    sessionStorage.setItem('pendingQuestions', JSON.stringify(selectedQuestionTexts));
    sessionStorage.setItem('pendingGameCode', newGameCode);

    navigate(`/create-game?code=${newGameCode}`);
  };

  // Effet pour charger les questions AI quand on change le type
  useEffect(() => {
    if (questionSource === 'ai') {
      generateAIQuestions();
    } else {
      setQuestions(getPredefinedQuestions());
      setSelectedQuestions(getPredefinedQuestions().slice(0, 6).map(q => q.id));
    }
  }, [questionSource, questionType]);

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
        
        <h1 className="text-3xl font-bold mb-8">Partie rapide</h1>

        <div className="grid grid-cols-1 gap-8">
          <div className="flex flex-col">
            <Card className="p-6 mb-6 flex-grow">
              <h2 className="text-xl font-bold mb-4">Questions</h2>
              
              <Tabs defaultValue="predefined" className="mb-4" onValueChange={(value) => setQuestionSource(value as 'predefined' | 'ai')}>
                <TabsList className="w-full">
                  <TabsTrigger value="predefined" className="flex-1">Prédéfinies</TabsTrigger>
                  <TabsTrigger value="ai" className="flex-1">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Générées par IA
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="predefined" className="mt-4">
                  <div className="max-h-64 overflow-y-auto pr-2">
                    {questions.map((question) => (
                      <div 
                        key={question.id}
                        className={`
                          flex items-center gap-2 p-2 rounded-md cursor-pointer mb-1
                          ${selectedQuestions.includes(question.id) ? 'bg-primary/20' : 'hover:bg-secondary'}
                        `}
                        onClick={() => toggleQuestion(question.id)}
                      >
                        <div className={`
                          w-5 h-5 rounded-full flex items-center justify-center
                          ${selectedQuestions.includes(question.id) ? 'bg-primary text-white' : 'border border-muted-foreground'}
                        `}>
                          {selectedQuestions.includes(question.id) && <Check className="h-3 w-3" />}
                        </div>
                        <span>Qui est le plus susceptible de {question.text}</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="ai" className="mt-4">
                  <div className="mb-4">
                    <h3 className="text-sm font-medium mb-2">Type de questions</h3>
                    <div className="flex flex-wrap gap-2">
                      {(['classic', 'love', 'friendly', 'crazy', 'party', 'dirty'] as QuestionType[]).map((type) => (
                        <Badge 
                          key={type}
                          variant={questionType === type ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => setQuestionType(type)}
                        >
                          {type === 'classic' ? 'Classique' : 
                           type === 'love' ? 'Amour' :
                           type === 'friendly' ? 'Amitié' :
                           type === 'crazy' ? 'Folie' : 
                           type === 'party' ? 'Fête' :
                           type === 'dirty' ? 'dirty' : type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex mb-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-1"
                      onClick={generateAIQuestions}
                      disabled={isGenerating}
                    >
                      <RefreshCw className={`${isGenerating ? 'animate-spin' : ''} h-3 w-3`} />
                      Générer d'autres questions
                    </Button>
                  </div>
                  
                  <div className="max-h-64 overflow-y-auto pr-2">
                    {isGenerating ? (
                      <div className="py-8 text-center text-muted-foreground animate-pulse">
                        <Sparkles className="h-8 w-8 mx-auto mb-2" />
                        <p>Génération des questions en cours...</p>
                      </div>
                    ) : questions.length > 0 ? (
                      questions.map((question) => (
                        <div 
                          key={question.id}
                          className={`
                            flex items-center gap-2 p-2 rounded-md cursor-pointer mb-1
                            ${selectedQuestions.includes(question.id) ? 'bg-primary/20' : 'hover:bg-secondary'}
                          `}
                          onClick={() => toggleQuestion(question.id)}
                        >
                          <div className={`
                            w-5 h-5 rounded-full flex items-center justify-center
                            ${selectedQuestions.includes(question.id) ? 'bg-primary text-white' : 'border border-muted-foreground'}
                          `}>
                            {selectedQuestions.includes(question.id) && <Check className="h-3 w-3" />}
                          </div>
                          <span>Qui est le plus susceptible de {question.text}</span>
                        </div>
                      ))
                    ) : (
                      <div className="py-4 text-center text-muted-foreground">
                        Aucune question générée
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="text-sm text-muted-foreground mt-2">
                {selectedQuestions.length} question(s) sélectionnée(s)
              </div>
            </Card>
            
            <Button 
              size="lg" 
              className="gap-2"
              onClick={createGame}
              disabled={selectedQuestions.length === 0}
            >
              <Play className="h-5 w-5" />
              Créer la partie
            </Button>
            <div className="mt-2 text-sm text-muted-foreground">
              Les autres joueurs rejoignent via code/QR/lien et choisissent leur nom.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickGame;
