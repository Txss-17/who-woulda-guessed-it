
export type QuestionType = 'classic' | 'love' | 'friendly' | 'crazy' | 'party';

interface Question {
  id: string;
  text: string;
}

const defaultQuestions = {
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
  ]
};

export const getPredefinedQuestions = (): Question[] => {
  const allQuestions: string[] = [];
  Object.values(defaultQuestions).forEach(questions => {
    allQuestions.push(...questions);
  });
  
  return allQuestions.map((text, index) => ({
    id: `predefined_${index}`,
    text: text
  }));
};

export const generateQuestions = async (
  gameType: QuestionType,
  playerCount: number,
  difficulty: 'easy' | 'medium' | 'hard' = 'medium'
): Promise<Question[]> => {
  // Pour l'instant, retourner des questions par défaut
  // À remplacer par un appel à l'API IA quand disponible
  
  const questions = defaultQuestions[gameType] || defaultQuestions.friendly;
  
  // Mélanger et retourner le nombre de questions demandé
  const shuffled = [...questions].sort(() => Math.random() - 0.5);
  const selectedQuestions = shuffled.slice(0, Math.min(playerCount * 2, shuffled.length));
  
  return selectedQuestions.map((text, index) => ({
    id: `ai_${gameType}_${index}`,
    text: text
  }));
};

export const validateQuestionContent = (content: string): boolean => {
  return content.trim().length >= 10 && content.trim().length <= 500;
};
