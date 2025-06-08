
export type PartyType = 'private' | 'public' | 'mixed';
export type PartyStatus = 'waiting' | 'playing' | 'finished' | 'cancelled';

export interface PartySettings {
  maxPlayers: number;
  timePerTurn: number;
  numberOfRounds: number;
  anonymousVoting: boolean;
  allowJoinAfterStart: boolean;
  antiCheatEnabled: boolean;
  passwordProtected: boolean;
  partyPassword?: string;
}

export interface Party {
  id: number;
  code_invitation: string;
  type_jeu: string;
  mode: string;
  statut: PartyStatus;
  party_type: PartyType;
  host_user_id: string;
  max_players: number;
  time_per_turn: number;
  number_of_rounds: number;
  anonymous_voting: boolean;
  allow_join_after_start: boolean;
  anti_cheat_enabled: boolean;
  settings: any;
  invite_link?: string;
  password_protected: boolean;
  party_password?: string;
  date_creation: string;
}

export interface PartyInvitation {
  id: string;
  party_id: number;
  inviter_id: string;
  invitee_id: string;
  invite_code: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  expires_at: string;
  created_at: string;
}
