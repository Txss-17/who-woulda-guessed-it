
import { Link, useLocation } from "react-router-dom";
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import { 
  Home, 
  Users, 
  Sparkles,
  LogOut,
  User,
  Settings,
  GamepadIcon
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import AuthDialog from "@/components/auth/AuthDialog";
import FriendsDialog from "@/components/social/FriendsDialog";
import NotificationCenter from "@/components/notifications/NotificationCenter";

const Navigation = () => {
  const location = useLocation();
  const { user, profile, signOut } = useAuth();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  
  return (
    <>
      <div className="border-b sticky top-0 z-50 w-full bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6 md:gap-10">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="relative">
                <Sparkles className="h-6 w-6 text-purple-600 group-hover:text-purple-700 transition-colors" />
                <div className="absolute inset-0 h-6 w-6 text-purple-600 group-hover:animate-pulse opacity-20">
                  <Sparkles className="h-6 w-6" />
                </div>
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Who Most Likely?
              </span>
            </Link>
            
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    asChild
                    className={cn(
                      navigationMenuTriggerStyle(),
                      location.pathname === "/" && "bg-purple-50 text-purple-600"
                    )}
                  >
                    <Link to="/">
                      <Home className="h-4 w-4 mr-2" />
                      Accueil
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-gradient-to-r from-purple-50 to-pink-50 text-purple-600 hover:text-purple-700">
                    <GamepadIcon className="h-4 w-4 mr-2" />
                    Jouer
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[450px] gap-3 p-4 md:grid-cols-2">
                      <Link 
                        to="/quick-game" 
                        className="flex flex-col space-y-1 rounded-md p-3 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all group"
                      >
                        <div className="text-sm font-medium text-purple-600 group-hover:text-purple-700">
                          ⚡ Partie rapide
                        </div>
                        <div className="text-xs text-gray-600">
                          Joue sans créer de compte
                        </div>
                      </Link>
                      <Link 
                        to="/online-game" 
                        className="flex flex-col space-y-1 rounded-md p-3 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all group"
                      >
                        <div className="text-sm font-medium text-purple-600 group-hover:text-purple-700">
                          🌐 Parties en ligne
                        </div>
                        <div className="text-xs text-gray-600">
                          Rejoins une partie publique
                        </div>
                      </Link>
                      <Link 
                        to="/create-questions" 
                        className="flex flex-col space-y-1 rounded-md p-3 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all group"
                      >
                        <div className="text-sm font-medium text-purple-600 group-hover:text-purple-700">
                          ✍️ Créer des questions
                        </div>
                        <div className="text-xs text-gray-600">
                          Personnalise tes questions
                        </div>
                      </Link>
                      <Link 
                        to="/vote-history" 
                        className="flex flex-col space-y-1 rounded-md p-3 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all group"
                      >
                        <div className="text-sm font-medium text-purple-600 group-hover:text-purple-700">
                          📊 Historique
                        </div>
                        <div className="text-xs text-gray-600">
                          Revisite tes parties passées
                        </div>
                      </Link>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          
          <div className="flex items-center gap-4">
            {user && profile ? (
              <>
                <div className="flex items-center gap-2">
                  <NotificationCenter />
                  <FriendsDialog />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full ring-2 ring-purple-200 hover:ring-purple-300 transition-all">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={profile.avatar_url || ""} alt={profile.pseudo} />
                        <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold">
                          {profile.pseudo.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{profile.pseudo}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          Niveau {profile.niveau} • {profile.experience} XP
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        Profil
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      Paramètres
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut} className="text-red-600 focus:text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      Se déconnecter
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button 
                onClick={() => setShowAuthDialog(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
              >
                Se connecter
              </Button>
            )}
          </div>
        </div>
      </div>
      
      <AuthDialog open={showAuthDialog} onOpenChange={setShowAuthDialog} />
    </>
  );
};

export default Navigation;
