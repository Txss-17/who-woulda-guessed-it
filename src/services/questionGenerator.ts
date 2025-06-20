// Service pour générer des questions via IA (placeholder pour l'implémentation future)
export const generateQuestions = async (
  gameType: string,
  playerCount: number,
  difficulty: 'easy' | 'medium' | 'hard' = 'medium'
): Promise<string[]> => {
  // Pour l'instant, retourner des questions par défaut
  // À remplacer par un appel à l'API IA quand disponible
  
  const defaultQuestions = {
    love: [
      "Qui est le plus susceptible de tomber amoureux au premier regard ?",
      "Qui est le plus susceptible d'écrire des poèmes d'amour ?",
      "Qui est le plus susceptible de faire une déclaration romantique en public ?",
      "Qui est le plus susceptible de se marier en premier ?",
      "Qui est le plus susceptible d'avoir le plus d'histoires d'amour ?",
      "Qui est le plus susceptible de pleurer en regardant un film romantique ?",
      "Qui est le plus susceptible d'organiser un rendez-vous parfait ?",
      "Qui est le plus susceptible de garder des lettres d'amour ?"
    ],
    friendly: [
      "Qui est le plus susceptible de devenir célèbre ?",
      "Qui est le plus susceptible d'oublier son propre anniversaire ?",
      "Qui est le plus susceptible de survivre à une apocalypse zombie ?",
      "Qui est le plus susceptible de devenir millionnaire ?",
      "Qui est le plus susceptible de partir vivre à l'étranger ?",
      "Qui est le plus susceptible de faire le tour du monde ?",
      "Qui est le plus susceptible de devenir végétarien ?",
      "Qui est le plus susceptible de collectionner quelque chose de bizarre ?"
    ],
    crazy: [
      "Qui est le plus susceptible de manger de la nourriture périmée ?",
      "Qui est le plus susceptible de danser nu sous la pluie ?",
      "Qui est le plus susceptible de se faire tatouer sur un coup de tête ?",
      "Qui est le plus susceptible de parler tout seul en public ?",
      "Qui est le plus susceptible de dormir avec ses chaussettes ?",
      "Qui est le plus susceptible de chanter sous la douche ?",
      "Qui est le plus susceptible de faire du shopping en pyjama ?",
      "Qui est le plus susceptible d'avoir peur des clowns ?"
    ],
    party: [
      "Qui est le plus susceptible de finir sur la table de danse ?",
      "Qui est le plus susceptible d'organiser la meilleure fête ?",
      "Qui est le plus susceptible de boire le plus ?",
      "Qui est le plus susceptible de chanter au karaoké ?",
      "Qui est le plus susceptible de faire des shots ?",
      "Qui est le plus susceptible de draguer quelqu'un en soirée ?",
      "Qui est le plus susceptible de perdre ses clés en soirée ?",
      "Qui est le plus susceptible de finir la soirée dans un fast-food ?"
    ]
  };

  const questions = defaultQuestions[gameType as keyof typeof defaultQuestions] || defaultQuestions.friendly;
  
  // Mélanger et retourner le nombre de questions demandé
  const shuffled = [...questions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(playerCount * 2, shuffled.length));
};

export const validateQuestionContent = (content: string): boolean => {
  return content.trim().length >= 10 && content.trim().length <= 500;
};
