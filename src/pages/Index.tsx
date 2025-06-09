
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Zap, Users, Heart, Smile, PartyPopper, Plus, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import PartyCreationDialog from "@/components/party/PartyCreationDialog";

const gameTypes = [
  {
    id: "classic",
    title: "Classique",
    description: "Le jeu original avec des questions variées",
    icon: Zap,
    color: "bg-blue-500"
  },
  {
    id: "love",
    title: "Amour",
    description: "Questions romantiques et intimes",
    icon: Heart,
    color: "bg-pink-500"
  },
  {
    id: "friendly",
    title: "Amitié",
    description: "Entre amis, dans la bonne humeur",
    icon: Users,
    color: "bg-green-500"
  },
  {
    id: "crazy",
    title: "Folie",
    description: "Questions décalées et surprenantes",
    icon: Smile,
    color: "bg-purple-500"
  },
  {
    id: "party",
    title: "Fête",
    description: "Pour animer vos soirées",
    icon: PartyPopper,
    color: "bg-orange-500"
  }
];

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Qui<span className="text-blue-600">Vote</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Le jeu qui révèle qui vous êtes vraiment
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/quick-game">
              <Button size="lg" className="w-full sm:w-auto">
                <Zap className="mr-2 h-5 w-5" />
                Partie rapide
              </Button>
            </Link>
            
            <Link to="/online">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                <Users className="mr-2 h-5 w-5" />
                Parties en ligne
              </Button>
            </Link>

            {user && (
              <PartyCreationDialog>
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  <Plus className="mr-2 h-5 w-5" />
                  Créer une partie
                </Button>
              </PartyCreationDialog>
            )}
          </div>
        </div>

        {/* Game Types */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-8">Types de jeu</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {gameTypes.map((type) => {
              const IconComponent = type.icon;
              return (
                <Card key={type.id} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className={`${type.color} w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">{type.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{type.description}</CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Multijoueur
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Jouez avec vos amis en temps réel, où que vous soyez
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                IA Avancée
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Questions générées par IA qui s'adaptent à votre groupe
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personnalisable
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Créez vos propres questions et personnalisez vos parties
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Prêt à découvrir qui vous êtes ?</h2>
          <p className="text-gray-600 mb-8">
            Rejoignez des milliers de joueurs qui s'amusent déjà avec QuiVote
          </p>
          <Link to="/quick-game">
            <Button size="lg">
              Commencer maintenant
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
