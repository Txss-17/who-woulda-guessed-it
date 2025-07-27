// src/hooks/useGame.ts
import { useEffect, useState } from 'react';
import { getGameData } from '@/integrations/supabase/getGameData';
import { listenToGame } from '@/integrations/supabase/listenToGame';

export const useGame = (gameCode: string) => {
  const [game, setGame] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe = () => {};

    const init = async () => {
      try {
        const initialData = await getGameData(gameCode);
        setGame(initialData);
        setLoading(false);

        unsubscribe = listenToGame(gameCode, (newData) => {
          setGame(newData);
        });
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    init();

    return () => {
      unsubscribe();
    };
  }, [gameCode]);

  return { game, loading };
};
