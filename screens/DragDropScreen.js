import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import QuizHeader from '../components/QuizHeader';
import NavigationButton from '../components/NavigationButton';
import { getAllQuestions, shuffleArray } from '../utils/quizData';
import { getCustomTerms } from '../utils/storageService';
import { COLORS, FONTS, SPACING } from '../utils/styles';

export default function DragDropScreen({ navigation }) {
  const [pairs, setPairs] = useState([]);
  const [terms, setTerms] = useState([]);
  const [definitions, setDefinitions] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [matched, setMatched] = useState({});
  const [incorrect, setIncorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [finished, setFinished] = useState(false);

  const loadPairs = useCallback(async () => {
    const customTerms = await getCustomTerms();
    const allQ = getAllQuestions(customTerms);
    const selected = shuffleArray(allQ.dragDrop).slice(0, 6);
    setPairs(selected);
    setTerms(shuffleArray(selected.map((p) => p.term)));
    setDefinitions(shuffleArray(selected.map((p) => p.definition)));
    setTotal(selected.length);
    setMatched({});
    setSelectedTerm(null);
    setScore(0);
    setFinished(false);
    setIncorrect(null);
  }, []);

  useEffect(() => {
    loadPairs();
  }, [loadPairs]);

  const handleTermPress = (term) => {
    if (matched[term]) return;
    setSelectedTerm(term);
    setIncorrect(null);
  };

  const handleDefinitionPress = (definition) => {
    if (!selectedTerm) return;
    const correctPair = pairs.find((p) => p.term === selectedTerm);
    if (correctPair && correctPair.definition === definition) {
      const newMatched = { ...matched, [selectedTerm]: definition };
      setMatched(newMatched);
      setScore((s) => s + 1);
      setSelectedTerm(null);
      if (Object.keys(newMatched).length === total) {
        setTimeout(() => setFinished(true), 600);
      }
    } else {
      setIncorrect({ term: selectedTerm, definition });
      setTimeout(() => {
        setIncorrect(null);
        setSelectedTerm(null);
      }, 800);
    }
  };

  const isDefinitionMatched = (definition) =>
    Object.values(matched).includes(definition);

  if (pairs.length === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.loadingText}>Loading questions...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (finished) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.finishedTitle}>All Matched! 🎉</Text>
          <Text style={styles.finishedScore}>{score} / {total}</Text>
          <Text style={styles.finishedPercent}>{Math.round((score / total) * 100)}%</Text>
          <NavigationButton title="Play Again" onPress={loadPairs} style={styles.btn} />
          <NavigationButton
            title="Back to Home"
            variant="secondary"
            onPress={() => navigation.navigate('Home')}
            style={styles.btn}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <QuizHeader score={score} current={Object.keys(matched).length} total={total} title="Match Terms" />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.instruction}>
          {selectedTerm
            ? `Selected: "${selectedTerm}" — tap a definition`
            : 'Tap a term, then tap its matching definition'}
        </Text>

        <View style={styles.columns}>
          <View style={styles.column}>
            <Text style={styles.columnTitle}>Terms</Text>
            {terms.map((term) => (
              <TouchableOpacity
                key={term}
                style={[
                  styles.pill,
                  styles.termPill,
                  matched[term] && styles.pillMatched,
                  selectedTerm === term && styles.pillSelected,
                  incorrect?.term === term && styles.pillIncorrect,
                ]}
                onPress={() => handleTermPress(term)}
                disabled={!!matched[term]}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.pillText,
                    matched[term] && styles.pillTextMatched,
                  ]}
                >
                  {term}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.divider} />

          <View style={styles.column}>
            <Text style={styles.columnTitle}>Definitions</Text>
            {definitions.map((def) => (
              <TouchableOpacity
                key={def}
                style={[
                  styles.pill,
                  styles.defPill,
                  isDefinitionMatched(def) && styles.pillMatched,
                  incorrect?.definition === def && styles.pillIncorrect,
                ]}
                onPress={() => handleDefinitionPress(def)}
                disabled={isDefinitionMatched(def) || !selectedTerm}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.pillText,
                    isDefinitionMatched(def) && styles.pillTextMatched,
                  ]}
                >
                  {def}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <NavigationButton
          title="Back to Home"
          variant="secondary"
          onPress={() => navigation.navigate('Home')}
          style={styles.homeBtn}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.lg },
  container: { flexGrow: 1, padding: SPACING.md, paddingBottom: SPACING.xl },
  loadingText: { color: COLORS.textMuted, fontSize: FONTS.medium },
  instruction: {
    fontSize: FONTS.medium,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginBottom: SPACING.md,
    fontStyle: 'italic',
  },
  columns: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  column: { flex: 1 },
  divider: {
    width: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: SPACING.sm,
    alignSelf: 'stretch',
  },
  columnTitle: {
    fontSize: FONTS.medium,
    fontWeight: 'bold',
    color: COLORS.accent,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  pill: {
    borderRadius: 8,
    padding: SPACING.sm,
    marginVertical: SPACING.xs,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
    borderWidth: 1,
  },
  termPill: {
    backgroundColor: 'rgba(0, 127, 255, 0.1)',
    borderColor: 'rgba(0, 127, 255, 0.5)',
  },
  defPill: {
    backgroundColor: 'rgba(255, 127, 0, 0.1)',
    borderColor: 'rgba(255, 127, 0, 0.5)',
  },
  pillSelected: {
    backgroundColor: 'rgba(0, 255, 204, 0.2)',
    borderColor: COLORS.accent,
    borderWidth: 2,
  },
  pillMatched: {
    backgroundColor: 'rgba(0, 204, 102, 0.2)',
    borderColor: COLORS.correct,
  },
  pillIncorrect: {
    backgroundColor: 'rgba(255, 51, 51, 0.2)',
    borderColor: COLORS.incorrect,
  },
  pillText: { fontSize: FONTS.small, color: COLORS.text, textAlign: 'center' },
  pillTextMatched: { color: COLORS.correct },
  finishedTitle: { fontSize: FONTS.xxlarge, fontWeight: 'bold', color: COLORS.accent, marginBottom: SPACING.md, textAlign: 'center' },
  finishedScore: { fontSize: 56, fontWeight: 'bold', color: COLORS.text, textAlign: 'center' },
  finishedPercent: { fontSize: FONTS.xlarge, color: COLORS.textMuted, marginBottom: SPACING.xl, textAlign: 'center' },
  btn: { width: '80%', marginVertical: SPACING.sm },
  homeBtn: { marginTop: SPACING.lg },
});
