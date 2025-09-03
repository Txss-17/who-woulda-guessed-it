
import { supabase } from '@/integrations/supabase/client';

const PRESET_QUESTIONS = {
  classic: [
    "tomber amoureux au premier regard",
    "écrire des poèmes d'amour",
    "faire une déclaration romantique en public",
    "se marier en premier",
    "avoir le plus d'histoires d'amour",
    "pleurer en regardant un film romantique",
    "organiser un rendez-vous parfait",
    "garder des lettres d'amour"
  ],
  love: [
    "tomber amoureux au premier regard",
    "écrire des poèmes d'amour",
    "faire une déclaration romantique en public",
    "se marier en premier",
    "avoir le plus d'histoires d'amour",
    "pleurer en regardant un film romantique",
    "organiser un rendez-vous parfait",
    "garder des lettres d'amour"
  ],
  friendly: [
    "devenir célèbre",
    "oublier son propre anniversaire",
    "survivre à une apocalypse zombie",
    "devenir millionnaire",
    "partir vivre à l'étranger",
    "faire le tour du monde",
    "devenir végétarien",
    "collectionner quelque chose de bizarre"
  ],
  crazy: [
    "manger de la nourriture périmée",
    "danser nu sous la pluie",
    "se faire tatouer sur un coup de tête",
    "parler tout seul en public",
    "dormir avec ses chaussettes",
    "chanter sous la douche",
    "faire du shopping en pyjama",
    "avoir peur des clowns"
  ],
  party: [
    "finir sur la table de danse",
    "organiser la meilleure fête",
    "boire le plus",
    "chanter au karaoké",
    "faire des shots",
    "draguer quelqu'un en soirée",
    "perdre ses clés en soirée",
    "finir la soirée dans un fast-food"
  ],
  spicy: [
    "coucher au premier rendez-vous",
    "faire l'amour dans un lieu public",
    "avoir eu un plan à trois ou d'en vouloir un",
    "envoyer des nudes sans y réfléchir",
    "avoir déjà eu une sex tape",
    "avoir des fantasmes bizarres",
    "coucher avec un(e) ex par simple envie",
    "ne pas se souvenir du prénom de quelqu'un après avoir couché avec"
  ],
};

export const generateQuestions = async (
  gameType: string, 
  playerNames: string[], 
  questionCount: number = 10,
  includeCustomQuestions: boolean = true
): Promise<string[]> => {
  try {
    let allQuestions: string[] = [];
    
    // Récupérer les questions de la base de données
    if (includeCustomQuestions) {
      const { data: dbQuestions } = await supabase
        .from('questions')
        .select('contenu')
        .eq('type_jeu', gameType)
        .eq('is_public', true);
      
      if (dbQuestions) {
        allQuestions.push(...dbQuestions.map(q => q.contenu));
      }
    }
    
    // Ajouter les questions prédéfinies
    const presetQuestions = PRESET_QUESTIONS[gameType as keyof typeof PRESET_QUESTIONS] || PRESET_QUESTIONS.friendly;
    allQuestions.push(...presetQuestions);
    
    // Mélanger et retourner le nombre demandé
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, questionCount);
  } catch (error) {
    console.error('Erreur lors de la génération des questions:', error);
    // Fallback sur les questions prédéfinies
    const questions = PRESET_QUESTIONS[gameType as keyof typeof PRESET_QUESTIONS] || PRESET_QUESTIONS.friendly;
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, questionCount);
  }
};
