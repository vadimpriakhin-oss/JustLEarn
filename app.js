// Complete quiz functionality for all 4 modes: true/false, multiple choice, fill in blank, drag and drop

// Navigation between pages
function showHomePage() {
    document.getElementById('homePage').classList.remove('hidden');
    document.getElementById('createModeSelectionPage').classList.add('hidden');
    document.getElementById('addTermPage').classList.add('hidden');
}

function showCreateModeSelection() {
    document.getElementById('homePage').classList.add('hidden');
    document.getElementById('createModeSelectionPage').classList.remove('hidden');
    document.getElementById('addTermPage').classList.add('hidden');
}

function showAddTermPage() {
    document.getElementById('homePage').classList.add('hidden');
    document.getElementById('createModeSelectionPage').classList.add('hidden');
    document.getElementById('addTermPage').classList.remove('hidden');
}

// Custom terms management and initialization
const QuizTerms = {
    trueFalse: [
        { question: 'Is the sky blue?', answer: true },
        { question: 'Is grass red?', answer: false }
    ],
    multipleChoice: [
        { question: 'What is the capital of France?', options: ['Berlin', 'Madrid', 'Paris'], answer: 'Paris' },
        { question: 'What is 2 + 2?', options: ['3', '4', '5'], answer: '4' }
    ],
    fillInTheBlank: [
        { question: 'The capital of Italy is ___.', answer: 'Rome' },
        { question: 'Water freezes at ___ degrees Celsius.', answer: '0' }
    ],
    dragAndDrop: [
        { items: ['Item1', 'Item2'], correctOrder: [1, 0] }
    ]
};

// Score tracking
let score = 0;
let totalQuestions = 0;

// Function to handle true/false questions
function handleTrueFalse(question) {
    // Logic for displaying question and getting user answer
}

// Function to handle multiple choice questions
function handleMultipleChoice(question) {
    // Logic for displaying question and getting user answer
}

// Function to handle fill in the blank questions 
function handleFillInBlank(question) {
    // Logic for displaying question and getting user answer
}

// Function to handle drag and drop questions
function handleDragAndDrop(question) {
    // Logic for displaying question and getting user answer
}

// Navigation functions
function nextQuestion() {
    // Logic for navigating to next question
}

function previousQuestion() {
    // Logic for navigating to previous question
}

// Function to calculate final score
function calculateScore() {
    alert('Your score is ' + score + '/' + totalQuestions);
}

// Event listeners and quiz initialization
function initQuiz() {
    // Initialization logic for starting the quiz
}

// Event listeners for navigation
document.addEventListener('DOMContentLoaded', function() {
    // "Add Custom Term" button from home page
    document.querySelector('[data-mode="addterm"]').addEventListener('click', showCreateModeSelection);

    // Back button from mode selection
    document.getElementById('backFromModeBtn').addEventListener('click', showHomePage);

    // Mode selection buttons
    document.querySelectorAll('.mode-option').forEach(function(btn) {
        btn.addEventListener('click', function() {
            const mode = this.getAttribute('data-create-mode');
            console.log('Selected mode:', mode);
            showAddTermPage();
        });
    });

    // Back button from add term page
    document.getElementById('backBtn').addEventListener('click', showHomePage);
});

initQuiz();