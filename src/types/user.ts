
import { UserStatus } from './onlineGame';

export interface UserProfile {
  id: string;
  name: string;
  avatar?: string;
  status: UserStatus;
  email?: string;
  createdAt: string;
  gamesPlayed?: number;
  votesReceived?: number;
  votesGiven?: number;
  friends?: string[];
  bio?: string;
  favoriteGameType?: string;
}

export interface GameHistoryItem {
  gameId: string;
  date: string;
  gameType: string;
  playerCount: number;
  questions: GameQuestionResult[];
}

export interface GameQuestionResult {
  questionId: string;
  questionText: string;
  votes: {
    playerId: string;
    playerName: string;
    count: number;
  }[];
  winner?: {
    playerId: string;
    playerName: string;
  };
}
