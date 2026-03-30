import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTerms } from '../context/TermsContext';
import TrueFalseQuestion from '../components/TrueFalseQuestion';
import MultiChoiceQuestion from '../components/MultiChoiceQuestion';
import FillBlankQuestion from '../components/FillBlankQuestion';
import DragDropQuestion from '../components/DragDropQuestion';
import { colors, commonStyles } from '../styles/common';

const MODE_TITLES = {
  truefalse: 'True or False',
  multichoice: 'Multiple Choice',
  fillblank: 'Fill in the Blank',
  dragdrop: 'Match Terms',
};

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildTrueFalseQuestions(terms) {
  return terms.map((t) => {
    const useCorrect = Math.random() > 0.5;
    let statement;
    let correctAnswer;
    if (useCorrect) {
      statement = `"${t.term}" means: ${t.answer}`;
      correctAnswer = true;
    } else {
      const other = shuffle(terms.filter((x) => x.id !== t.id))[0];
      statement = other
        ? `"${t.term}" means: ${other.answer}`
        : `"${t.term}" is a proper noun`;
      correctAnswer = false;
    }
    return { id: t.id, question: statement, correctAnswer };
  });
}

function buildMultiChoiceQuestions(terms) {
  if (terms.length < 4) return [];
  return terms.map((t) => {
    const others = shuffle(terms.filter((x) => x.id !== t.id)).slice(0, 3);
    const options = shuffle([t.answer, ...others.map((o) => o.answer)]);
    return {
      id: t.id,
      question: `What is the meaning of "${t.term}"?`,
      options,
      answer: t.answer,
    };
  });
}

function buildFillBlankQuestions(terms) {
  return terms.map((t) => ({
    id: t.id,
    question: `What is the meaning of "${t.term}"?`,
    answer: t.answer,
  }));
}

function buildDragDropQuestions(terms) {
  const chunks = [];
  const shuffled = shuffle(terms);
  for (let i = 0; i < shuffled.length; i += 4) {
    const group = shuffled.slice(i, i + 4);
    if (group.length >= 2) {
      chunks.push({
        id: `dd-${i}`,
        question: 'Match each term to its definition:',
        pairs: group.map((t) => ({ term: t.term, definition: t.answer })),
      });
    }
  }
  return chunks;
}

export default function QuizScreen({ route, navigation }) {
  const { mode } = route.params;
  const { terms } = useTerms();

  const questions = useMemo(() => {
    if (mode === 'truefalse') return shuffle(buildTrueFalseQuestions(terms));
    if (mode === 'multichoice') return shuffle(buildMultiChoiceQuestions(terms));
    if (mode === 'fillblank') return shuffle(buildFillBlankQuestions(terms));
    if (mode === 'dragdrop') return buildDragDropQuestions(terms);
    return [];
  }, [mode, terms]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [finished, setFinished] = useState(false);

  if (!questions.length) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <View style={styles.center}>
          <Text style={commonStyles.heading}>Not enough terms</Text>
          <Text style={styles.emptyText}>
            {mode === 'multichoice'
              ? 'You need at least 4 terms for Multiple Choice mode.'
              : 'Add some custom terms to start quizzing!'}
          </Text>
          <TouchableOpacity
            style={commonStyles.primaryButton}
            onPress={() => navigation.navigate('AddTerm')}
          >
            <Text style={commonStyles.primaryButtonText}>Add Terms</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={commonStyles.secondaryButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={commonStyles.secondaryButtonText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (finished) {
    const total = questions.length;
    const pct = Math.round((score / total) * 100);
    return (
      <SafeAreaView style={commonStyles.container}>
        <ScrollView contentContainerStyle={[commonStyles.scrollContent, styles.center]}>
          <Text style={styles.finishedEmoji}>{pct >= 70 ? '🎉' : '📚'}</Text>
          <Text style={commonStyles.heading}>Quiz Complete!</Text>
          <View style={styles.scoreCard}>
            <Text style={styles.scoreText}>{score} / {total}</Text>
            <Text style={styles.percentText}>{pct}%</Text>
            <Text style={styles.scoreLabel}>
              {pct >= 90 ? 'Excellent!' : pct >= 70 ? 'Good job!' : 'Keep practicing!'}
            </Text>
          </View>
          <TouchableOpacity
            style={commonStyles.primaryButton}
            onPress={() => {
              setCurrentIndex(0);
              setScore(0);
              setAnswered(false);
              setFinished(false);
            }}
          >
            <Text style={commonStyles.primaryButtonText}>Try Again</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={commonStyles.secondaryButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={commonStyles.secondaryButtonText}>Back to Home</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const currentItem = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  function handleAnswer(isCorrect) {
    if (isCorrect) setScore((s) => s + 1);
    setAnswered(true);
  }

  function handleNext() {
    if (currentIndex + 1 >= questions.length) {
      setFinished(true);
    } else {
      setCurrentIndex((i) => i + 1);
      setAnswered(false);
    }
  }

  return (
    <SafeAreaView style={commonStyles.container}>
      <ScrollView contentContainerStyle={commonStyles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.modeTitle}>{MODE_TITLES[mode]}</Text>
          <Text style={styles.scoreBadge}>Score: {score}</Text>
        </View>

        <View style={styles.progressBarOuter}>
          <View style={[styles.progressBarInner, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressLabel}>
          {currentIndex + 1} / {questions.length}
        </Text>

        <View style={commonStyles.card}>
          {mode === 'truefalse' && (
            <TrueFalseQuestion item={currentItem} onAnswer={handleAnswer} answered={answered} />
          )}
          {mode === 'multichoice' && (
            <MultiChoiceQuestion item={currentItem} onAnswer={handleAnswer} answered={answered} />
          )}
          {mode === 'fillblank' && (
            <FillBlankQuestion item={currentItem} onAnswer={handleAnswer} answered={answered} />
          )}
          {mode === 'dragdrop' && (
            <DragDropQuestion item={currentItem} onAnswer={handleAnswer} answered={answered} />
          )}
        </View>

        {answered && (
          <TouchableOpacity style={commonStyles.primaryButton} onPress={handleNext}>
            <Text style={commonStyles.primaryButtonText}>
              {currentIndex + 1 >= questions.length ? 'See Results' : 'Next Question'}
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={commonStyles.secondaryButton} onPress={() => navigation.goBack()}>
          <Text style={commonStyles.secondaryButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.neon,
  },
  scoreBadge: {
    color: colors.text,
    fontSize: 15,
    backgroundColor: colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  progressBarOuter: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 3,
    marginBottom: 4,
    overflow: 'hidden',
  },
  progressBarInner: {
    height: '100%',
    backgroundColor: colors.neon,
    borderRadius: 3,
  },
  progressLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    textAlign: 'right',
    marginBottom: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: colors.textSecondary,
    textAlign: 'center',
    fontSize: 15,
    marginBottom: 20,
    lineHeight: 22,
  },
  finishedEmoji: {
    fontSize: 64,
    textAlign: 'center',
    marginBottom: 16,
  },
  scoreCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    marginVertical: 20,
    borderWidth: 1,
    borderColor: colors.border,
    width: '100%',
  },
  scoreText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.neon,
  },
  percentText: {
    fontSize: 28,
    color: colors.text,
    marginTop: 4,
  },
  scoreLabel: {
    fontSize: 18,
    color: colors.textSecondary,
    marginTop: 8,
  },
});
