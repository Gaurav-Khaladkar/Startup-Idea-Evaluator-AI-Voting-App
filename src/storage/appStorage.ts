import AsyncStorage from '@react-native-async-storage/async-storage';
import { StartupIdea, ThemeMode } from '../types/idea';

const STORAGE_KEYS = {
  ideas: '@startup_ideas',
  votedIdeaIds: '@voted_idea_ids',
  themeMode: '@theme_mode',
};

export interface PersistedState {
  ideas: StartupIdea[];
  votedIdeaIds: string[];
  themeMode: ThemeMode;
}

const FALLBACK_STATE: PersistedState = {
  ideas: [],
  votedIdeaIds: [],
  themeMode: 'light',
};

function safeParse<T>(value: string | null, fallback: T): T {
  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function safeIdeas(value: unknown): StartupIdea[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(
    (item): item is StartupIdea =>
      typeof item === 'object' &&
      item !== null &&
      typeof (item as StartupIdea).id === 'string' &&
      typeof (item as StartupIdea).name === 'string' &&
      typeof (item as StartupIdea).tagline === 'string' &&
      typeof (item as StartupIdea).description === 'string' &&
      typeof (item as StartupIdea).aiRating === 'number' &&
      typeof (item as StartupIdea).votes === 'number',
  );
}

function safeVotedIds(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === 'string');
}

export async function loadPersistedState(): Promise<PersistedState> {
  try {
    const entries = await AsyncStorage.multiGet([
      STORAGE_KEYS.ideas,
      STORAGE_KEYS.votedIdeaIds,
      STORAGE_KEYS.themeMode,
    ]);

    const map = new Map(entries);
    const ideasValue = safeParse<unknown>(map.get(STORAGE_KEYS.ideas) ?? null, []);
    const votedIdsValue = safeParse<unknown>(map.get(STORAGE_KEYS.votedIdeaIds) ?? null, []);
    const themeValue = map.get(STORAGE_KEYS.themeMode);

    return {
      ideas: safeIdeas(ideasValue),
      votedIdeaIds: safeVotedIds(votedIdsValue),
      themeMode: themeValue === 'dark' ? 'dark' : FALLBACK_STATE.themeMode,
    };
  } catch {
    return FALLBACK_STATE;
  }
}

export async function saveIdeas(ideas: StartupIdea[]) {
  await AsyncStorage.setItem(STORAGE_KEYS.ideas, JSON.stringify(ideas));
}

export async function saveVotedIdeaIds(votedIdeaIds: string[]) {
  await AsyncStorage.setItem(STORAGE_KEYS.votedIdeaIds, JSON.stringify(votedIdeaIds));
}

export async function saveThemeMode(themeMode: ThemeMode) {
  await AsyncStorage.setItem(STORAGE_KEYS.themeMode, themeMode);
}
