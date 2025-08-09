import { supabase } from './client';

export const updateGameData = async (gameCode: string, data: Record<string, any>) => {
  const { error } = await supabase
    .from('parties')
    .update(data)
    .eq('code_invitation', gameCode.toUpperCase());

  if (error) {
    throw new Error(`Erreur Supabase : ${error.message}`);
  }
};
