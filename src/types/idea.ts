export interface StartupIdea {
  id: string;
  name: string;
  tagline: string;
  description: string;
  aiRating: number;
  votes: number;
  createdAt: string;
}

export interface IdeaInput {
  name: string;
  tagline: string;
  description: string;
}

export type SortOption = 'rating' | 'votes';
export type ThemeMode = 'light' | 'dark';
