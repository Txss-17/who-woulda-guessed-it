
import { supabase } from './client';

export const getGameData = async (gameCode: string) => {
  const { data, error } = await supabase
    .from('games') // remplace 'games' si ta table s'appelle autrement
    .select('*')
    .eq('code', gameCode)
    .single();

  if (error) {
    throw new Error(`Erreur Supabase : ${error.message}`);
  }

  return data;
};
