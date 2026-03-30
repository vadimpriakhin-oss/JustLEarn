import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import QuizHeader from '../components/QuizHeader';
import QuestionCard from '../components/QuestionCard';
import NavigationButton from '../components/NavigationButton';
import { getAllQuestions, shuffleArray } from '../utils/quizData';
import { getCustomTerms } from '../utils/storageService';
import { COLORS, FONTS, SPACING } from '../utils/styles';

export default function FillBlankScreen({ navigation }) {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [finished, setFinished] = useState(false);
  const inputRef = useRef(null);

  const loadQuestions = useCallback(async () => {
    const customTerms = await getCustomTerms();
    const allQ = getAllQuestions(customTerms);
    setQuestions(shuffleArray(allQ.fillBlank).slice(0, 10));
  }, []);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  const handleSubmit = () => {
    if (answered || userInput.trim() === '') return;
    const current = questions[currentIndex];
    const isCorrect =
      userInput.trim().toLowerCase() === current.answer.toLowerCase();
    if (isCorrect) setScore((s) => s + 1);
    setFeedback({
      correct: isCorrect,
      message: isCorrect ? '✅ Correct!' : `❌ Wrong! Answer: ${current.answer}`,
    });
    setAnswered(true);
  };

  const handleNext = () => {
    if (currentIndex + 1 >= questions.length) {
      setFinished(true);
    } else {
      setCurrentIndex((i) => i + 1);
      setFeedback(null);
      setAnswered(false);
      setUserInput('');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  if (questions.length === 0) {
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
          <Text style={styles.finishedTitle}>Quiz Complete! 🎉</Text>
          <Text style={styles.finishedScore}>{score} / {questions.length}</Text>
          <Text style={styles.finishedPercent}>{Math.round((score / questions.length) * 100)}%</Text>
          <NavigationButton
            title="Play Again"
            onPress={() => {
              setCurrentIndex(0);
              setScore(0);
              setFeedback(null);
              setAnswered(false);
              setUserInput('');
              setFinished(false);
              loadQuestions();
            }}
            style={styles.btn}
          />
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

  const current = questions[currentIndex];

  return (
    <SafeAreaView style={styles.safe}>
      <QuizHeader
        score={score}
        current={currentIndex + 1}
        total={questions.length}
        title="Fill in the Blank"
      />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <QuestionCard question={current.question} feedback={feedback}>
            <TextInput
              ref={inputRef}
              style={[styles.input, answered && styles.inputDisabled]}
              value={userInput}
              onChangeText={setUserInput}
              placeholder="Type your answer..."
              placeholderTextColor={COLORS.textMuted}
              editable={!answered}
              onSubmitEditing={handleSubmit}
              returnKeyType="done"
              autoCorrect={false}
              autoCapitalize="none"
            />
            <NavigationButton
              title="Submit Answer"
              onPress={handleSubmit}
              disabled={answered || userInput.trim() === ''}
            />
          </QuestionCard>

          {answered && (
            <NavigationButton
              title={currentIndex + 1 < questions.length ? 'Next Question →' : 'See Results'}
              onPress={handleNext}
              style={styles.nextBtn}
            />
          )}
          <NavigationButton
            title="Back to Home"
            variant="secondary"
            onPress={() => navigation.navigate('Home')}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  flex: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.lg },
  container: { flexGrow: 1, padding: SPACING.md, paddingBottom: SPACING.xl },
  loadingText: { color: COLORS.textMuted, fontSize: FONTS.medium },
  finishedTitle: { fontSize: FONTS.xxlarge, fontWeight: 'bold', color: COLORS.accent, marginBottom: SPACING.md, textAlign: 'center' },
  finishedScore: { fontSize: 56, fontWeight: 'bold', color: COLORS.text, textAlign: 'center' },
  finishedPercent: { fontSize: FONTS.xlarge, color: COLORS.textMuted, marginBottom: SPACING.xl, textAlign: 'center' },
  btn: { width: '80%', marginVertical: SPACING.sm },
  input: {
    backgroundColor: COLORS.backgroundLight,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    color: COLORS.text,
    fontSize: FONTS.medium,
    padding: SPACING.md,
    marginVertical: SPACING.sm,
  },
  inputDisabled: { opacity: 0.5 },
  nextBtn: { marginTop: SPACING.sm, marginBottom: SPACING.xs },
});
