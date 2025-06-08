
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { useBadges } from '@/hooks/useBadges';
import { useStatistics } from '@/hooks/useStatistics';
import BadgesDisplay from '@/components/gamification/BadgesDisplay';
import Leaderboard from '@/components/gamification/Leaderboard';
import PartyCreationDialog from '@/components/party/PartyCreationDialog';
import { Gamepad2, Trophy, Users, TrendingUp, Star, Crown } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { userBadges, checkAndAwardBadges } = useBadges(user?.id);
  const { userStats } = useStatistics(user?.id);

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user) {
      checkAndAwardBadges();
    }
  }, [user, checkAndAwardBadges]);

  if (!user || !profile) {
    return null;
  }

  const getStatValue = (statType: string) => {
    return userStats.find(s => s.stat_type === statType)?.stat_value || 0;
  };

  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tableau de bord</h1>
          <p className="text-muted-foreground">
            Bienvenue, {profile.pseudo} ! Niveau {profile.niveau}
          </p>
        </div>
        <PartyCreationDialog 
          gameType="classic"
          onPartyCreated={(party) => navigate(`/waiting-room/${party.code_invitation}`)}
        />
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Parties jouées</CardTitle>
            <Gamepad2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile.parties_jouees || 0}</div>
            <p className="text-xs text-muted-foreground">
              +{getStatValue('games_played')} cette semaine
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Votes reçus</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile.votes_recus || 0}</div>
            <p className="text-xs text-muted-foreground">
              +{getStatValue('votes_received')} cette semaine
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Badges obtenus</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userBadges.length}</div>
            <p className="text-xs text-muted-foreground">
              Collection en cours
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expérience</CardTitle>
            <Crown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile.experience || 0} XP</div>
            <p className="text-xs text-muted-foreground">
              Niveau {profile.niveau}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Contenu principal */}
      <Tabs defaultValue="badges" className="space-y-4">
        <TabsList>
          <TabsTrigger value="badges">Badges</TabsTrigger>
          <TabsTrigger value="leaderboard">Classements</TabsTrigger>
          <TabsTrigger value="parties">Parties récentes</TabsTrigger>
        </TabsList>

        <TabsContent value="badges">
          <BadgesDisplay />
        </TabsContent>

        <TabsContent value="leaderboard">
          <Leaderboard />
        </TabsContent>

        <TabsContent value="parties">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Parties récentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Gamepad2 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Aucune partie récente</p>
                <Button className="mt-4" onClick={() => navigate('/online')}>
                  Rejoindre une partie
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
