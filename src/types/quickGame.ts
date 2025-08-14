
export type GameType = 'classic' | 'love' | 'friendly' | 'crazy' | 'party' | 'dirty';
export type GameStatus = 'waiting' | 'playing';
export type UserStatus = 'onroom' | 'offroom' | 'away';

export interface Player {
  id: string;
  name: string;
  avatar?: string;
  status: UserStatus;
}

export interface OnroomGame {
  id: string;
  name: string;
  players: {
    count: number;
    max: number;
    list: Player[];
  };
  host: string;
  type: GameType;
  status: GameStatus;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  recipientId?: string; // If undefined, it's a group message
  gameId?: string; // If defined, it's a game message
  content: string;
  timestamp: Date;
  read: boolean;
}

export const typeLabels: Record<GameType, string> = {
  classic: 'Classique',
  love: 'Amour',
  friendly: 'Amitié',
  crazy: 'Folie',
  party: 'Fête',
  dirty: 'Coquin'
};

export const userStatusLabels = {
  onroom: 'Dans la salle',
  offroom: 'Hors la salle',
  away: 'Absent'
};
