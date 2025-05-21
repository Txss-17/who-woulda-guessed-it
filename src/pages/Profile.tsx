
import { useState, useEffect } from "react";
import { UserProfile } from "@/types/user";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import StatusIndicator from "@/components/user/StatusIndicator";
import { Badge } from "@/components/ui/badge";
import { CircleUser, Settings, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simuler le chargement du profil
    setTimeout(() => {
      const mockProfile: UserProfile = {
        id: "user-1",
        name: "Alex Martin",
        avatar: "",
        status: "online",
        email: "alex@example.com",
        createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
        gamesPlayed: 15,
        votesReceived: 42,
        votesGiven: 38,
        friends: ["user-2", "user-3"],
        bio: "J'adore jouer avec mes amis et trouver qui est le plus susceptible de faire des trucs fous !",
        favoriteGameType: "crazy"
      };
      
      setProfile(mockProfile);
      setLoading(false);
      sessionStorage.setItem('userProfile', JSON.stringify(mockProfile));
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto mt-8 text-center">
        <div className="w-16 h-16 mx-auto border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p>Chargement du profil...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto mt-8 text-center">
        <p>Profil non trouvé</p>
        <Button onClick={() => navigate("/")} className="mt-4">Retour à l'accueil</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <Button 
        variant="ghost" 
        className="mb-6" 
        onClick={() => navigate(-1)}
      >
        <ChevronLeft className="h-4 w-4 mr-2" /> Retour
      </Button>
      
      <div className="flex flex-col md:flex-row gap-6">
        <Card className="md:w-1/3">
          <CardHeader className="text-center">
            <div className="relative mx-auto">
              <Avatar className="h-24 w-24 mx-auto">
                <AvatarImage src={profile.avatar} />
                <AvatarFallback className="bg-purple-500 text-2xl">
                  {profile.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="absolute bottom-0 right-0">
                <StatusIndicator status={profile.status} size="lg" />
              </div>
            </div>
            <CardTitle className="mt-3 flex items-center justify-center gap-2">
              {profile.name}
              <StatusIndicator status={profile.status} size="sm" />
            </CardTitle>
            <div className="text-sm text-muted-foreground">{profile.email}</div>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Bio</h3>
                <p>{profile.bio || "Aucune bio disponible"}</p>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold">{profile.gamesPlayed}</div>
                  <div className="text-xs text-muted-foreground">Parties</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{profile.votesReceived}</div>
                  <div className="text-xs text-muted-foreground">Votes reçus</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{profile.votesGiven}</div>
                  <div className="text-xs text-muted-foreground">Votes donnés</div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Type de jeu préféré</h3>
                <Badge variant="secondary">{profile.favoriteGameType}</Badge>
              </div>
              
              <Button variant="outline" className="w-full gap-2">
                <Settings className="h-4 w-4" />
                Modifier le profil
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex-1">
          <Tabs defaultValue="history">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="history">Historique des parties</TabsTrigger>
              <TabsTrigger value="friends">Amis</TabsTrigger>
            </TabsList>
            
            <TabsContent value="history" className="mt-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Historique des parties</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Liste des parties précédentes */}
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="border rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium">Partie {i}</div>
                            <div className="text-sm text-muted-foreground">
                              Il y a {i} jour{i > 1 ? "s" : ""}
                            </div>
                          </div>
                          <Button size="sm" onClick={() => navigate(`/vote-history/game-${i}`)}>
                            Voir les votes
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="friends" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Amis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Liste des amis */}
                    {["Jordan", "Sam", "Riley"].map((name, i) => (
                      <div key={i} className="flex justify-between items-center p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>{name.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{name}</div>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <StatusIndicator status={i % 2 === 0 ? "online" : "offline"} size="sm" />
                              <span className="ml-1">{i % 2 === 0 ? "En ligne" : "Hors ligne"}</span>
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">Message</Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
