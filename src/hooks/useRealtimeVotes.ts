import { useEffect, useMemo, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Player } from '@/types/onlineGame';

interface UseRealtimeVotesParams {
  gameCode?: string;
  questionIndex: number;
  players: Player[];
}

interface RoundVoteRow {
  id: number;
  game_id: number;
  question_index: number;
  voter_player_id: number;
  target_player_id: number;
  created_at: string;
  question_text?: string | null;
}

export const useRealtimeVotes = ({ gameCode, questionIndex, players }: UseRealtimeVotesParams) => {
  const [votes, setVotes] = useState<Record<string, number>>({}); // key: local Player.id, value: count
  const [winningPlayerId, setWinningPlayerId] = useState<string | null>(null);
  const gameIdRef = useRef<number | null>(null);
  const idToNameRef = useRef<Record<number, string>>({}); // game_players.id -> pseudo_temporaire

  // Helper to compute counts mapped to local players from DB rows
  const computeCounts = (rows: RoundVoteRow[]) => {
    const idToName = idToNameRef.current;
    const nameToLocalId: Record<string, string> = {};

    players.forEach((p) => {
      nameToLocalId[p.name.trim().toLowerCase()] = p.id;
    });

    const counts: Record<string, number> = {};

    rows.forEach((r) => {
      // 1) Correspondance par ID direct si possible
      const localById = players.find((p) => p.id === String(r.target_player_id))?.id;
      if (localById) {
        counts[localById] = (counts[localById] || 0) + 1;
        return;
      }
      // 2) Fallback: correspondance par nom (insensible à la casse/espaces)
      const targetName = idToName[r.target_player_id]?.trim().toLowerCase();
      if (!targetName) return;
      const localId = nameToLocalId[targetName];
      if (!localId) return;
      counts[localId] = (counts[localId] || 0) + 1;
    });

    return counts;
  };

  // Derive winning player id from counts
  const deriveWinner = (counts: Record<string, number>) => {
    let winner: string | null = null;
    let max = -1;
    let tieCount = 0;
    Object.entries(counts).forEach(([pid, cnt]) => {
      if (cnt > max) {
        max = cnt;
        winner = pid;
        tieCount = 1;
      } else if (cnt === max) {
        tieCount += 1;
      }
    });
    // S'il y a égalité pour le maximum, retourner null pour signaler une égalité
    return tieCount > 1 ? null : winner;
  };

  useEffect(() => {
    let isMounted = true;
    let channel: ReturnType<typeof supabase.channel> | null = null;

    const setup = async () => {
      if (!gameCode) return;

      // Resolve game id by code
      const { data: gameRow, error: gameErr } = await supabase
        .from('parties')
        .select('id')
        .eq('code_invitation', gameCode.toUpperCase())
        .maybeSingle();

      if (gameErr || !gameRow?.id) {
        console.error('Erreur récupération game id pour votes:', gameErr);
        return;
      }

      gameIdRef.current = gameRow.id as number;

      // Fetch players mapping for this game
      const { data: gpRows, error: gpErr } = await supabase
        .from('game_players')
        .select('id, pseudo_temporaire')
        .eq('game_id', gameIdRef.current);

      if (gpErr) {
        console.error('Erreur récupération game_players:', gpErr);
        return;
      }

      const idToName: Record<number, string> = {};
      (gpRows || []).forEach((r: any) => {
        idToName[r.id as number] = (r.pseudo_temporaire as string) || '';
      });
      idToNameRef.current = idToName;

      // Load initial votes for current question
      const { data: voteRows, error: voteErr } = await supabase
        .from('round_votes')
        .select('id, game_id, question_index, voter_player_id, target_player_id, created_at, question_text')
        .eq('game_id', gameIdRef.current)
        .eq('question_index', questionIndex);

      if (voteErr) {
        console.error('Erreur chargement votes initiaux:', voteErr);
      }

      if (isMounted) {
        const counts = computeCounts((voteRows as RoundVoteRow[]) || []);
        setVotes(counts);
        setWinningPlayerId(deriveWinner(counts));
      }

      // Subscribe to realtime inserts for this game
      channel = supabase
        .channel(`round_votes_${gameCode}`)
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'round_votes', filter: `game_id=eq.${gameIdRef.current}` },
          (payload: any) => {
            const row = payload.new as RoundVoteRow;
            // Only track the current question
            if (row.question_index !== questionIndex) return;

            // Update counts incrementally
            // 1) Correspondance par ID direct
            const localById = players.find((p) => p.id === String(row.target_player_id))?.id;
            let localId = localById;
            if (!localId) {
              // 2) Fallback: correspondance par nom
              const idToNameNow = idToNameRef.current;
              const targetName = idToNameNow[row.target_player_id]?.trim().toLowerCase();
              if (targetName) {
                localId = players.find((p) => p.name.trim().toLowerCase() === targetName)?.id || null;
              }
            }
            if (!localId) return;

            setVotes((prev) => {
              const next = { ...prev, [localId!]: (prev[localId!] || 0) + 1 };
              setWinningPlayerId(deriveWinner(next));
              return next;
            });
          }
        )
        .subscribe();
    };

    setup();

    return () => {
      isMounted = false;
      if (channel) supabase.removeChannel(channel);
    };
  }, [gameCode, questionIndex, players.map(p => p.id).join('|'), players.map(p => p.name).join('|')]);

  // Recompute winner when players list changes (names mapping)
  useEffect(() => {
    setWinningPlayerId(deriveWinner(votes));
  }, [players, votes]);

  return { votes, winningPlayerId } as const;
};
