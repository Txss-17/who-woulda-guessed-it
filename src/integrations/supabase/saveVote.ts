import { supabase } from './client';

let gameIdCache: Record<string, number> = {};

const getGameIdByCode = async (gameCode: string): Promise<number | null> => {
  if (gameIdCache[gameCode]) return gameIdCache[gameCode];
  const { data, error } = await supabase
    .from('parties')
    .select('id')
    .eq('code_invitation', gameCode.toUpperCase())
    .maybeSingle();
  if (error) {
    console.error('Erreur récupération game id:', error);
    return null;
  }
  if (data?.id) {
    gameIdCache[gameCode] = data.id as number;
    return data.id as number;
  }
  return null;
};

const getPlayerIdByName = async (gameId: number, name: string): Promise<number | null> => {
  const { data, error } = await supabase
    .from('game_players')
    .select('id, pseudo_temporaire')
    .eq('game_id', gameId)
    .ilike('pseudo_temporaire', name)
    .maybeSingle();
  if (error) {
    console.error('Erreur récupération player id:', error);
    return null;
  }
  return (data?.id as number) ?? null;
};

export const saveVote = async (params: {
  gameCode: string;
  questionIndex: number;
  questionText: string;
  voterPlayerId: string; // from session Player.id or game_players.id as string
  targetPlayerId: string; // from session Player.id or game_players.id as string
  voterName?: string;
  targetName?: string;
}) => {
  const gameId = await getGameIdByCode(params.gameCode);
  if (!gameId) return false;

  let voterIdNum = parseInt(params.voterPlayerId, 10);
  let targetIdNum = parseInt(params.targetPlayerId, 10);

  if (Number.isNaN(voterIdNum) && params.voterName) {
    const found = await getPlayerIdByName(gameId, params.voterName);
    if (found) voterIdNum = found;
  }
  if (Number.isNaN(targetIdNum) && params.targetName) {
    const found = await getPlayerIdByName(gameId, params.targetName);
    if (found) targetIdNum = found;
  }

  if (Number.isNaN(voterIdNum) || Number.isNaN(targetIdNum)) {
    console.warn('Impossible de résoudre les IDs des joueurs pour le vote.');
    return false;
  }

  const { error } = await supabase
    .from('round_votes')
    .insert({
      game_id: gameId,
      question_index: params.questionIndex,
      question_text: params.questionText,
      voter_player_id: voterIdNum,
      target_player_id: targetIdNum,
    });

  if (error) {
    console.error('Erreur enregistrement vote:', error);
    return false;
  }

  return true;
};
