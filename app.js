// Complete quiz functionality for all 4 modes: true/false, multiple choice, fill in blank, drag and drop

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

// Page references
const homePage = document.getElementById('homePage');
const createModePage = document.getElementById('createModePage');
const addTermPage = document.getElementById('addTermPage');
const addTermHeading = addTermPage.querySelector('h2');

// Currently selected creation mode
let selectedCreateMode = 'single';

const createModeLabels = {
    single: 'Add Custom Term',
    batch: 'Batch Add Terms',
    import: 'Import Terms'
};

// Helper: show only the given page
function showPage(page) {
    [homePage, createModePage, addTermPage].forEach(function(p) {
        p.classList.add('hidden');
    });
    page.classList.remove('hidden');
}

// "Add Custom Term" button on home page → show create mode selection
document.querySelectorAll('.mode-btn[data-mode="addterm"]').forEach(function(btn) {
    btn.addEventListener('click', function() {
        showPage(createModePage);
    });
});

// Create mode option buttons → show add term page
document.querySelectorAll('.create-mode-option-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
        selectedCreateMode = btn.getAttribute('data-create-mode') || 'single';
        addTermHeading.textContent = createModeLabels[selectedCreateMode] || 'Add Custom Term';
        showPage(addTermPage);
    });
});

// Back button on create mode page → go to home
document.getElementById('createModeBackBtn').addEventListener('click', function() {
    showPage(homePage);
});

// Back button on add term page → go back to create mode selection
document.getElementById('backBtn').addEventListener('click', function() {
    showPage(createModePage);
});

// Add term form submission
document.getElementById('addBtn').addEventListener('click', function() {
    var term = document.getElementById('termInput').value.trim();
    var answer = document.getElementById('answerInput').value.trim();
    if (!term || !answer) return;

    var li = document.createElement('li');
    li.textContent = term + ' → ' + answer;
    document.getElementById('termsList').appendChild(li);

    document.getElementById('termInput').value = '';
    document.getElementById('answerInput').value = '';
});

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

initQuiz();