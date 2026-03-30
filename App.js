import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

import { TermsProvider } from './context/TermsContext';
import HomeScreen from './screens/HomeScreen';
import QuizScreen from './screens/QuizScreen';
import AddTermScreen from './screens/AddTermScreen';
import { colors } from './styles/common';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <TermsProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: { backgroundColor: colors.backgroundSecondary },
            headerTintColor: colors.neon,
            headerTitleStyle: { fontWeight: 'bold', color: colors.neon },
            headerBackTitle: 'Back',
            contentStyle: { backgroundColor: colors.background },
          }}
        >
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Quiz"
            component={QuizScreen}
            options={{ title: 'Quiz', headerShown: false }}
          />
          <Stack.Screen
            name="AddTerm"
            component={AddTermScreen}
            options={{ title: 'Add Terms', headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </TermsProvider>
  );
}
