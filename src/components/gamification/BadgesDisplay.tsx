
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBadges } from '@/hooks/useBadges';
import { useAuth } from '@/hooks/useAuth';
import { Trophy, Star, Crown, Zap } from 'lucide-react';

const BadgesDisplay = () => {
  const { user } = useAuth();
  const { allBadges, userBadges } = useBadges(user?.id);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-500';
      case 'rare': return 'bg-blue-500';
      case 'epic': return 'bg-purple-500';
      case 'legendary': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'common': return <Star className="h-3 w-3" />;
      case 'rare': return <Trophy className="h-3 w-3" />;
      case 'epic': return <Crown className="h-3 w-3" />;
      case 'legendary': return <Zap className="h-3 w-3" />;
      default: return <Star className="h-3 w-3" />;
    }
  };

  const earnedBadgeIds = userBadges.map(ub => ub.badge_id);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Collection de badges
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {allBadges.map((badge) => {
            const isEarned = earnedBadgeIds.includes(badge.id);
            
            return (
              <div
                key={badge.id}
                className={`
                  p-3 rounded-lg border text-center transition-all
                  ${isEarned 
                    ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200' 
                    : 'bg-gray-50 border-gray-200 opacity-60'
                  }
                `}
              >
                <div className="text-2xl mb-2">
                  {badge.icon || '🏆'}
                </div>
                <p className="text-sm font-medium mb-1">{badge.name}</p>
                <p className="text-xs text-muted-foreground mb-2">
                  {badge.description}
                </p>
                <Badge 
                  variant="outline" 
                  className={`text-xs ${getRarityColor(badge.rarity)} text-white border-0`}
                >
                  {getRarityIcon(badge.rarity)}
                  {badge.rarity}
                </Badge>
                {!isEarned && badge.condition_value && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {badge.condition_value} {badge.condition_type.replace('_', ' ')}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default BadgesDisplay;
