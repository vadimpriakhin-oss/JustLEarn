// app.js

// Variables to track scores and current mode
let score = 0;
let currentMode = 'True/False';

// Event listeners for quiz type buttons
document.querySelectorAll('.quiz-type').forEach(button => {
    button.addEventListener('click', (event) => {
        currentMode = event.target.dataset.mode;
        switchMode(currentMode);
    });
});

// Function to switch quiz mode
function switchMode(mode) {
    // Hide all quiz sections
    const sections = document.querySelectorAll('.quiz-section');
    sections.forEach(section => section.style.display = 'none');

    // Show the selected section
    const activeSection = document.querySelector(`.${mode.replace(/ /g, '-').toLowerCase()}`);
    if (activeSection) {
        activeSection.style.display = 'block';
    }
}

// Function to handle scoring
function handleScore(correct) {
    if (correct) {
        score += 1;
    }
}

// Example functions for handling each quiz type
function handleTrueFalse(answer) {
    const correctAnswer = true; // Replace with actual logic
    handleScore(answer === correctAnswer);
}

function handleMultipleChoice(selected) {
    const correctAnswer = 'option1'; // Replace with actual logic
    handleScore(selected === correctAnswer);
}

function handleFillInTheBlank(answer) {
    const correctAnswer = 'fill in correct answer'; // Replace with actual logic
    handleScore(answer === correctAnswer);
}

function handleDragAndDrop(draggedItem, target) {
    const correctItem = 'expectedItem'; // Replace with actual logic
    handleScore(draggedItem === correctItem);
}

// Function to finalize score
function finalizeScore() {
    console.log(`Your score is: ${score}`);
    // Optionally reset score
    score = 0;
}