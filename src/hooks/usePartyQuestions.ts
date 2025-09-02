import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface PartyQuestion {
  id: string;
  party_id: number;
  question_text: string;
  question_index: number;
  created_at: string;
}

export const usePartyQuestions = (partyId: number | null) => {
  const [questions, setQuestions] = useState<PartyQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Charger les questions de la partie
  useEffect(() => {
    if (!partyId) {
      setIsLoading(false);
      return;
    }

    const loadQuestions = async () => {
      const { data, error } = await supabase
        .from('party_questions')
        .select('*')
        .eq('party_id', partyId)
        .order('question_index');

      if (error) {
        console.error('Erreur chargement questions:', error);
      } else {
        setQuestions(data || []);
      }
      setIsLoading(false);
    };

    loadQuestions();
  }, [partyId]);

  // Écouter les nouvelles questions temps réel
  useEffect(() => {
    if (!partyId) return;

    const channel = supabase
      .channel(`party_questions_${partyId}`)
      .on(
        'postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'party_questions',
          filter: `party_id=eq.${partyId}`
        },
        (payload) => {
          const newQuestion = payload.new as PartyQuestion;
          setQuestions(prev => [...prev, newQuestion].sort((a, b) => a.question_index - b.question_index));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [partyId]);

  const addQuestions = async (questionTexts: string[]) => {
    if (!partyId) return;

    const questionsToInsert = questionTexts.map((text, index) => ({
      party_id: partyId,
      question_text: text,
      question_index: index
    }));

    const { error } = await supabase
      .from('party_questions')
      .insert(questionsToInsert);

    if (error) {
      console.error('Erreur ajout questions:', error);
    }
  };

  return {
    questions,
    isLoading,
    addQuestions
  };
};