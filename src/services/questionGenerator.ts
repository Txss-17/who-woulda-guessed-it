
// Service pour générer des questions via l'IA ou récupérer des questions prédéfinies

interface Question {
  id: string;
  text: string;
}

// Types de questions disponibles
export type QuestionType = 'love' | 'friendly' | 'crazy' | 'party' | 'classic';

// Fonction pour générer des questions à la volée basées sur le type
export const generateQuestions = async (
  type: QuestionType,
  count: number = 5
): Promise<Question[]> => {
  // Dans une implémentation complète, cette fonction appellerait une API ou un edge function Supabase
  // pour générer les questions via un modèle d'IA
  
  // Pour le moment, simulons une génération avec un délai
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Questions par défaut selon le type
  const typeQuestions: Record<QuestionType, string[]> = {
    love: [
      "...embrasser un.e inconnu.e?",
      "...faire une déclaration d'amour en public?",
      "...quitter quelqu'un par message?",
      "...avoir un coup de foudre?",
      "...se marier sur un coup de tête?",
      "...mentir à propos de ses sentiments?",
      "...rester ami.e avec tous ses ex?",
      "...pleurer en regardant un film romantique?",
      "...être jaloux.se?",
      "...organiser une surprise romantique élaborée?"
    ],
    friendly: [
      "...aider un.e inconnu.e en difficulté?",
      "...prêter de l'argent à un.e ami.e?",
      "...garder un secret pendant des années?",
      "...organiser une fête surprise?",
      "...dire la vérité même si ça blesse?",
      "...pardonner une trahison?",
      "...faire un long détour pour aider quelqu'un?",
      "...défendre un.e ami.e absent.e?",
      "...être disponible à toute heure du jour ou de la nuit?",
      "...sacrifier quelque chose d'important pour un.e ami.e?"
    ],
    crazy: [
      "...faire un saut en parachute?",
      "...se faire tatouer sur un coup de tête?",
      "...manger quelque chose d'extrêmement épicé?",
      "...faire un road trip sans planification?",
      "...partir vivre dans un autre pays?",
      "...participer à un jeu télévisé?",
      "...chanter en public sans préparation?",
      "...nager avec des requins?",
      "...escalader une montagne?",
      "...passer une nuit dans une maison hantée?"
    ],
    party: [
      "...danser sur une table?",
      "...finir la soirée au karaoké?",
      "...inviter des inconnu.e.s à une fête?",
      "...boire un cocktail improbable?",
      "...être le/la dernier.ère à partir d'une soirée?",
      "...improviser un discours?",
      "...prendre le micro pour animer?",
      "...inventer un jeu à boire?",
      "...faire une entrée remarquée?",
      "...organiser une after party chez soi?"
    ],
    classic: [
      "...dormir au boulot?",
      "...oublier l'anniversaire de son/sa partenaire?",
      "...devenir célèbre sur TikTok?",
      "...dépenser tout son argent en une journée?",
      "...adopter 10 chats?",
      "...quitter son travail pour voyager?",
      "...se perdre même avec un GPS?",
      "...gagner à la loterie et tout perdre en un an?",
      "...faire une gaffe embarrassante en public?",
      "...survivre à une apocalypse zombie?"
    ]
  };

  // Simuler la génération de questions plus variées en fonction du type
  const baseQuestions = typeQuestions[type] || typeQuestions.classic;
  
  // Pour simuler une génération aléatoire, on mélange les questions et on en prend "count"
  const shuffled = [...baseQuestions].sort(() => 0.5 - Math.random());
  
  return shuffled.slice(0, count).map((text, index) => ({
    id: `${type}-${index}-${Date.now()}`,
    text
  }));
};

// Fonction pour récupérer les questions prédéfinies
export const getPredefinedQuestions = (): Question[] => {
  return [
    { id: 'classic-1', text: "...dormir au boulot?" },
    { id: 'classic-2', text: "...oublier l'anniversaire de son/sa partenaire?" },
    { id: 'classic-3', text: "...devenir célèbre sur TikTok?" },
    { id: 'classic-4', text: "...dépenser tout son argent en une journée?" },
    { id: 'classic-5', text: "...adopter 10 chats?" },
    { id: 'classic-6', text: "...quitter son travail pour voyager?" },
    { id: 'classic-7', text: "...se perdre même avec un GPS?" },
    { id: 'classic-8', text: "...gagner à la loterie et tout perdre en un an?" },
    { id: 'classic-9', text: "...faire une gaffe embarrassante en public?" },
    { id: 'classic-10', text: "...survivre à une apocalypse zombie?" }
  ];
};
