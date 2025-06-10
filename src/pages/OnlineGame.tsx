
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Sparkles, Zap, Users, Hash } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BackgroundDecoration, Blob, FloatingElements } from '@/components/DecorativeElements';
import GameList from '@/components/online/GameList';
import MatchmakingOptions from '@/components/online/MatchmakingOptions';
import MatchmakingCard from '@/components/online/MatchmakingCard';
import JoinGameByCode from '@/components/online/JoinGameByCode';
import { useMatchmaking } from '@/hooks/useMatchmaking';

const OnlineGame = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('public');
  
  const {
    matchmaking,
    matchmakingType,
    countdown,
    startMatchmaking,
    cancelMatchmaking
  } = useMatchmaking();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 py-6 px-4 relative overflow-hidden">
      {/* Enhanced background elements */}
      <FloatingElements />
      <Blob color="primary" position="top-left" size="lg" className="-mt-32 -ml-32 opacity-30 animate-float-slow" />
      <Blob color="accent" position="bottom-right" size="lg" className="-mb-32 -mr-32 opacity-25 animate-float" />
      <Blob color="secondary" position="top-right" size="md" className="-mt-16 -mr-16 opacity-20" />
      <BackgroundDecoration variant="primary" position="top-right" className="opacity-15" />
      <BackgroundDecoration variant="accent" position="bottom-left" className="opacity-10" />
      
      <div className="container mx-auto max-w-4xl relative z-10">
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="hover:bg-primary/10 transition-all hover:scale-105"
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Retour
          </Button>
          
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary animate-pulse" />
            <span className="text-sm text-muted-foreground">En ligne</span>
          </div>
        </div>
        
        <div className="text-center mb-8 space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-fade-in">
            Parties en ligne
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Rejoins des parties publiques, utilise le matchmaking ou entre un code de partie
          </p>
        </div>
        
        {matchmaking ? (
          <div className="animate-fade-in">
            <MatchmakingCard 
              type={matchmakingType}
              countdown={countdown}
              onCancel={cancelMatchmaking}
            />
          </div>
        ) : (
          <div className="animate-fade-in space-y-6">
            {/* Section pour rejoindre avec un code */}
            <JoinGameByCode />
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 bg-white/50 backdrop-blur-sm">
                <TabsTrigger 
                  value="public" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-white transition-all"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Parties publiques
                </TabsTrigger>
                <TabsTrigger 
                  value="matchmaking"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-white transition-all"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Matchmaking
                </TabsTrigger>
                <TabsTrigger 
                  value="join-code"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-white transition-all"
                >
                  <Hash className="h-4 w-4 mr-2" />
                  Code/Lien
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="public" className="mt-6 animate-fade-in">
                <GameList onSwitchToMatchmaking={() => setActiveTab('matchmaking')} />
              </TabsContent>
              
              <TabsContent value="matchmaking" className="mt-6 animate-fade-in">
                <MatchmakingOptions onStartMatchmaking={startMatchmaking} />
              </TabsContent>
              
              <TabsContent value="join-code" className="mt-6 animate-fade-in">
                <JoinGameByCode />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnlineGame;
