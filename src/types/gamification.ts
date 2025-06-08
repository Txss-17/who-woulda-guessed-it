
export type BadgeRarity = 'common' | 'rare' | 'epic' | 'legendary';
export type BadgeConditionType = 'games_played' | 'votes_received' | 'votes_given' | 'win_streak' | 'special';

export interface Badge {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  condition_type: BadgeConditionType;
  condition_value?: number;
  rarity: BadgeRarity;
  created_at: string;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  earned_at: string;
  badge?: Badge;
}

export interface UserStatistic {
  id: string;
  user_id: string;
  stat_type: string;
  stat_value: number;
  period: 'all_time' | 'weekly' | 'monthly';
  created_at: string;
  updated_at: string;
}

export interface LeaderboardEntry {
  id: string;
  user_id: string;
  category: 'global' | 'weekly' | 'monthly' | 'games_played' | 'votes_received';
  score: number;
  rank: number;
  period_start: string;
  period_end?: string;
  created_at: string;
}

export interface UserSettings {
  id: string;
  user_id: string;
  setting_key: string;
  setting_value: any;
  created_at: string;
  updated_at: string;
}
