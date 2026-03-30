import { useRouter } from 'expo-router';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Navigation from '@/components/Navigation';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to JustLEarn</Text>
      <Text style={styles.subtitle}>Your personal learning companion</Text>

      <ScrollView contentContainerStyle={styles.cardsContainer}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push('/screens/quiz')}
          accessibilityRole="button"
        >
          <Text style={styles.cardTitle}>📝 Quiz</Text>
          <Text style={styles.cardDescription}>
            Test your knowledge with interactive quizzes
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push('/screens/create')}
          accessibilityRole="button"
        >
          <Text style={styles.cardTitle}>➕ Create</Text>
          <Text style={styles.cardDescription}>
            Add new terms and study materials
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <Navigation />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1d1d1d',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#00ffcc',
    textAlign: 'center',
    textShadowColor: '#00ffcc',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#f0f0f0',
    textAlign: 'center',
    marginBottom: 32,
    opacity: 0.8,
  },
  cardsContainer: {
    gap: 16,
    paddingBottom: 80,
  },
  card: {
    backgroundColor: 'rgba(45, 45, 45, 0.8)',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#00ffcc',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00ffcc',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#f0f0f0',
    opacity: 0.85,
  },
});
