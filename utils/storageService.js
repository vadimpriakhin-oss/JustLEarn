import AsyncStorage from '@react-native-async-storage/async-storage';

const CUSTOM_TERMS_KEY = '@justlearn_custom_terms';

export const getCustomTerms = async () => {
  try {
    const json = await AsyncStorage.getItem(CUSTOM_TERMS_KEY);
    return json ? JSON.parse(json) : [];
  } catch (error) {
    console.error('Error loading custom terms:', error);
    return [];
  }
};

export const saveCustomTerms = async (terms) => {
  try {
    await AsyncStorage.setItem(CUSTOM_TERMS_KEY, JSON.stringify(terms));
  } catch (error) {
    console.error('Error saving custom terms:', error);
  }
};

export const addCustomTerm = async (term, answer) => {
  try {
    const existing = await getCustomTerms();
    const newTerm = {
      id: Date.now().toString(),
      term: term.trim(),
      answer: answer.trim(),
      createdAt: new Date().toISOString(),
    };
    const updated = [...existing, newTerm];
    await saveCustomTerms(updated);
    return updated;
  } catch (error) {
    console.error('Error adding custom term:', error);
    return [];
  }
};

export const deleteCustomTerm = async (id) => {
  try {
    const existing = await getCustomTerms();
    const updated = existing.filter((t) => t.id !== id);
    await saveCustomTerms(updated);
    return updated;
  } catch (error) {
    console.error('Error deleting custom term:', error);
    return [];
  }
};

export const updateCustomTerm = async (id, term, answer) => {
  try {
    const existing = await getCustomTerms();
    const updated = existing.map((t) =>
      t.id === id ? { ...t, term: term.trim(), answer: answer.trim() } : t
    );
    await saveCustomTerms(updated);
    return updated;
  } catch (error) {
    console.error('Error updating custom term:', error);
    return [];
  }
};

export const clearAllCustomTerms = async () => {
  try {
    await AsyncStorage.removeItem(CUSTOM_TERMS_KEY);
    return [];
  } catch (error) {
    console.error('Error clearing custom terms:', error);
    return [];
  }
};
