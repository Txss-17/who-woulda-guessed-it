
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  Sparkles, 
  Users, 
  Heart, 
  Zap, 
  Trophy,
  Star,
  GamepadIcon,
  ArrowRight,
  PlayCircle
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const HeroSection = () => {
  const { user } = useAuth();

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-red-500 overflow-hidden flex items-center">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-yellow-300/10 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-300/10 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        
        {/* Floating icons */}
        <div className="absolute top-20 left-20 animate-float">
          <Heart className="h-8 w-8 text-red-300/60" />
        </div>
        <div className="absolute top-40 right-32 animate-float animation-delay-1000">
          <Star className="h-6 w-6 text-yellow-300/60" />
        </div>
        <div className="absolute bottom-40 left-1/4 animate-float animation-delay-2000">
          <Zap className="h-10 w-10 text-blue-300/60" />
        </div>
        <div className="absolute bottom-20 right-20 animate-float animation-delay-3000">
          <Trophy className="h-8 w-8 text-orange-300/60" />
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left content */}
          <div className="flex-1 text-center lg:text-left space-y-8 animate-fade-in">
            <div className="space-y-4">
              <Badge className="bg-white/20 text-white border-white/30 px-4 py-2 text-sm font-medium backdrop-blur-sm">
                🎉 Le jeu social #1
              </Badge>
              
              <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
                <span className="bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                  Who Most
                </span>
                <br />
                <span className="text-white">Likely?</span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-white/90 max-w-2xl">
                Le jeu qui révèle les secrets entre amis ! Découvrez qui est le plus susceptible de... 
                tout et n'importe quoi ! 😄
              </p>
            </div>

            {/* Feature highlights */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 py-8">
              <div className="text-center space-y-2 animate-bounce-subtle">
                <div className="bg-white/20 rounded-full p-3 w-16 h-16 mx-auto flex items-center justify-center backdrop-blur-sm">
                  <Heart className="h-8 w-8 text-red-300" />
                </div>
                <p className="text-white/80 text-sm font-medium">Amour</p>
              </div>
              <div className="text-center space-y-2 animate-bounce-subtle animation-delay-1000">
                <div className="bg-white/20 rounded-full p-3 w-16 h-16 mx-auto flex items-center justify-center backdrop-blur-sm">
                  <Users className="h-8 w-8 text-blue-300" />
                </div>
                <p className="text-white/80 text-sm font-medium">Amitié</p>
              </div>
              <div className="text-center space-y-2 animate-bounce-subtle animation-delay-2000">
                <div className="bg-white/20 rounded-full p-3 w-16 h-16 mx-auto flex items-center justify-center backdrop-blur-sm">
                  <Zap className="h-8 w-8 text-yellow-300" />
                </div>
                <p className="text-white/80 text-sm font-medium">Fun</p>
              </div>
              <div className="text-center space-y-2 animate-bounce-subtle animation-delay-3000">
                <div className="bg-white/20 rounded-full p-3 w-16 h-16 mx-auto flex items-center justify-center backdrop-blur-sm">
                  <GamepadIcon className="h-8 w-8 text-purple-300" />
                </div>
                <p className="text-white/80 text-sm font-medium">Jeu</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              {user ? (
                <>
                  <Button 
                    asChild 
                    size="lg" 
                    className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 px-8 py-6 text-lg"
                  >
                    <Link to="/quick-game">
                      <PlayCircle className="mr-2 h-6 w-6" />
                      Partie rapide
                    </Link>
                  </Button>
                  <Button 
                    asChild 
                    variant="outline" 
                    size="lg"
                    className="bg-white/20 backdrop-blur border-white/30 text-white hover:bg-white/30 hover:text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 px-8 py-6 text-lg"
                  >
                    <Link to="/online-game">
                      <Users className="mr-2 h-6 w-6" />
                      Parties en ligne
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    asChild 
                    size="lg" 
                    className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 px-8 py-6 text-lg"
                  >
                    <Link to="/auth">
                      <Sparkles className="mr-2 h-6 w-6" />
                      Commencer à jouer
                    </Link>
                  </Button>
                  <Button 
                    asChild 
                    variant="outline" 
                    size="lg"
                    className="bg-white/20 backdrop-blur border-white/30 text-white hover:bg-white/30 hover:text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 px-8 py-6 text-lg"
                  >
                    <Link to="/quick-game">
                      <PlayCircle className="mr-2 h-6 w-6" />
                      Essayer sans compte
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 justify-center lg:justify-start pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">1M+</div>
                <div className="text-white/70 text-sm">Parties jouées</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">500K+</div>
                <div className="text-white/70 text-sm">Joueurs actifs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">10M+</div>
                <div className="text-white/70 text-sm">Votes donnés</div>
              </div>
            </div>
          </div>

          {/* Right content - Game preview */}
          <div className="flex-1 flex justify-center lg:justify-end animate-slide-left">
            <div className="relative">
              {/* Mock phone */}
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 shadow-2xl w-80 h-[600px] flex flex-col">
                <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl p-6 text-white text-center mb-6">
                  <h3 className="text-xl font-bold mb-2">Question en cours</h3>
                  <p className="text-lg">"Qui est le plus susceptible de devenir célèbre ?"</p>
                </div>
                
                <div className="flex-1 space-y-4">
                  <div className="bg-white/20 rounded-xl p-4 border border-white/30 hover:bg-white/30 transition-all cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        A
                      </div>
                      <span className="text-white font-medium">Alice</span>
                    </div>
                  </div>
                  <div className="bg-white/20 rounded-xl p-4 border border-white/30 hover:bg-white/30 transition-all cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                        B
                      </div>
                      <span className="text-white font-medium">Bob</span>
                    </div>
                  </div>
                  <div className="bg-white/20 rounded-xl p-4 border border-white/30 hover:bg-white/30 transition-all cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-red-500 rounded-full flex items-center justify-center text-white font-bold">
                        C
                      </div>
                      <span className="text-white font-medium">Charlie</span>
                    </div>
                  </div>
                </div>
                
                <Button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white mt-6">
                  Voter pour Alice 🗳️
                </Button>
              </div>
              
              {/* Floating elements around phone */}
              <div className="absolute -top-4 -right-4 bg-yellow-300 rounded-full p-3 animate-bounce">
                <Star className="h-6 w-6 text-yellow-800" />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-pink-300 rounded-full p-3 animate-bounce animation-delay-2000">
                <Heart className="h-6 w-6 text-pink-800" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-left {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        .animate-slide-left {
          animation: slide-left 0.8s ease-out 0.3s both;
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 2s ease-in-out infinite;
        }
        .animation-delay-1000 { animation-delay: 1s; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-3000 { animation-delay: 3s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
};

export default HeroSection;
