
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BackgroundDecoration, Blob } from '@/components/DecorativeElements';
import GameList from '@/components/online/GameList';
import MatchmakingOptions from '@/components/online/MatchmakingOptions';
import MatchmakingCard from '@/components/online/MatchmakingCard';
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
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30 py-6 px-4">
      <Blob color="primary" position="top-left" size="lg" className="-mt-20 -ml-20 opacity-20" />
      <Blob color="accent" position="bottom-right" size="lg" className="-mb-20 -mr-20 opacity-20" />
      <BackgroundDecoration variant="minimal" position="bottom-left" className="opacity-10" />
      
      <div className="container mx-auto max-w-4xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Retour
        </Button>
        
        <h1 className="text-3xl font-bold mb-8">Partie en ligne</h1>
        
        {matchmaking ? (
          <MatchmakingCard 
            type={matchmakingType}
            countdown={countdown}
            onCancel={cancelMatchmaking}
          />
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="public">Parties publiques</TabsTrigger>
              <TabsTrigger value="matchmaking">Matchmaking</TabsTrigger>
            </TabsList>
            
            <TabsContent value="public" className="mt-4">
              <GameList onSwitchToMatchmaking={() => setActiveTab('matchmaking')} />
            </TabsContent>
            
            <TabsContent value="matchmaking" className="mt-4">
              <MatchmakingOptions onStartMatchmaking={startMatchmaking} />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default OnlineGame;
