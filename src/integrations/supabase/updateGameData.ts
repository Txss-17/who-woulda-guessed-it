import { supabase } from './client';

export const updateGameData = async (gameCode: string, data: Record<string, any>) => {
  const { error } = await supabase
    .from('games') // change 'games' si le nom de la table est différent
    .update(data)
    .eq('code', gameCode); // 'code' doit correspondre à la colonne qui identifie la partie

  if (error) {
    throw new Error(`Erreur Supabase : ${error.message}`);
  }
};
