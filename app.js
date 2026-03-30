// App State Management
let appState = {
    currentQuizMode: null,
    score: 0,
    currentQuestionIndex: 0,
    terms: [],
    userAnswers: [],
};

// Quiz Modes
const QuizModes = {
    TRUE_FALSE: 'true-false',
    MULTIPLE_CHOICE: 'multiple-choice',
    FILL_BLANK: 'fill-blank',
    DRAG_DROP: 'drag-drop',
};

// Default Demo Terms
const defaultTerms = [
    { term: 'JavaScript', definition: 'A programming language used for web development.' },
    { term: 'HTML', definition: 'The standard markup language for creating web pages.' },
    { term: 'CSS', definition: 'A stylesheet language used for describing the presentation of a document.' },
];

// Function to initialize terms from localStorage or use defaults
function initializeTerms() {
    const storedTerms = localStorage.getItem('terms');
    appState.terms = storedTerms ? JSON.parse(storedTerms) : defaultTerms;
}

// Utility Functions
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function validateAnswer(question, answer) {
    return question.correctAnswer === answer;
}

// Term Creation Logic
function createTerm(term, definition) {
    const newTerm = { term, definition };
    appState.terms.push(newTerm);
    localStorage.setItem('terms', JSON.stringify(appState.terms));
}

// Initialize the quiz
initializeTerms();
