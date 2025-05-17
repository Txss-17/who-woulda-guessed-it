
export type GameType = 'classic' | 'love' | 'friendly' | 'crazy' | 'party';
export type GameStatus = 'waiting' | 'playing';
export type UserStatus = 'online' | 'offline' | 'away';

export interface Player {
  id: string;
  name: string;
  avatar?: string;
  status: UserStatus;
}

export interface OnlineGame {
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

export const typeLabels = {
  classic: 'Classique',
  love: 'Amour',
  friendly: 'Amitié',
  crazy: 'Folie',
  party: 'Fête'
};

export const userStatusLabels = {
  online: 'En ligne',
  offline: 'Hors ligne',
  away: 'Absent'
};
