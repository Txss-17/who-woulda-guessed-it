
export type GameType = 'classic' | 'love' | 'friendly' | 'crazy' | 'party';
export type GameStatus = 'waiting' | 'playing';

export interface OnlineGame {
  id: string;
  name: string;
  players: {
    count: number;
    max: number;
  };
  host: string;
  type: GameType;
  status: GameStatus;
}

export const typeLabels = {
  classic: 'Classique',
  love: 'Amour',
  friendly: 'Amitié',
  crazy: 'Folie',
  party: 'Fête'
};
