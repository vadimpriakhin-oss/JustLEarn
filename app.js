// JavaScript Quiz App

// Dark background color
const backgroundColor = '#0a0a0a';

// Terms Screen
function displayTerms() {
    const terms = `Terms and Conditions\n...`; // Add your terms here
    alert(terms);
}

// Quiz Modes
const quizModes = [
    'General Knowledge',
    'Science',
    'History',
    'Mathematics',
];

function startQuiz(mode) {
    console.log(`Starting quiz in mode: ${mode}`);
    // Quiz logic goes here
}

// Event Listener for Quiz Mode Selection
quizModes.forEach(mode => {
    document.getElementById('quiz-button').addEventListener('click', () => startQuiz(mode));
});

document.body.style.backgroundColor = backgroundColor;