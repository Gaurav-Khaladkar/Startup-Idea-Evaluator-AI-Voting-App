import React, { useState, useMemo } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider as PaperProvider, DefaultTheme, DarkTheme, Button } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';
import { useColorScheme } from 'react-native';

import IdeaSubmissionScreen from './screens/IdeaSubmissionScreen';
import IdeaListingScreen from './screens/IdeaListingScreen';
import LeaderboardScreen from './screens/LeaderboardScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');
  const theme = useMemo(() => (isDarkMode ? DarkTheme : DefaultTheme), [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider theme={theme}>
        <NavigationContainer theme={theme}>
          <Stack.Navigator initialRouteName="IdeaSubmission">
            <Stack.Screen
              name="IdeaSubmission"
              options={{
                title: 'Submit Idea',
                headerRight: () => (
                  <Button onPress={toggleDarkMode} compact>
                    {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                  </Button>
                ),
              }}
            >
              {(props) => <IdeaSubmissionScreen {...props} showToast={Toast.show} />}
            </Stack.Screen>

            <Stack.Screen
              name="IdeaListing"
              options={{ title: 'Ideas' }}
            >
              {(props) => <IdeaListingScreen {...props} showToast={Toast.show} />}
            </Stack.Screen>

            <Stack.Screen
              name="Leaderboard"
              component={LeaderboardScreen}
              options={{ title: 'Leaderboard' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
        <Toast />
      </PaperProvider>
    </GestureHandlerRootView>
  );
}
