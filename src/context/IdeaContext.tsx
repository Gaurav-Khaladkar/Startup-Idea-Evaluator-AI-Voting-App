import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { loadPersistedState, saveIdeas, saveThemeMode, saveVotedIdeaIds } from '../storage/appStorage';
import { IdeaInput, StartupIdea, ThemeMode } from '../types/idea';
import { generateFakeAiRating } from '../utils/rating';

interface UpvoteResult {
  success: boolean;
  message: string;
}

interface IdeaContextValue {
  ideas: StartupIdea[];
  isReady: boolean;
  themeMode: ThemeMode;
  addIdea: (input: IdeaInput) => StartupIdea;
  hasVoted: (ideaId: string) => boolean;
  upvoteIdea: (ideaId: string) => UpvoteResult;
  toggleTheme: () => void;
}

const IdeaContext = createContext<IdeaContextValue | undefined>(undefined);

function createIdeaId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function IdeaProvider({ children }: PropsWithChildren) {
  const [ideas, setIdeas] = useState<StartupIdea[]>([]);
  const [votedIdeaIds, setVotedIdeaIds] = useState<string[]>([]);
  const [themeMode, setThemeMode] = useState<ThemeMode>('light');
  const [isReady, setIsReady] = useState(false);
  const ideasRef = useRef<StartupIdea[]>([]);
  const votedIdeaIdsRef = useRef<string[]>([]);

  useEffect(() => {
    let active = true;

    const hydrate = async () => {
      const persistedState = await loadPersistedState();
      if (!active) {
        return;
      }

      setIdeas(persistedState.ideas);
      setVotedIdeaIds(persistedState.votedIdeaIds);
      setThemeMode(persistedState.themeMode);
      ideasRef.current = persistedState.ideas;
      votedIdeaIdsRef.current = persistedState.votedIdeaIds;
      setIsReady(true);
    };

    hydrate();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    ideasRef.current = ideas;
  }, [ideas]);

  useEffect(() => {
    votedIdeaIdsRef.current = votedIdeaIds;
  }, [votedIdeaIds]);

  useEffect(() => {
    if (!isReady) {
      return;
    }
    saveIdeas(ideas).catch(() => undefined);
  }, [ideas, isReady]);

  useEffect(() => {
    if (!isReady) {
      return;
    }
    saveVotedIdeaIds(votedIdeaIds).catch(() => undefined);
  }, [isReady, votedIdeaIds]);

  useEffect(() => {
    if (!isReady) {
      return;
    }
    saveThemeMode(themeMode).catch(() => undefined);
  }, [isReady, themeMode]);

  const addIdea = useCallback((input: IdeaInput) => {
    const newIdea: StartupIdea = {
      id: createIdeaId(),
      name: input.name.trim(),
      tagline: input.tagline.trim(),
      description: input.description.trim(),
      aiRating: generateFakeAiRating(input),
      votes: 0,
      createdAt: new Date().toISOString(),
    };

    setIdeas((previousIdeas) => {
      const nextIdeas = [newIdea, ...previousIdeas];
      ideasRef.current = nextIdeas;
      return nextIdeas;
    });
    return newIdea;
  }, []);

  const hasVoted = useCallback(
    (ideaId: string) => {
      return votedIdeaIds.includes(ideaId);
    },
    [votedIdeaIds],
  );

  const upvoteIdea = useCallback(
    (ideaId: string): UpvoteResult => {
      if (votedIdeaIdsRef.current.includes(ideaId)) {
        return {
          success: false,
          message: 'You already voted for this idea.',
        };
      }

      if (!ideasRef.current.some((idea) => idea.id === ideaId)) {
        return {
          success: false,
          message: 'Idea not found.',
        };
      }

      setIdeas((previousIdeas) => {
        const nextIdeas = previousIdeas.map((idea) =>
          idea.id === ideaId ? { ...idea, votes: idea.votes + 1 } : idea,
        );
        ideasRef.current = nextIdeas;
        return nextIdeas;
      });
      setVotedIdeaIds((previousIds) => {
        const nextIds = [...previousIds, ideaId];
        votedIdeaIdsRef.current = nextIds;
        return nextIds;
      });
      return {
        success: true,
        message: 'Vote counted!',
      };
    },
    [],
  );

  const toggleTheme = useCallback(() => {
    setThemeMode((current) => (current === 'dark' ? 'light' : 'dark'));
  }, []);

  const value = useMemo(
    () => ({
      ideas,
      isReady,
      themeMode,
      addIdea,
      hasVoted,
      upvoteIdea,
      toggleTheme,
    }),
    [ideas, isReady, themeMode, addIdea, hasVoted, upvoteIdea, toggleTheme],
  );

  return <IdeaContext.Provider value={value}>{children}</IdeaContext.Provider>;
}

export function useIdeas() {
  const context = useContext(IdeaContext);
  if (!context) {
    throw new Error('useIdeas must be used within IdeaProvider.');
  }
  return context;
}
