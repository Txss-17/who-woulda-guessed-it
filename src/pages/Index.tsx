
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import GameCard from "@/components/GameCard";
import { Sparkles, Users, Zap, Trophy, ArrowRight, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { BackgroundDecoration, Blob } from "@/components/DecorativeElements";
import { useAuth } from "@/hooks/useAuth";
import PartyCreationDialog from "@/components/party/PartyCreationDialog";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [gameCode, setGameCode] = useState("");

  const gameTypes = [
    {
      id: "classic",
      title: "Classique",
      description: "Questions amusantes pour tous",
      color: "from-blue-500 to-purple-600",
      icon: Users,
      players: "2-10 joueurs"
    },
    {
      id: "love",
      title: "Amour",
      description: "Questions romantiques pour couples",
      color: "from-pink-500 to-red-500",
      icon: Sparkles,
      players: "2-4 joueurs"
    },
    {
      id: "friendly",
      title: "Amitié",
      description: "Apprenez à mieux vous connaître",
      color: "from-green-500 to-teal-500",
      icon: MessageSquare,
      players: "3-8 joueurs"
    },
    {
      id: "crazy",
      title: "Délirant",
      description: "Questions folles et inattendues",
      color: "from-orange-500 to-red-500",
      icon: Zap,
      players: "3-12 joueurs"
    }
  ];

  const handleJoinGame = () => {
    if (!gameCode.trim()) {
      toast.error("Veuillez entrer un code de partie");
      return;
    }
    navigate(`/join/${gameCode.toUpperCase()}`);
  };

  const handleGameSelect = (gameType: string) => {
    if (!user) {
      navigate('/quick-game');
      return;
    }
    // Si connecté, on peut créer une partie ou accéder au dashboard
    navigate('/dashboard');
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-background to-secondary/30 overflow-hidden">
      <Blob color="primary" position="top-left" size="lg" className="-mt-20 -ml-20 opacity-20" />
      <Blob color="accent" position="bottom-right" size="lg" className="-mb-20 -mr-20 opacity-20" />
      <BackgroundDecoration variant="minimal" position="bottom-left" className="opacity-10" />
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Le jeu de vote social</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-6">
            QuiVote
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Découvrez ce que vos amis pensent vraiment ! Votez, riez et créez des souvenirs inoubliables.
          </p>

          {/* Actions rapides */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <div className="flex gap-2 w-full max-w-md">
              <Input
                placeholder="Code de partie"
                value={gameCode}
                onChange={(e) => setGameCode(e.target.value.toUpperCase())}
                className="text-center font-mono"
                maxLength={8}
              />
              <Button onClick={handleJoinGame} size="lg">
                Rejoindre
              </Button>
            </div>
            
            <div className="text-sm text-muted-foreground">ou</div>
            
            {user ? (
              <PartyCreationDialog 
                gameType="classic"
                onPartyCreated={(party) => navigate(`/waiting-room/${party.code_invitation}`)}
              />
            ) : (
              <Button size="lg" onClick={() => navigate('/quick-game')}>
                Partie rapide
              </Button>
            )}
          </div>
        </div>

        {/* Types de jeu */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Choisissez votre style</h2>
            <p className="text-muted-foreground">
              Différents modes pour toutes les occasions
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {gameTypes.map((game) => (
              <GameCard
                key={game.id}
                title={game.title}
                description={game.description}
                color={game.color}
                icon={game.icon}
                players={game.players}
                onClick={() => handleGameSelect(game.id)}
              />
            ))}
          </div>
        </div>

        {/* Fonctionnalités */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center">
            <CardHeader>
              <Users className="h-12 w-12 mx-auto text-primary mb-4" />
              <CardTitle>Multijoueur en temps réel</CardTitle>
              <CardDescription>
                Jouez avec vos amis où qu'ils soient
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Chat en direct</li>
                <li>• Parties privées ou publiques</li>
                <li>• Jusqu'à 12 joueurs</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Zap className="h-12 w-12 mx-auto text-primary mb-4" />
              <CardTitle>Questions intelligentes</CardTitle>
              <CardDescription>
                IA qui s'adapte à votre groupe
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Questions personnalisées</li>
                <li>• Plusieurs catégories</li>
                <li>• Niveau de difficulté adaptatif</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Trophy className="h-12 w-12 mx-auto text-primary mb-4" />
              <CardTitle>Système de progression</CardTitle>
              <CardDescription>
                Débloquez des badges et grimpez dans les classements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Badges à collectionner</li>
                <li>• Niveaux et expérience</li>
                <li>• Classements globaux</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl">Prêt à commencer ?</CardTitle>
              <CardDescription>
                Créez votre première partie en quelques secondes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {user ? (
                <Button size="lg" className="w-full" onClick={() => navigate('/dashboard')}>
                  Accéder au tableau de bord
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <div className="space-y-2">
                  <Button size="lg" className="w-full" onClick={() => navigate('/quick-game')}>
                    Commencer maintenant
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Aucune inscription requise pour une partie rapide
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
