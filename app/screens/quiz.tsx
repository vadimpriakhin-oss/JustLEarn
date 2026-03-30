import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Navigation from '@/components/Navigation';

const quizData = {
  questions: [
    {
      question: 'What is the capital of France?',
      options: ['Berlin', 'Madrid', 'Paris', 'Lisbon'],
      answer: 'Paris',
    },
    {
      question: 'What is 2 + 2?',
      options: ['3', '4', '5', '6'],
      answer: '4',
    },
  ],
};

export default function QuizScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = quizData.questions[currentIndex];

  const handleAnswer = (option: string) => {
    if (selected) return;
    setSelected(option);
    if (option === question.answer) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < quizData.questions.length) {
      setCurrentIndex((i) => i + 1);
      setSelected(null);
    } else {
      setFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  };

  if (finished) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Quiz Complete! 🎉</Text>
        <Text style={styles.score}>
          Score: {score} / {quizData.questions.length}
        </Text>
        <TouchableOpacity style={styles.button} onPress={handleRestart}>
          <Text style={styles.buttonText}>Restart</Text>
        </TouchableOpacity>
        <Navigation />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.progress}>
        Question {currentIndex + 1} of {quizData.questions.length}
      </Text>
      <View style={styles.card}>
        <Text style={styles.question}>{question.question}</Text>
        <ScrollView>
          {question.options.map((option) => {
            let optionStyle = styles.option;
            if (selected) {
              if (option === question.answer) {
                optionStyle = styles.optionCorrect;
              } else if (option === selected) {
                optionStyle = styles.optionWrong;
              }
            }
            return (
              <TouchableOpacity
                key={option}
                style={optionStyle}
                onPress={() => handleAnswer(option)}
              >
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        {selected && (
          <TouchableOpacity style={styles.button} onPress={handleNext}>
            <Text style={styles.buttonText}>
              {currentIndex + 1 < quizData.questions.length ? 'Next' : 'Finish'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
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
    marginBottom: 16,
  },
  score: {
    fontSize: 22,
    color: '#f0f0f0',
    textAlign: 'center',
    marginBottom: 32,
  },
  progress: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 16,
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
  question: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f0f0f0',
    marginBottom: 20,
    textAlign: 'center',
  },
  option: {
    backgroundColor: 'rgba(60, 60, 60, 0.9)',
    borderRadius: 8,
    padding: 14,
    marginBottom: 10,
  },
  optionCorrect: {
    backgroundColor: 'rgba(0, 200, 100, 0.4)',
    borderRadius: 8,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#00c864',
  },
  optionWrong: {
    backgroundColor: 'rgba(255, 60, 60, 0.4)',
    borderRadius: 8,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ff3c3c',
  },
  optionText: {
    color: '#f0f0f0',
    fontSize: 16,
    textAlign: 'center',
  },
  button: {
    marginTop: 16,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#ff007f',
    borderRadius: 5,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ff007f',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
