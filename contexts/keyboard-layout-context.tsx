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

import {
    DEFAULT_LAYOUT_ID,
    type KeyboardLayoutId,
} from '@/app/lib/keyboard-layouts';

type KeyboardLayoutContextValue = {
  layoutId: KeyboardLayoutId;
  isReady: boolean;
  setLayoutId: (id: KeyboardLayoutId) => void;
};

const STORAGE_KEY = 'letterboard.keyboardLayout';

const KeyboardLayoutContext = createContext<KeyboardLayoutContextValue | undefined>(undefined);

type ProviderProps = {
  children: ReactNode;
};

export function KeyboardLayoutProvider({ children }: ProviderProps) {
  const [layoutId, setLayoutState] = useState<KeyboardLayoutId>(DEFAULT_LAYOUT_ID);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((saved) => {
        if (saved === 'letterboard' || saved === 'qwerty') {
          setLayoutState(saved);
        }
      })
      .catch((error) => {
        console.warn('Failed to load keyboard layout preference', error);
      })
      .finally(() => setIsReady(true));
  }, []);

  const persistLayout = useCallback((id: KeyboardLayoutId) => {
    AsyncStorage.setItem(STORAGE_KEY, id).catch((error) => {
      console.warn('Failed to save keyboard layout preference', error);
    });
  }, []);

  const setLayoutId = useCallback(
    (id: KeyboardLayoutId) => {
      setLayoutState(id);
      persistLayout(id);
    },
    [persistLayout],
  );

  const value = useMemo(
    () => ({
      layoutId,
      isReady,
      setLayoutId,
    }),
    [layoutId, isReady, setLayoutId],
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

