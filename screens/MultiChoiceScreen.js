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
import QuestionCard from '../components/QuestionCard';
import NavigationButton from '../components/NavigationButton';
import { getAllQuestions, shuffleArray } from '../utils/quizData';
import { getCustomTerms } from '../utils/storageService';
import { COLORS, FONTS, SPACING } from '../utils/styles';

export default function MultiChoiceScreen({ navigation }) {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [selected, setSelected] = useState(null);
  const [finished, setFinished] = useState(false);

  const loadQuestions = useCallback(async () => {
    const customTerms = await getCustomTerms();
    const allQ = getAllQuestions(customTerms);
    setQuestions(shuffleArray(allQ.multiChoice).slice(0, 10));
  }, []);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  const handleAnswer = (option) => {
    if (answered) return;
    const current = questions[currentIndex];
    const isCorrect = option === current.answer;
    setSelected(option);
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
      setSelected(null);
    }
  };

  const getOptionStyle = (option) => {
    if (!answered) return styles.option;
    const current = questions[currentIndex];
    if (option === current.answer) return [styles.option, styles.optionCorrect];
    if (option === selected) return [styles.option, styles.optionIncorrect];
    return [styles.option, styles.optionDim];
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
              setSelected(null);
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
        title="Multiple Choice"
      />
      <ScrollView contentContainerStyle={styles.container}>
        <QuestionCard question={current.question} feedback={feedback}>
          {current.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={getOptionStyle(option)}
              onPress={() => handleAnswer(option)}
              disabled={answered}
              activeOpacity={0.8}
            >
              <Text style={styles.optionLabel}>{String.fromCharCode(65 + index)}.</Text>
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.lg },
  container: { flexGrow: 1, padding: SPACING.md, paddingBottom: SPACING.xl },
  loadingText: { color: COLORS.textMuted, fontSize: FONTS.medium },
  finishedTitle: { fontSize: FONTS.xxlarge, fontWeight: 'bold', color: COLORS.accent, marginBottom: SPACING.md, textAlign: 'center' },
  finishedScore: { fontSize: 56, fontWeight: 'bold', color: COLORS.text, textAlign: 'center' },
  finishedPercent: { fontSize: FONTS.xlarge, color: COLORS.textMuted, marginBottom: SPACING.xl, textAlign: 'center' },
  btn: { width: '80%', marginVertical: SPACING.sm },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 255, 204, 0.05)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    marginVertical: SPACING.xs,
  },
  optionCorrect: {
    backgroundColor: 'rgba(0, 204, 102, 0.2)',
    borderColor: COLORS.correct,
  },
  optionIncorrect: {
    backgroundColor: 'rgba(255, 51, 51, 0.2)',
    borderColor: COLORS.incorrect,
  },
  optionDim: { opacity: 0.4 },
  optionLabel: {
    fontSize: FONTS.medium,
    fontWeight: 'bold',
    color: COLORS.accent,
    marginRight: SPACING.sm,
    minWidth: 24,
  },
  optionText: { fontSize: FONTS.medium, color: COLORS.text, flex: 1 },
  nextBtn: { marginTop: SPACING.sm, marginBottom: SPACING.xs },
});
