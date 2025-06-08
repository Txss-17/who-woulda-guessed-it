
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useStatistics } from '@/hooks/useStatistics';
import { useAuth } from '@/hooks/useAuth';
import { Crown, Trophy, Medal, TrendingUp } from 'lucide-react';

const Leaderboard = () => {
  const { user } = useAuth();
  const { leaderboard, fetchLeaderboard } = useStatistics(user?.id);
  const [selectedCategory, setSelectedCategory] = useState('global');

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="h-4 w-4 text-yellow-500" />;
      case 2: return <Trophy className="h-4 w-4 text-gray-400" />;
      case 3: return <Medal className="h-4 w-4 text-amber-600" />;
      default: return <span className="text-sm font-bold">{rank}</span>;
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    fetchLeaderboard(category);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Classements
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedCategory} onValueChange={handleCategoryChange}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="global">Global</TabsTrigger>
            <TabsTrigger value="weekly">Semaine</TabsTrigger>
            <TabsTrigger value="monthly">Mois</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedCategory} className="mt-4">
            <div className="space-y-2">
              {leaderboard.map((entry: any, index) => (
                <div
                  key={entry.id}
                  className={`
                    flex items-center gap-3 p-3 rounded-lg
                    ${entry.user_id === user?.id ? 'bg-primary/10 border border-primary/20' : 'bg-secondary/50'}
                  `}
                >
                  <div className="flex items-center justify-center w-8">
                    {getRankIcon(entry.rank)}
                  </div>
                  
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={entry.profiles?.avatar_url} />
                    <AvatarFallback>
                      {entry.profiles?.pseudo?.substring(0, 2).toUpperCase() || '?'}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {entry.profiles?.pseudo || 'Joueur anonyme'}
                      {entry.user_id === user?.id && (
                        <Badge variant="outline" className="ml-2 text-xs">Vous</Badge>
                      )}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm font-bold">{entry.score}</p>
                    <p className="text-xs text-muted-foreground">points</p>
                  </div>
                </div>
              ))}
              
              {leaderboard.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Aucun classement disponible</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default Leaderboard;
