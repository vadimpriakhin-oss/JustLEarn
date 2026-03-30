import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { defaultQuestions } from '../data/questions';

const STORAGE_KEY = '@justlearn_terms';

const TermsContext = createContext(null);

export function TermsProvider({ children }) {
  const [terms, setTerms] = useState([]);

  useEffect(() => {
    loadTerms();
  }, []);

  async function loadTerms() {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        setTerms(JSON.parse(stored));
      } else {
        setTerms(defaultQuestions);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(defaultQuestions));
      }
    } catch {
      setTerms(defaultQuestions);
    }
  }

  async function addTerm(term, answer) {
    const newTerm = {
      id: Date.now().toString(),
      term: term.trim(),
      answer: answer.trim(),
    };
    const updated = [...terms, newTerm];
    setTerms(updated);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {}
    return newTerm;
  }

  async function addTermsBatch(pairs) {
    const newTerms = pairs.map((p) => ({
      id: `${Date.now()}-${Math.random()}`,
      term: p.term.trim(),
      answer: p.answer.trim(),
    }));
    const updated = [...terms, ...newTerms];
    setTerms(updated);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {}
  }

  async function deleteTerm(id) {
    const updated = terms.filter((t) => t.id !== id);
    setTerms(updated);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {}
  }

  async function resetToDefaults() {
    setTerms(defaultQuestions);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(defaultQuestions));
    } catch {}
  }

  return (
    <TermsContext.Provider value={{ terms, addTerm, addTermsBatch, deleteTerm, resetToDefaults }}>
      {children}
    </TermsContext.Provider>
  );
}

export function useTerms() {
  const ctx = useContext(TermsContext);
  if (!ctx) throw new Error('useTerms must be used within TermsProvider');
  return ctx;
}
