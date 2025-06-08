
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ChevronLeft, Edit, Save, Star, Trophy, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const Profile = () => {
  const navigate = useNavigate();
  const { user, profile, loading, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    pseudo: "",
    bio: ""
  });

  useEffect(() => {
    if (profile) {
      setEditedProfile({
        pseudo: profile.pseudo || "",
        bio: profile.bio || ""
      });
    }
  }, [profile]);

  const handleSave = async () => {
    try {
      await updateProfile(editedProfile);
      setIsEditing(false);
      toast.success("Profil mis à jour !");
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du profil");
    }
  };

  const calculateLevel = (experience: number) => {
    return Math.floor(experience / 100) + 1;
  };

  const getExperienceForNextLevel = (experience: number) => {
    const currentLevel = calculateLevel(experience);
    return (currentLevel * 100) - experience;
  };

  if (loading) {
    return (
      <div className="container mx-auto mt-8 text-center">
        <div className="w-16 h-16 mx-auto border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p>Chargement du profil...</p>
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="container mx-auto mt-8 text-center">
        <p>Vous devez être connecté pour voir votre profil</p>
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
                <AvatarImage src={profile.avatar_url || ""} />
                <AvatarFallback className="bg-purple-500 text-2xl">
                  {profile.pseudo.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="mt-3 flex items-center justify-center gap-2">
              {isEditing ? (
                <Input
                  value={editedProfile.pseudo}
                  onChange={(e) => setEditedProfile({...editedProfile, pseudo: e.target.value})}
                  className="text-center"
                />
              ) : (
                profile.pseudo
              )}
            </CardTitle>
            <div className="text-sm text-muted-foreground">{profile.email}</div>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Niveau</h3>
                  <Badge variant="secondary">
                    <Star className="h-3 w-3 mr-1" />
                    {profile.niveau}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground mb-1">
                  {profile.experience} XP • {getExperienceForNextLevel(profile.experience)} XP pour le niveau suivant
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full" 
                    style={{
                      width: `${(profile.experience % 100)}%`
                    }}
                  ></div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Bio</h3>
                {isEditing ? (
                  <Textarea
                    value={editedProfile.bio}
                    onChange={(e) => setEditedProfile({...editedProfile, bio: e.target.value})}
                    placeholder="Parlez-nous de vous..."
                    className="min-h-20"
                  />
                ) : (
                  <p className="text-sm">{profile.bio || "Aucune bio disponible"}</p>
                )}
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold flex items-center justify-center">
                    <Trophy className="h-5 w-5 mr-1 text-yellow-500" />
                    {profile.parties_jouees}
                  </div>
                  <div className="text-xs text-muted-foreground">Parties</div>
                </div>
                <div>
                  <div className="text-2xl font-bold flex items-center justify-center">
                    <Target className="h-5 w-5 mr-1 text-green-500" />
                    {profile.votes_recus}
                  </div>
                  <div className="text-xs text-muted-foreground">Votes reçus</div>
                </div>
                <div>
                  <div className="text-2xl font-bold flex items-center justify-center">
                    <Star className="h-5 w-5 mr-1 text-blue-500" />
                    {profile.votes_donnes}
                  </div>
                  <div className="text-xs text-muted-foreground">Votes donnés</div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Badges</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.badges && profile.badges.length > 0 ? (
                    profile.badges.map((badge, index) => (
                      <Badge key={index} variant="outline">
                        {badge.name}
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
                    {profile.parties_jouees > 0 ? (
                      <p className="text-center text-muted-foreground">
                        Vous avez joué {profile.parties_jouees} partie{profile.parties_jouees > 1 ? "s" : ""}
                      </p>
                    ) : (
                      <p className="text-center text-muted-foreground">
                        Aucune partie jouée pour le moment
                      </p>
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
                      <div className="text-3xl font-bold text-primary">{profile.votes_recus}</div>
                      <div className="text-sm text-muted-foreground">Total votes reçus</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-secondary">{profile.votes_donnes}</div>
                      <div className="text-sm text-muted-foreground">Total votes donnés</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">{profile.experience}</div>
                      <div className="text-sm text-muted-foreground">Points d'expérience</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-yellow-600">{profile.niveau}</div>
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
