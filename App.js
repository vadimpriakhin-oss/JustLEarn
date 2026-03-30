import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './screens/HomeScreen';
import TrueFalseScreen from './screens/TrueFalseScreen';
import MultiChoiceScreen from './screens/MultiChoiceScreen';
import FillBlankScreen from './screens/FillBlankScreen';
import DragDropScreen from './screens/DragDropScreen';
import AddTermScreen from './screens/AddTermScreen';
import TermsListScreen from './screens/TermsListScreen';
import { COLORS } from './utils/styles';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" backgroundColor={COLORS.background} />
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: COLORS.backgroundLight,
          },
          headerTintColor: COLORS.accent,
          headerTitleStyle: {
            fontWeight: 'bold',
            color: COLORS.accent,
          },
          contentStyle: {
            backgroundColor: COLORS.background,
          },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TrueFalse"
          component={TrueFalseScreen}
          options={{ title: 'True or False', headerShown: false }}
        />
        <Stack.Screen
          name="MultiChoice"
          component={MultiChoiceScreen}
          options={{ title: 'Multiple Choice', headerShown: false }}
        />
        <Stack.Screen
          name="FillBlank"
          component={FillBlankScreen}
          options={{ title: 'Fill in the Blank', headerShown: false }}
        />
        <Stack.Screen
          name="DragDrop"
          component={DragDropScreen}
          options={{ title: 'Match Terms', headerShown: false }}
        />
        <Stack.Screen
          name="AddTerm"
          component={AddTermScreen}
          options={{ title: 'Add Custom Term', headerShown: false }}
        />
        <Stack.Screen
          name="TermsList"
          component={TermsListScreen}
          options={{ title: 'My Terms', headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
