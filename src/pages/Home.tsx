
import Navigation from "@/components/layout/Navigation";
import HeroSection from "@/components/home/HeroSection";
import HomeNavigation from "@/components/home/HomeNavigation";
import JoinByCodeCard from "@/components/home/JoinByCodeCard";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  Users, 
  Zap, 
  GamepadIcon,
  Clock,
  Sparkles,
  Trophy,
  Star,
  Smile
} from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />
      
      <HeroSection />
      
      {/* Navigation des modes de jeu */}
      <HomeNavigation />
      
      {/* Section des modes de jeu */}
      <section className="py-20 px-4 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white mb-4">
              🎮 Modes de jeu
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Choisis ton style de jeu
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Chaque mode révèle une facette différente de tes amis ! 
              Prêt à découvrir leurs secrets les plus fous ?
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="group p-6 rounded-2xl bg-gradient-to-br from-red-50 to-pink-50 border-red-200 hover:shadow-xl transition-all duration-300">
              <div className="text-center">
                <div className="mx-auto bg-gradient-to-r from-red-500 to-pink-500 rounded-full p-4 w-16 h-16 flex items-center justify-center group-hover:animate-bounce mb-4">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-red-600 mb-2">Amour 💕</h3>
                <p className="text-gray-600 mb-4">
                  Questions romantiques pour découvrir les secrets du cœur !
                </p>
                <Badge variant="secondary" className="bg-red-100 text-red-700">
                  18+ recommandé
                </Badge>
              </div>
            </div>

            <div className="group p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200 hover:shadow-xl transition-all duration-300">
              <div className="text-center">
                <div className="mx-auto bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full p-4 w-16 h-16 flex items-center justify-center group-hover:animate-bounce mb-4">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-blue-600 mb-2">Amitié 👥</h3>
                <p className="text-gray-600 mb-4">
                  Parfait entre potes ! Découvrez qui est le plus aventurier.
                </p>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  Tout public
                </Badge>
              </div>
            </div>

            <div className="group p-6 rounded-2xl bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 hover:shadow-xl transition-all duration-300">
              <div className="text-center">
                <div className="mx-auto bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full p-4 w-16 h-16 flex items-center justify-center group-hover:animate-bounce mb-4">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-yellow-600 mb-2">Folie 🤪</h3>
                <p className="text-gray-600 mb-4">
                  Les questions les plus délirantes ! Fous rires garantis.
                </p>
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                  16+ recommandé
                </Badge>
              </div>
            </div>

            <div className="group p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200 hover:shadow-xl transition-all duration-300">
              <div className="text-center">
                <div className="mx-auto bg-gradient-to-r from-purple-500 to-violet-500 rounded-full p-4 w-16 h-16 flex items-center justify-center group-hover:animate-bounce mb-4">
                  <GamepadIcon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-purple-600 mb-2">Fête 🎉</h3>
                <p className="text-gray-600 mb-4">
                  Spécial soirées ! Questions pour animer vos fêtes.
                </p>
                <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                  Soirées
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section fonctionnalités */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-gradient-to-r from-green-500 to-blue-500 text-white mb-4">
              ✨ Fonctionnalités
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Pourquoi Who Most Likely?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              L'application la plus complète pour s'amuser entre amis
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center space-y-4 p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="mx-auto bg-gradient-to-r from-green-500 to-blue-500 rounded-full p-4 w-16 h-16 flex items-center justify-center">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Temps réel</h3>
              <p className="text-gray-600">
                Jouez ensemble en direct ! Votes et résultats synchronisés instantanément.
              </p>
            </div>

            <div className="text-center space-y-4 p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-4 w-16 h-16 flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Questions IA</h3>
              <p className="text-gray-600">
                Des milliers de questions générées par IA pour ne jamais vous ennuyer !
              </p>
            </div>

            <div className="text-center space-y-4 p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="mx-auto bg-gradient-to-r from-yellow-500 to-red-500 rounded-full p-4 w-16 h-16 flex items-center justify-center">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Classements</h3>
              <p className="text-gray-600">
                Gagnez des points, débloquez des badges et grimpez dans les classements !
              </p>
            </div>

            <div className="text-center space-y-4 p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="mx-auto bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-4 w-16 h-16 flex items-center justify-center">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Jusqu'à 8 joueurs</h3>
              <p className="text-gray-600">
                Parfait pour les petites comme les grandes soirées entre amis !
              </p>
            </div>

            <div className="text-center space-y-4 p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="mx-auto bg-gradient-to-r from-pink-500 to-red-500 rounded-full p-4 w-16 h-16 flex items-center justify-center">
                <Smile className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Questions perso</h3>
              <p className="text-gray-600">
                Créez vos propres questions pour personnaliser vos parties !
              </p>
            </div>

            <div className="text-center space-y-4 p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="mx-auto bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full p-4 w-16 h-16 flex items-center justify-center">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Système d'amis</h3>
              <p className="text-gray-600">
                Ajoutez vos amis et retrouvez facilement vos statistiques communes !
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section rejoindre une partie */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-100 to-pink-100">
        <div className="container mx-auto">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Rejoindre une partie
              </h2>
              <p className="text-xl text-gray-600">
                Tes amis t'ont envoyé un code ? Entre-le ici pour les rejoindre !
              </p>
            </div>
            <JoinByCodeCard />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
