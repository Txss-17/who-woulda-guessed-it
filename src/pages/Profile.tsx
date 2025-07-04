
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, Edit, Save, Star, Trophy, Target, Gamepad2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthSession } from "@/hooks/useAuthSession";
import { toast } from "sonner";

const Profile = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuthSession();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    pseudo: user?.email?.split('@')[0] || '',
    bio: '',
    niveau: 1,
    experience: 0,
    parties_jouees: 0,
    votes_recus: 0,
    votes_donnes: 0,
    badges: []
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const handleSave = async () => {
    try {
      // Simuler la sauvegarde du profil
      setIsEditing(false);
      toast.success("Profil mis à jour !");
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du profil");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto mt-8 text-center">
        <div className="w-16 h-16 mx-auto border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p>Chargement du profil...</p>
      </div>
    );
  }

  if (!user) {
    return null;
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
                <AvatarImage src="" />
                <AvatarFallback className="bg-purple-500 text-2xl">
                  {profileData.pseudo.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="mt-3 flex items-center justify-center gap-2">
              {isEditing ? (
                <Input
                  value={profileData.pseudo}
                  onChange={(e) => setProfileData({...profileData, pseudo: e.target.value})}
                  className="text-center"
                />
              ) : (
                profileData.pseudo
              )}
            </CardTitle>
            <div className="text-sm text-muted-foreground">{user.email}</div>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Niveau</h3>
                  <Badge variant="secondary">
                    <Star className="h-3 w-3 mr-1" />
                    {profileData.niveau}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground mb-1">
                  {profileData.experience} XP • {100 - (profileData.experience % 100)} XP pour le niveau suivant
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full" 
                    style={{
                      width: `${(profileData.experience % 100)}%`
                    }}
                  ></div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Bio</h3>
                {isEditing ? (
                  <Textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                    placeholder="Parlez-nous de vous..."
                    className="min-h-20"
                  />
                ) : (
                  <p className="text-sm">{profileData.bio || "Aucune bio disponible"}</p>
                )}
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold flex items-center justify-center">
                    <Trophy className="h-5 w-5 mr-1 text-yellow-500" />
                    {profileData.parties_jouees}
                  </div>
                  <div className="text-xs text-muted-foreground">Parties</div>
                </div>
                <div>
                  <div className="text-2xl font-bold flex items-center justify-center">
                    <Target className="h-5 w-5 mr-1 text-green-500" />
                    {profileData.votes_recus}
                  </div>
                  <div className="text-xs text-muted-foreground">Votes reçus</div>
                </div>
                <div>
                  <div className="text-2xl font-bold flex items-center justify-center">
                    <Star className="h-5 w-5 mr-1 text-blue-500" />
                    {profileData.votes_donnes}
                  </div>
                  <div className="text-xs text-muted-foreground">Votes donnés</div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Badges</h3>
                <div className="flex flex-wrap gap-2">
                  {profileData.badges.length > 0 ? (
                    profileData.badges.map((badge: any, index: number) => (
                      <Badge key={index} variant="outline">
                        {badge.name || badge}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">Aucun badge pour le moment</p>
                  )}
                </div>
              </div>
              
              <Button 
                variant={isEditing ? "default" : "outline"} 
                className="w-full gap-2"
                onClick={isEditing ? handleSave : () => setIsEditing(true)}
              >
                {isEditing ? (
                  <>
                    <Save className="h-4 w-4" />
                    Sauvegarder
                  </>
                ) : (
                  <>
                    <Edit className="h-4 w-4" />
                    Modifier le profil
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex-1">
          <Tabs defaultValue="history">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="history">Historique des parties</TabsTrigger>
              <TabsTrigger value="stats">Statistiques</TabsTrigger>
            </TabsList>
            
            <TabsContent value="history" className="mt-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Parties récentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {profileData.parties_jouees > 0 ? (
                      <p className="text-center text-muted-foreground">
                        Vous avez joué {profileData.parties_jouees} partie{profileData.parties_jouees > 1 ? "s" : ""}
                      </p>
                    ) : (
                      <div className="text-center text-muted-foreground">
                        <Gamepad2 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>Aucune partie jouée pour le moment</p>
                        <Button className="mt-4" onClick={() => navigate('/online-game')}>
                          Rejoindre une partie
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="stats" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Statistiques détaillées</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">{profileData.votes_recus}</div>
                      <div className="text-sm text-muted-foreground">Total votes reçus</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-secondary">{profileData.votes_donnes}</div>
                      <div className="text-sm text-muted-foreground">Total votes donnés</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">{profileData.experience}</div>
                      <div className="text-sm text-muted-foreground">Points d'expérience</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-yellow-600">{profileData.niveau}</div>
                      <div className="text-sm text-muted-foreground">Niveau actuel</div>
                    </div>
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
