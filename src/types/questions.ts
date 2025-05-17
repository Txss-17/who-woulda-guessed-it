
export type QuestionVisibility = 'private' | 'public';

export interface CustomQuestion {
  id: string;
  text: string;
  visibility: QuestionVisibility;
  createdAt: Date;
}
