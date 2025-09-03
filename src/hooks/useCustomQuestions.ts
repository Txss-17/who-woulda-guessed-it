import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface CustomQuestion {
  id: number;
  contenu: string;
  is_public: boolean;
  type_jeu: string;
  cree_par_user_id: string | null;
  categorie_id: number | null;
  created_at: string;
}

export const useCustomQuestions = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [questions, setQuestions] = useState<CustomQuestion[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUserQuestions = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('questions')
        .select('id, contenu, is_public, type_jeu, cree_par_user_id, categorie_id')
        .eq('cree_par_user_id', user.id)
        .order('id', { ascending: false });

      if (error) throw error;
      
      const typedQuestions: CustomQuestion[] = (data || []).map(q => ({
        id: q.id,
        contenu: q.contenu,
        is_public: q.is_public,
        type_jeu: q.type_jeu,
        cree_par_user_id: q.cree_par_user_id,
        categorie_id: q.categorie_id,
        created_at: new Date().toISOString() // Default value since column might not exist yet
      }));
      
      setQuestions(typedQuestions);
    } catch (error) {
      console.error('Erreur lors de la récupération des questions:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger vos questions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createQuestion = async (contenu: string, isPublic: boolean, typeJeu: string = 'friendly') => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour créer une question",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('questions')
        .insert([{
          contenu,
          is_public: isPublic,
          type_jeu: typeJeu,
          cree_par_user_id: user.id,
          cree_par_ia: false
        }])
        .select('id, contenu, is_public, type_jeu, cree_par_user_id, categorie_id')
        .single();

      if (error) throw error;

      const typedQuestion: CustomQuestion = {
        id: data.id,
        contenu: data.contenu,
        is_public: data.is_public,
        type_jeu: data.type_jeu,
        cree_par_user_id: data.cree_par_user_id,
        categorie_id: data.categorie_id,
        created_at: new Date().toISOString()
      };

      setQuestions(prev => [typedQuestion, ...prev]);
      toast({
        title: "Question créée",
        description: "Votre question a été ajoutée avec succès",
      });

      return data;
    } catch (error) {
      console.error('Erreur lors de la création de la question:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la question",
        variant: "destructive",
      });
    }
  };

  const updateQuestion = async (id: number, contenu: string, isPublic: boolean) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('questions')
        .update({ contenu, is_public: isPublic })
        .eq('id', id)
        .eq('cree_par_user_id', user.id)
        .select('id, contenu, is_public, type_jeu, cree_par_user_id, categorie_id')
        .single();

      if (error) throw error;

      const typedQuestion: CustomQuestion = {
        id: data.id,
        contenu: data.contenu,
        is_public: data.is_public,
        type_jeu: data.type_jeu,
        cree_par_user_id: data.cree_par_user_id,
        categorie_id: data.categorie_id,
        created_at: new Date().toISOString()
      };

      setQuestions(prev => prev.map(q => q.id === id ? typedQuestion : q));
      toast({
        title: "Question modifiée",
        description: "Votre question a été mise à jour",
      });

      return data;
    } catch (error) {
      console.error('Erreur lors de la modification de la question:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier la question",
        variant: "destructive",
      });
    }
  };

  const deleteQuestion = async (id: number) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('questions')
        .delete()
        .eq('id', id)
        .eq('cree_par_user_id', user.id);

      if (error) throw error;

      setQuestions(prev => prev.filter(q => q.id !== id));
      toast({
        title: "Question supprimée",
        description: "Votre question a été supprimée",
      });
    } catch (error) {
      console.error('Erreur lors de la suppression de la question:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la question",
        variant: "destructive",
      });
    }
  };

  const getQuestionsByType = async (typeJeu: string, includeCustom: boolean = true) => {
    try {
      let query = supabase
        .from('questions')
        .select('*')
        .eq('type_jeu', typeJeu);

      if (includeCustom && user) {
        // Include public questions and user's private questions
        query = query.or(`is_public.eq.true,cree_par_user_id.eq.${user.id}`);
      } else {
        // Only public questions
        query = query.eq('is_public', true);
      }

      const { data, error } = await query.order('id', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des questions par type:', error);
      return [];
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserQuestions();
    }
  }, [user]);

  return {
    questions,
    loading,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    getQuestionsByType,
    refetch: fetchUserQuestions
  };
};