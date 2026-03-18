import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { IdeaProvider, useIdeas } from './src/context/IdeaContext';
import { ToastProvider } from './src/context/ToastContext';
import { IdeaListScreen } from './src/screens/IdeaListScreen';
import { LeaderboardScreen } from './src/screens/LeaderboardScreen';
import { SubmitIdeaScreen } from './src/screens/SubmitIdeaScreen';
import { RootTabParamList } from './src/types/navigation';
import { getColors, getNavigationTheme } from './src/theme';

const Tab = createBottomTabNavigator<RootTabParamList>();

const tabIcons: Record<keyof RootTabParamList, string> = {
  Submit: '🚀',
  Ideas: '💡',
  Leaderboard: '🏆',
};

function AppShell() {
  const { isReady, themeMode, toggleTheme } = useIdeas();
  const colors = getColors(themeMode);

  if (!isReady) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.mutedText }]}>Loading ideas...</Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar style={themeMode === 'dark' ? 'light' : 'dark'} />
      <NavigationContainer theme={getNavigationTheme(themeMode)}>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerStyle: { backgroundColor: colors.surface },
            headerTitleStyle: { color: colors.text, fontWeight: '700' },
            headerTintColor: colors.text,
            tabBarStyle: {
              backgroundColor: colors.surface,
              borderTopColor: colors.border,
            },
            tabBarActiveTintColor: colors.primary,
            tabBarInactiveTintColor: colors.mutedText,
            tabBarIcon: ({ color }) => (
              <Text style={{ color, fontSize: 18 }}>{tabIcons[route.name]}</Text>
            ),
            headerRight: () => (
              <View style={styles.switchWrap}>
                <Switch
                  value={themeMode === 'dark'}
                  onValueChange={toggleTheme}
                  thumbColor={themeMode === 'dark' ? colors.primary : '#f5f5f5'}
                  trackColor={{ false: '#9ca3af', true: `${colors.primary}99` }}
                />
              </View>
            ),
          })}
        >
          <Tab.Screen name="Submit" component={SubmitIdeaScreen} options={{ title: 'Submit Idea' }} />
          <Tab.Screen name="Ideas" component={IdeaListScreen} options={{ title: 'All Ideas' }} />
          <Tab.Screen name="Leaderboard" component={LeaderboardScreen} options={{ title: 'Top Ideas' }} />
        </Tab.Navigator>
      </NavigationContainer>
    </>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <IdeaProvider>
        <ToastProvider>
          <AppShell />
        </ToastProvider>
      </IdeaProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    alignItems: 'center',
    flex: 1,
    gap: 10,
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 15,
  },
  switchWrap: {
    marginRight: 10,
  },
});
