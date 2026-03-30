import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import Navigation from '@/components/Navigation';

interface Term {
  term: string;
  definition: string;
}

export default function CreateScreen() {
  const [term, setTerm] = useState('');
  const [definition, setDefinition] = useState('');
  const [terms, setTerms] = useState<Term[]>([]);

  const handleAdd = () => {
    if (!term.trim() || !definition.trim()) {
      Alert.alert('Error', 'Please fill in both the term and definition.');
      return;
    }
    setTerms((prev) => [...prev, { term: term.trim(), definition: definition.trim() }]);
    setTerm('');
    setDefinition('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>➕ Add Term</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Term"
          placeholderTextColor="#666"
          value={term}
          onChangeText={setTerm}
        />
        <TextInput
          style={[styles.input, styles.inputMultiline]}
          placeholder="Definition"
          placeholderTextColor="#666"
          value={definition}
          onChangeText={setDefinition}
          multiline
        />
        <TouchableOpacity style={styles.button} onPress={handleAdd}>
          <Text style={styles.buttonText}>Add Term</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.list} contentContainerStyle={{ paddingBottom: 80 }}>
        {terms.map((item, index) => (
          <View key={index} style={styles.termCard}>
            <Text style={styles.termTitle}>{item.term}</Text>
            <Text style={styles.termDef}>{item.definition}</Text>
          </View>
        ))}
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
    marginBottom: 24,
    textShadowColor: '#00ffcc',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  form: {
    backgroundColor: 'rgba(45, 45, 45, 0.8)',
    borderRadius: 10,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#00ffcc',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 5,
  },
  input: {
    backgroundColor: 'rgba(60, 60, 60, 0.9)',
    borderRadius: 8,
    color: '#f0f0f0',
    fontSize: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
  },
  inputMultiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#ff007f',
    borderRadius: 5,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ff007f',
    fontSize: 16,
    fontWeight: 'bold',
  },
  list: {
    flex: 1,
  },
  termCard: {
    backgroundColor: 'rgba(45, 45, 45, 0.8)',
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#00ffcc',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 3,
  },
  termTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00ffcc',
    marginBottom: 4,
  },
  termDef: {
    fontSize: 14,
    color: '#f0f0f0',
    opacity: 0.85,
  },
});
