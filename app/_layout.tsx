import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#1d1d1d' },
          headerTintColor: '#00ffcc',
          headerTitleStyle: { fontWeight: 'bold' },
          contentStyle: { backgroundColor: '#1d1d1d' },
        }}
      />
    </>
  );
}
