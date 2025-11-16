import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from 'react';

import { DEFAULT_LAYOUT_ID, type KeyboardLayoutId } from '@/lib/keyboard-layouts';

type KeyboardLayoutContextValue = {
  layoutId: KeyboardLayoutId;
  includePunctuation: boolean;
  isReady: boolean;
  setLayoutId: (id: KeyboardLayoutId) => void;
  setIncludePunctuation: (value: boolean) => void;
};

const LAYOUT_STORAGE_KEY = 'letterboard.keyboardLayout';
const PUNCTUATION_STORAGE_KEY = 'letterboard.includePunctuation';

const KeyboardLayoutContext = createContext<KeyboardLayoutContextValue | undefined>(undefined);

type ProviderProps = {
  children: ReactNode;
};

export function KeyboardLayoutProvider({ children }: ProviderProps) {
  const [layoutId, setLayoutState] = useState<KeyboardLayoutId>(DEFAULT_LAYOUT_ID);
  const [includePunctuation, setIncludePunctuationState] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    AsyncStorage.multiGet([LAYOUT_STORAGE_KEY, PUNCTUATION_STORAGE_KEY])
      .then(([savedLayoutEntry, savedPunctuationEntry]) => {
        const savedLayout = savedLayoutEntry?.[1];
        const savedIncludePunctuation = savedPunctuationEntry?.[1];

        if (savedLayout === 'letterboard' || savedLayout === 'qwerty') {
          setLayoutState(savedLayout);
        }

        if (savedIncludePunctuation === 'true') {
          setIncludePunctuationState(true);
        } else if (savedIncludePunctuation === 'false') {
          setIncludePunctuationState(false);
        }
      })
      .catch((error) => {
        console.warn('Failed to load keyboard preferences', error);
      })
      .finally(() => setIsReady(true));
  }, []);

  const persistLayout = useCallback((id: KeyboardLayoutId) => {
    AsyncStorage.setItem(LAYOUT_STORAGE_KEY, id).catch((error) => {
      console.warn('Failed to save keyboard layout preference', error);
    });
  }, []);

  const persistIncludePunctuation = useCallback((value: boolean) => {
    AsyncStorage.setItem(PUNCTUATION_STORAGE_KEY, value ? 'true' : 'false').catch((error) => {
      console.warn('Failed to save punctuation preference', error);
    });
  }, []);

  const setLayoutId = useCallback(
    (id: KeyboardLayoutId) => {
      setLayoutState(id);
      persistLayout(id);
    },
    [persistLayout],
  );

  const setIncludePunctuation = useCallback(
    (value: boolean) => {
      setIncludePunctuationState(value);
      persistIncludePunctuation(value);
    },
    [persistIncludePunctuation],
  );

  const value = useMemo(
    () => ({
      layoutId,
      includePunctuation,
      isReady,
      setLayoutId,
      setIncludePunctuation,
    }),
    [layoutId, includePunctuation, isReady, setLayoutId, setIncludePunctuation],
  );

  return <KeyboardLayoutContext.Provider value={value}>{children}</KeyboardLayoutContext.Provider>;
}

export function useKeyboardLayout() {
  const context = useContext(KeyboardLayoutContext);
  if (!context) {
    throw new Error('useKeyboardLayout must be used within a KeyboardLayoutProvider');
  }
  return context;
}

