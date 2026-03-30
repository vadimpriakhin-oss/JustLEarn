export const trueFalseQuestions = [
  { id: 1, statement: 'The capital of France is Paris.', answer: true },
  { id: 2, statement: 'The Earth orbits the Moon.', answer: false },
  { id: 3, statement: 'Water boils at 100°C at sea level.', answer: true },
  { id: 4, statement: 'The Great Wall of China is visible from space.', answer: false },
  { id: 5, statement: 'Humans have 206 bones in the adult body.', answer: true },
  { id: 6, statement: 'Light travels faster than sound.', answer: true },
  { id: 7, statement: 'Diamonds are made of carbon.', answer: true },
  { id: 8, statement: 'Mount Everest is the tallest mountain in the world.', answer: true },
  { id: 9, statement: 'Bats are blind.', answer: false },
  { id: 10, statement: 'The Amazon River is in Africa.', answer: false },
];

export const multiChoiceQuestions = [
  {
    id: 1,
    question: 'What is the capital of France?',
    options: ['Berlin', 'Madrid', 'Paris', 'Lisbon'],
    answer: 'Paris',
  },
  {
    id: 2,
    question: 'What is 2 + 2?',
    options: ['3', '4', '5', '6'],
    answer: '4',
  },
  {
    id: 3,
    question: 'Which planet is closest to the Sun?',
    options: ['Venus', 'Earth', 'Mars', 'Mercury'],
    answer: 'Mercury',
  },
  {
    id: 4,
    question: 'Who painted the Mona Lisa?',
    options: ['Michelangelo', 'Leonardo da Vinci', 'Raphael', 'Donatello'],
    answer: 'Leonardo da Vinci',
  },
  {
    id: 5,
    question: 'What is the chemical symbol for water?',
    options: ['O2', 'CO2', 'H2O', 'HO'],
    answer: 'H2O',
  },
  {
    id: 6,
    question: 'How many continents are there on Earth?',
    options: ['5', '6', '7', '8'],
    answer: '7',
  },
  {
    id: 7,
    question: 'What is the largest ocean on Earth?',
    options: ['Atlantic', 'Indian', 'Arctic', 'Pacific'],
    answer: 'Pacific',
  },
  {
    id: 8,
    question: 'In which year did World War II end?',
    options: ['1943', '1944', '1945', '1946'],
    answer: '1945',
  },
];

export const fillBlankQuestions = [
  { id: 1, question: 'The capital of Japan is _____.', answer: 'Tokyo' },
  { id: 2, question: 'The chemical symbol for gold is _____.', answer: 'Au' },
  { id: 3, question: 'The speed of light is approximately _____ km/s.', answer: '300000' },
  { id: 4, question: 'The largest planet in our solar system is _____.', answer: 'Jupiter' },
  { id: 5, question: 'The author of "Romeo and Juliet" is _____.', answer: 'Shakespeare' },
  { id: 6, question: 'The square root of 144 is _____.', answer: '12' },
  { id: 7, question: 'The currency of the United Kingdom is the _____.', answer: 'Pound' },
  { id: 8, question: 'The process by which plants make food using sunlight is called _____.', answer: 'Photosynthesis' },
];

export const dragDropPairs = [
  { id: 1, term: 'Paris', definition: 'Capital of France' },
  { id: 2, term: 'Oxygen', definition: 'Chemical symbol: O' },
  { id: 3, term: 'Jupiter', definition: 'Largest planet' },
  { id: 4, term: 'Nile', definition: 'Longest river in Africa' },
  { id: 5, term: 'Python', definition: 'Programming language' },
  { id: 6, term: 'Einstein', definition: 'Theory of Relativity' },
  { id: 7, term: 'DNA', definition: 'Carries genetic information' },
  { id: 8, term: 'Sahara', definition: 'Largest hot desert' },
];

export const getAllQuestions = (customTerms = []) => {
  const customTrueFalse = customTerms.map((term, index) => {
    const useWrong = index % 2 === 1 && customTerms.length > 1;
    const otherTerm = customTerms.find((t) => t.term !== term.term);
    if (useWrong && otherTerm) {
      return {
        id: 100 + index,
        statement: `"${otherTerm.answer}" is the correct answer for "${term.term}".`,
        answer: false,
      };
    }
    return {
      id: 100 + index,
      statement: `"${term.answer}" is the correct answer for "${term.term}".`,
      answer: true,
    };
  });

  const customMultiChoice = customTerms.map((term, index) => {
    const wrongAnswers = customTerms
      .filter((t) => t.term !== term.term)
      .slice(0, 3)
      .map((t) => t.answer);
    const placeholders = ['None of the above', 'All of the above', 'Not applicable'];
    let i = 0;
    while (wrongAnswers.length < 3) {
      wrongAnswers.push(placeholders[i++ % placeholders.length] + (i > 3 ? ` (${i})` : ''));
    }
    const options = shuffleArray([term.answer, ...wrongAnswers]);
    return {
      id: 100 + index,
      question: `What is the answer for "${term.term}"?`,
      options,
      answer: term.answer,
    };
  });

  const customFillBlank = customTerms.map((term, index) => ({
    id: 100 + index,
    question: `${term.term}: _____`,
    answer: term.answer,
  }));

  const customDragDrop = customTerms.map((term, index) => ({
    id: 100 + index,
    term: term.term,
    definition: term.answer,
  }));

  return {
    trueFalse: [...trueFalseQuestions, ...customTrueFalse],
    multiChoice: [...multiChoiceQuestions, ...customMultiChoice],
    fillBlank: [...fillBlankQuestions, ...customFillBlank],
    dragDrop: [...dragDropPairs, ...customDragDrop],
  };
};

export function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
