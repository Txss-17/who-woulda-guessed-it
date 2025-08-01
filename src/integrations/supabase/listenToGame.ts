
import { supabase } from './client';

export const listenToGame = (gameCode: string, callback: (data: any) => void) => {
  const channel = supabase
    .channel(`game-changes-${gameCode}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'games',
        filter: `code=eq.${gameCode}`,
      },
      (payload) => {
        callback(payload.new);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};
