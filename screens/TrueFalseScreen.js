import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import QuizHeader from '../components/QuizHeader';
import QuestionCard from '../components/QuestionCard';
import NavigationButton from '../components/NavigationButton';
import { getAllQuestions, shuffleArray } from '../utils/quizData';
import { getCustomTerms } from '../utils/storageService';
import { COLORS, FONTS, SPACING } from '../utils/styles';

export default function TrueFalseScreen({ navigation }) {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [finished, setFinished] = useState(false);

  const loadQuestions = useCallback(async () => {
    const customTerms = await getCustomTerms();
    const allQ = getAllQuestions(customTerms);
    setQuestions(shuffleArray(allQ.trueFalse).slice(0, 10));
  }, []);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  const handleAnswer = (selected) => {
    if (answered) return;
    const current = questions[currentIndex];
    const isCorrect = selected === current.answer;
    if (isCorrect) {
      setScore((s) => s + 1);
    }
    setFeedback({
      correct: isCorrect,
      message: isCorrect
        ? '✅ Correct!'
        : `❌ Wrong! The answer was ${current.answer ? 'TRUE' : 'FALSE'}.`,
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
          <Text style={styles.finishedScore}>
            {score} / {questions.length}
          </Text>
          <Text style={styles.finishedPercent}>
            {Math.round((score / questions.length) * 100)}%
          </Text>
          <NavigationButton
            title="Play Again"
            onPress={() => {
              setCurrentIndex(0);
              setScore(0);
              setFeedback(null);
              setAnswered(false);
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
        title="True or False"
      />
      <ScrollView contentContainerStyle={styles.container}>
        <QuestionCard question={current.statement} feedback={feedback}>
          <View style={styles.btnRow}>
            <TouchableOpacity
              style={[styles.tfBtn, styles.trueBtn, answered && styles.btnDisabled]}
              onPress={() => handleAnswer(true)}
              disabled={answered}
              activeOpacity={0.8}
            >
              <Text style={styles.tfBtnText}>✓ TRUE</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tfBtn, styles.falseBtn, answered && styles.btnDisabled]}
              onPress={() => handleAnswer(false)}
              disabled={answered}
              activeOpacity={0.8}
            >
              <Text style={styles.tfBtnText}>✗ FALSE</Text>
            </TouchableOpacity>
          </View>
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
          style={styles.homeBtn}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  container: { flexGrow: 1, padding: SPACING.md, paddingBottom: SPACING.xl },
  loadingText: { color: COLORS.textMuted, fontSize: FONTS.medium },
  finishedTitle: {
    fontSize: FONTS.xxlarge,
    fontWeight: 'bold',
    color: COLORS.accent,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  finishedScore: {
    fontSize: 56,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
  },
  finishedPercent: {
    fontSize: FONTS.xlarge,
    color: COLORS.textMuted,
    marginBottom: SPACING.xl,
    textAlign: 'center',
  },
  btnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.sm,
  },
  tfBtn: {
    flex: 1,
    paddingVertical: SPACING.lg,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: SPACING.xs,
  },
  trueBtn: { backgroundColor: 'rgba(0, 204, 102, 0.25)', borderWidth: 1, borderColor: COLORS.correct },
  falseBtn: { backgroundColor: 'rgba(255, 51, 51, 0.25)', borderWidth: 1, borderColor: COLORS.incorrect },
  btnDisabled: { opacity: 0.4 },
  tfBtnText: { fontSize: FONTS.large, fontWeight: 'bold', color: COLORS.text },
  nextBtn: { marginTop: SPACING.sm },
  homeBtn: { marginTop: SPACING.xs },
  btn: { width: '80%', marginVertical: SPACING.sm },
});
