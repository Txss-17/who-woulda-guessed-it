
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
  Settings
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
      <div className="border-b sticky top-0 z-50 w-full bg-background/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6 md:gap-10">
            <Link to="/" className="flex items-center space-x-2">
              <Sparkles className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">QuiVote</span>
            </Link>
            
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    asChild
                    className={cn(
                      navigationMenuTriggerStyle(),
                      location.pathname === "/" && "bg-accent text-accent-foreground"
                    )}
                  >
                    <Link to="/">
                      <Home className="h-4 w-4 mr-2" />
                      Accueil
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <NavigationMenuTrigger>
                    <Users className="h-4 w-4 mr-2" />
                    Parties
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[400px] gap-3 p-4 md:grid-cols-2">
                      <Link 
                        to="/quick-game" 
                        className="flex flex-col space-y-1 rounded-md p-3 hover:bg-accent"
                      >
                        <div className="text-sm font-medium">Partie rapide</div>
                        <div className="text-xs text-muted-foreground">Joue sans créer de compte</div>
                      </Link>
                      <Link 
                        to="/online" 
                        className="flex flex-col space-y-1 rounded-md p-3 hover:bg-accent"
                      >
                        <div className="text-sm font-medium">Parties en ligne</div>
                        <div className="text-xs text-muted-foreground">Rejoins une partie publique</div>
                      </Link>
                      <Link 
                        to="/create-questions" 
                        className="flex flex-col space-y-1 rounded-md p-3 hover:bg-accent"
                      >
                        <div className="text-sm font-medium">Créer des questions</div>
                        <div className="text-xs text-muted-foreground">Personnalise tes questions</div>
                      </Link>
                      <Link 
                        to="/vote-history" 
                        className="flex flex-col space-y-1 rounded-md p-3 hover:bg-accent"
                      >
                        <div className="text-sm font-medium">Historique des votes</div>
                        <div className="text-xs text-muted-foreground">Revisite les parties passées</div>
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
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={profile.avatar_url || ""} alt={profile.pseudo} />
                        <AvatarFallback>
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
                      <Link to="/profile">
                        <User className="mr-2 h-4 w-4" />
                        Profil
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      Paramètres
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Se déconnecter
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button onClick={() => setShowAuthDialog(true)}>
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
