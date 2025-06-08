
export interface Friendship {
  id: string;
  user_id: string;
  friend_id: string;
  status: 'pending' | 'accepted' | 'blocked';
  created_at: string;
}

export interface Message {
  id: string;
  sender_id: string;
  recipient_id?: string;
  party_id?: number;
  content: string;
  message_type: 'text' | 'system' | 'notification';
  is_private: boolean;
  read_at?: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  content: string;
  notification_type: 'party_invite' | 'friend_request' | 'message' | 'turn_start' | 'party_result';
  related_id?: string;
  read: boolean;
  created_at: string;
}
