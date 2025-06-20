
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Zap, 
  Users, 
  Plus, 
  Globe,
  PenTool,
  History,
  ArrowRight
} from "lucide-react";

const HomeNavigation = () => {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Comment veux-tu jouer ?
          </h2>
          <p className="text-lg text-gray-600">
            Choisis ton mode de jeu préféré pour commencer l'aventure !
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
            <CardHeader className="text-center">
              <div className="mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-4 w-16 h-16 flex items-center justify-center group-hover:animate-pulse">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-purple-600">Partie Rapide</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-600">
                Lance une partie immédiatement avec des questions générées par IA
              </p>
              <Button asChild className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                <Link to="/quick-game">
                  Jouer maintenant
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
            <CardHeader className="text-center">
              <div className="mx-auto bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full p-4 w-16 h-16 flex items-center justify-center group-hover:animate-pulse">
                <Plus className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-blue-600">Créer une Partie</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-600">
                Crée ta propre partie et invite tes amis avec un code
              </p>
              <Button asChild variant="outline" className="w-full border-blue-300 text-blue-600 hover:bg-blue-50">
                <Link to="/create-game">
                  Créer une partie
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardHeader className="text-center">
              <div className="mx-auto bg-gradient-to-r from-green-500 to-emerald-500 rounded-full p-4 w-16 h-16 flex items-center justify-center group-hover:animate-pulse">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-green-600">Parties Publiques</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-600">
                Rejoins des parties publiques avec d'autres joueurs
              </p>
              <Button asChild variant="outline" className="w-full border-green-300 text-green-600 hover:bg-green-50">
                <Link to="/online-game">
                  Explorer les parties
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200">
            <CardHeader className="text-center">
              <div className="mx-auto bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full p-4 w-16 h-16 flex items-center justify-center group-hover:animate-pulse">
                <PenTool className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-orange-600">Mes Questions</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-600">
                Crée tes propres questions personnalisées
              </p>
              <Button asChild variant="outline" className="w-full border-orange-300 text-orange-600 hover:bg-orange-50">
                <Link to="/create-questions">
                  Créer des questions
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
            <CardHeader className="text-center">
              <div className="mx-auto bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full p-4 w-16 h-16 flex items-center justify-center group-hover:animate-pulse">
                <History className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-indigo-600">Historique</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-600">
                Consulte l'historique de tes parties précédentes
              </p>
              <Button asChild variant="outline" className="w-full border-indigo-300 text-indigo-600 hover:bg-indigo-50">
                <Link to="/vote-history">
                  Voir l'historique
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-to-br from-red-50 to-pink-50 border-red-200">
            <CardHeader className="text-center">
              <div className="mx-auto bg-gradient-to-r from-red-500 to-pink-500 rounded-full p-4 w-16 h-16 flex items-center justify-center group-hover:animate-pulse">
                <Users className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-red-600">Mon Profil</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-600">
                Gère ton profil, statistiques et badges
              </p>
              <Button asChild variant="outline" className="w-full border-red-300 text-red-600 hover:bg-red-50">
                <Link to="/profile">
                  Voir le profil
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default HomeNavigation;
