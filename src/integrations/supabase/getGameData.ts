
import { supabase } from './client';

export const getGameData = async (gameCode: string) => {
  const { data, error } = await supabase
    .from('parties')
    .select('*')
    .eq('code_invitation', gameCode.toUpperCase())
    .maybeSingle();

  if (error) {
    throw new Error(`Erreur Supabase : ${error.message}`);
  }

  return data;
};
