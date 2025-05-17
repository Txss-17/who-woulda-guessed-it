
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronLeft, Users, Play, Shield, Star } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { BackgroundDecoration, Blob } from '@/components/DecorativeElements';
import PlayerAvatar from '@/components/PlayerAvatar';
import { Badge } from '@/components/ui/badge';

interface OnlineGame {
  id: string;
  name: string;
  players: {
    count: number;
    max: number;
  };
  host: string;
  type: 'classic' | 'love' | 'friendly' | 'crazy' | 'party';
  status: 'waiting' | 'playing';
}

const typeLabels = {
  classic: 'Classique',
  love: 'Amour',
  friendly: 'Amitié',
  crazy: 'Folie',
  party: 'Fête'
};

const OnlineGame = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState('public');
  const [isLoading, setIsLoading] = useState(true);
  const [publicGames, setPublicGames] = useState<OnlineGame[]>([]);
  const [matchmaking, setMatchmaking] = useState(false);
  const [matchmakingType, setMatchmakingType] = useState<OnlineGame['type']>('classic');
  const [countdown, setCountdown] = useState(0);
  
  // Simuler le chargement des parties publiques
  useEffect(() => {
    setIsLoading(true);
    
    setTimeout(() => {
      const fakeGames: OnlineGame[] = [
        {
          id: 'game1',
          name: 'Soirée Fun',
          players: { count: 3, max: 6 },
          host: 'Alex',
          type: 'classic',
          status: 'waiting'
        },
        {
          id: 'game2',
          name: 'Questions Love',
          players: { count: 2, max: 4 },
          host: 'Jordan',
          type: 'love',
          status: 'waiting'
        },
        {
          id: 'game3',
          name: 'Entre amis',
          players: { count: 4, max: 5 },
          host: 'Taylor',
          type: 'friendly',
          status: 'waiting'
        },
        {
          id: 'game4',
          name: 'Party Night',
          players: { count: 5, max: 8 },
          host: 'Sam',
          type: 'party',
          status: 'playing'
        }
      ];
      
      setPublicGames(fakeGames);
      setIsLoading(false);
    }, 1500);
  }, []);
  
  const startMatchmaking = (type: OnlineGame['type']) => {
    setMatchmaking(true);
    setMatchmakingType(type);
    setCountdown(10);
    
    // Simuler le compte à rebours et trouver une partie
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          
          // Simuler qu'on a trouvé une partie
          toast({
            title: 'Partie trouvée !',
            description: "Redirection vers la salle d'attente..."
          });
          
          setTimeout(() => {
            // Générer un code aléatoire et naviguer vers la salle d'attente
            const gameCode = Math.random().toString(36).substring(2, 8).toUpperCase();
            sessionStorage.setItem('playerData', JSON.stringify({
              name: 'Joueur' + Math.floor(Math.random() * 1000),
              id: Date.now(),
              gameCode
            }));
            navigate(`/waiting-room/${gameCode}`);
          }, 1000);
          
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  };
  
  const cancelMatchmaking = () => {
    setMatchmaking(false);
    setCountdown(0);
  };
  
  const joinGame = (game: OnlineGame) => {
    if (game.status === 'playing') {
      toast({
        title: 'Partie en cours',
        description: 'Cette partie est déjà en cours',
        variant: 'destructive'
      });
      return;
    }
    
    if (game.players.count >= game.players.max) {
      toast({
        title: 'Partie complète',
        description: 'Cette partie est déjà complète',
        variant: 'destructive'
      });
      return;
    }
    
    toast({
      title: 'Partie rejointe !',
      description: "Redirection vers la salle d'attente..."
    });
    
    // Simuler qu'on rejoint la partie
    sessionStorage.setItem('playerData', JSON.stringify({
      name: 'Joueur' + Math.floor(Math.random() * 1000),
      id: Date.now(),
      gameCode: game.id
    }));
    
    setTimeout(() => {
      navigate(`/waiting-room/${game.id}`);
    }, 1000);
  };

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
          <Card className="p-8 text-center">
            <div className="mb-6">
              <div className="w-20 h-20 mx-auto bg-primary/20 rounded-full flex items-center justify-center mb-4">
                <Users className="h-10 w-10 text-primary animate-pulse" />
              </div>
              <h2 className="text-xl font-bold mb-2">Recherche de joueurs en cours...</h2>
              <p className="text-muted-foreground">
                Recherche d'une partie de type {typeLabels[matchmakingType]}
              </p>
            </div>
            
            <div className="mx-auto w-20 h-20 relative mb-8">
              <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
              <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold">
                {countdown}
              </div>
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  className="text-primary"
                  strokeWidth="4"
                  stroke="currentColor"
                  fill="transparent"
                  r="38"
                  cx="40"
                  cy="40"
                  strokeDasharray={Math.PI * 2 * 38}
                  strokeDashoffset={Math.PI * 2 * 38 * (1 - countdown / 10)}
                />
              </svg>
            </div>
            
            <div className="flex justify-center">
              <Button 
                variant="outline" 
                onClick={cancelMatchmaking}
              >
                Annuler
              </Button>
            </div>
          </Card>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="public">Parties publiques</TabsTrigger>
              <TabsTrigger value="matchmaking">Matchmaking</TabsTrigger>
            </TabsList>
            
            <TabsContent value="public" className="mt-4">
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-6">Parties disponibles</h2>
                
                {isLoading ? (
                  <div className="text-center py-10">
                    <div className="w-16 h-16 mx-auto border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-muted-foreground">Chargement des parties...</p>
                  </div>
                ) : publicGames.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-muted-foreground">Aucune partie publique disponible.</p>
                    <Button
                      variant="outline"
                      onClick={() => setActiveTab('matchmaking')}
                      className="mt-4"
                    >
                      Essayer le matchmaking
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {publicGames.map(game => (
                      <div 
                        key={game.id}
                        className={`
                          bg-card border rounded-lg p-4 flex justify-between items-center
                          ${game.status === 'playing' ? 'opacity-70' : ''}
                        `}
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium">{game.name}</h3>
                            <Badge variant="outline" className="text-xs">
                              {typeLabels[game.type]}
                            </Badge>
                            {game.status === 'playing' && (
                              <Badge variant="secondary" className="text-xs">En cours</Badge>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Shield className="h-3 w-3" />
                              <span>Hôte: {game.host}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              <span>{game.players.count}/{game.players.max} joueurs</span>
                            </div>
                          </div>
                        </div>
                        
                        <Button
                          size="sm"
                          disabled={game.status === 'playing' || game.players.count >= game.players.max}
                          onClick={() => joinGame(game)}
                        >
                          Rejoindre
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </TabsContent>
            
            <TabsContent value="matchmaking" className="mt-4">
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-6">Trouve rapidement une partie</h2>
                
                <p className="text-muted-foreground mb-6">
                  Le matchmaking te permet de trouver rapidement d'autres joueurs pour une partie.
                  Choisis le type de questions que tu préfères:
                </p>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                  {(['classic', 'love', 'friendly', 'crazy', 'party'] as OnlineGame['type'][]).map((type) => (
                    <Button
                      key={type}
                      variant="outline"
                      className="flex flex-col h-auto py-6 gap-2"
                      onClick={() => startMatchmaking(type)}
                    >
                      {type === 'classic' && <Star className="h-6 w-6 mb-1" />}
                      {type === 'love' && <Star className="h-6 w-6 mb-1" />}
                      {type === 'friendly' && <Star className="h-6 w-6 mb-1" />}
                      {type === 'crazy' && <Star className="h-6 w-6 mb-1" />}
                      {type === 'party' && <Star className="h-6 w-6 mb-1" />}
                      {typeLabels[type]}
                    </Button>
                  ))}
                </div>
                
                <div className="bg-secondary/30 p-4 rounded-lg">
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Joueurs en ligne
                  </h3>
                  
                  <div className="flex flex-wrap gap-2">
                    <PlayerAvatar name="Alex" size="sm" />
                    <PlayerAvatar name="Jordan" size="sm" />
                    <PlayerAvatar name="Taylor" size="sm" />
                    <PlayerAvatar name="Sam" size="sm" />
                    <PlayerAvatar name="Robin" size="sm" />
                    <PlayerAvatar name="Casey" size="sm" />
                    <PlayerAvatar name="Riley" size="sm" />
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default OnlineGame;
