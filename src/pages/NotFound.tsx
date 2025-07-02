import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Home, ArrowLeft, GamepadIcon, Frown } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md text-center shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
        <CardContent className="pt-8 pb-8">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-4 w-20 h-20 flex items-center justify-center animate-pulse">
              <Frown className="h-10 w-10 text-white" />
            </div>
          </div>
          
          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white mb-4">
            🤔 Erreur 404
          </Badge>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Page introuvable
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            Oops ! Cette page n'existe pas ou a été déplacée.
          </p>
          
          <div className="space-y-4">
            <Button 
              asChild 
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              <Link to="/">
                <Home className="mr-2 h-4 w-4" />
                Retour à l'accueil
              </Link>
            </Button>
            
            <Button 
              asChild 
              variant="outline" 
              className="w-full"
              onClick={() => window.history.back()}
            >
              <span className="cursor-pointer">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Page précédente
              </span>
            </Button>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-4">
              Que dirais-tu de jouer en attendant ?
            </p>
            <Button 
              asChild 
              variant="secondary" 
              size="sm"
              className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600"
            >
              <Link to="/quick-game">
                <GamepadIcon className="mr-2 h-4 w-4" />
                Partie rapide
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;