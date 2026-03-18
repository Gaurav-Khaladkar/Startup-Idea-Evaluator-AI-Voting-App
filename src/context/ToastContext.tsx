import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ToastType = 'success' | 'info' | 'error';

interface ToastPayload {
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const toastColors: Record<ToastType, string> = {
  success: '#16a34a',
  info: '#0ea5e9',
  error: '#ef4444',
};

export function ToastProvider({ children }: PropsWithChildren) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const opacity = useRef(new Animated.Value(0)).current;
  const [toast, setToast] = useState<ToastPayload | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = 'info') => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      opacity.stopAnimation();
      setToast({ message, type });

      Animated.timing(opacity, {
        duration: 180,
        easing: Easing.out(Easing.ease),
        toValue: 1,
        useNativeDriver: true,
      }).start();

      timeoutRef.current = setTimeout(() => {
        Animated.timing(opacity, {
          duration: 240,
          easing: Easing.in(Easing.ease),
          toValue: 0,
          useNativeDriver: true,
        }).start(() => setToast(null));
      }, 1900);
    },
    [opacity],
  );

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast ? (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.toast,
            {
              backgroundColor: toastColors[toast.type],
              marginTop: insets.top + 10,
              maxWidth: Math.min(520, width - 28),
              opacity,
            },
          ]}
        >
          <Text style={styles.toastText}>{toast.message}</Text>
        </Animated.View>
      ) : null}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider.');
  }
  return context;
}

const styles = StyleSheet.create({
  toast: {
    alignSelf: 'center',
    borderRadius: 10,
    elevation: 5,
    paddingHorizontal: 14,
    paddingVertical: 10,
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    top: 0,
    zIndex: 99,
  },
  toastText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});
