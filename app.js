// app.js

let score = 0;
let currentMode = '';
let currentQuestionIndex = 0;
let questions = [];

// Initialize: hide quiz page on load
document.getElementById('quiz').classList.add('hidden');

// Page navigation helper
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.add('hidden'));
    document.getElementById(pageId).classList.remove('hidden');
}

// Home page mode buttons
document.querySelectorAll('.mode-btn').forEach(button => {
    button.addEventListener('click', (event) => {
        currentMode = event.currentTarget.dataset.mode;
        startQuiz(currentMode);
    });
});

function startQuiz(mode) {
    score = 0;
    currentQuestionIndex = 0;
    document.getElementById('score').textContent = '0';
    updateProgress(0);
    showPage('quiz');

    const titles = {
        truefalse: 'True or False',
        multichoice: 'Multiple Choice',
        fillblank: 'Fill in the Blank',
        draganddrop: 'Drag & Drop'
    };
    document.getElementById('mode-title').textContent = titles[mode] || mode;

    // Hide all quiz modes, then reveal the selected one
    document.querySelectorAll('.quiz-mode').forEach(el => el.classList.add('hidden'));
    const activeMode = document.getElementById(`${mode}-mode`);
    if (activeMode) activeMode.classList.remove('hidden');

    document.getElementById('new-start-btn').classList.add('hidden');

    switch (mode) {
        case 'truefalse':  loadTrueFalse();       break;
        case 'multichoice': loadMultipleChoice();  break;
        case 'fillblank':  loadFillInTheBlank();   break;
        case 'draganddrop': loadDragAndDrop();     break;
    }
}

// Progress bar
function updateProgress(percent) {
    document.getElementById('progress').style.width = `${percent}%`;
}

// Per-answer result feedback
function showResult(correct) {
    const overlay = document.getElementById('result-overlay');
    const animation = document.getElementById('result-animation');
    const text = document.getElementById('result-text');

    animation.textContent = correct ? '✓' : '✗';
    animation.className = `result-animation ${correct ? 'correct' : 'incorrect'}`;
    text.textContent = correct ? 'Correct!' : 'Incorrect!';

    overlay.classList.remove('hidden');
    setTimeout(() => overlay.classList.add('active'), 10);
    setTimeout(() => {
        overlay.classList.remove('active');
        setTimeout(() => overlay.classList.add('hidden'), 300);
    }, 1000);
}

// ===== TRUE/FALSE MODE =====

function loadTrueFalse() {
    questions = [...quizData.trueFalseQuestions];
    currentQuestionIndex = 0;
    showTrueFalseQuestion();
}

function showTrueFalseQuestion() {
    if (currentQuestionIndex >= questions.length) {
        finishQuiz();
        return;
    }
    const q = questions[currentQuestionIndex];
    document.getElementById('tf-question').textContent = q.question;
    updateProgress((currentQuestionIndex / questions.length) * 100);
}

document.querySelectorAll('.tf-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        if (currentMode !== 'truefalse') return;
        const answer = e.target.dataset.answer === 'true';
        const correct = answer === questions[currentQuestionIndex].answer;
        if (correct) {
            score++;
            document.getElementById('score').textContent = score;
        }
        showResult(correct);
        currentQuestionIndex++;
        setTimeout(() => showTrueFalseQuestion(), 1400);
    });
});

// ===== MULTIPLE CHOICE MODE =====

function loadMultipleChoice() {
    questions = [...quizData.multipleChoiceQuestions];
    currentQuestionIndex = 0;
    showMultipleChoiceQuestion();
}

function showMultipleChoiceQuestion() {
    if (currentQuestionIndex >= questions.length) {
        finishQuiz();
        return;
    }
    const q = questions[currentQuestionIndex];
    document.getElementById('mc-question').textContent = q.question;
    updateProgress((currentQuestionIndex / questions.length) * 100);

    const container = document.getElementById('mc-options');
    container.innerHTML = '';
    q.options.forEach(option => {
        const btn = document.createElement('button');
        btn.className = 'answer-btn mc-btn';
        btn.textContent = option;
        btn.addEventListener('click', () => {
            const correct = option === q.answer;
            if (correct) {
                score++;
                document.getElementById('score').textContent = score;
            }
            showResult(correct);
            currentQuestionIndex++;
            setTimeout(() => showMultipleChoiceQuestion(), 1400);
        });
        container.appendChild(btn);
    });
}

// ===== FILL IN THE BLANK MODE =====

function loadFillInTheBlank() {
    questions = [...quizData.fillInTheBlankQuestions];
    currentQuestionIndex = 0;
    showFillBlankQuestion();
}

function showFillBlankQuestion() {
    if (currentQuestionIndex >= questions.length) {
        finishQuiz();
        return;
    }
    const q = questions[currentQuestionIndex];
    document.getElementById('fb-question').textContent = q.question;
    updateProgress((currentQuestionIndex / questions.length) * 100);
    const input = document.getElementById('fb-input');
    input.value = '';
    input.focus();
}

function handleFillBlankSubmit() {
    if (currentMode !== 'fillblank') return;
    const input = document.getElementById('fb-input');
    const answer = input.value.trim();
    if (!answer) return;

    const correct = answer.toLowerCase() === questions[currentQuestionIndex].answer.toLowerCase();
    if (correct) {
        score++;
        document.getElementById('score').textContent = score;
    }
    showResult(correct);
    currentQuestionIndex++;
    setTimeout(() => showFillBlankQuestion(), 1400);
}

document.getElementById('fb-submit').addEventListener('click', handleFillBlankSubmit);

document.getElementById('fb-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleFillBlankSubmit();
});

// ===== DRAG AND DROP MODE =====

function loadDragAndDrop() {
    questions = [...quizData.dragAndDropItems];
    const categories = [...new Set(questions.map(q => q.category))];

    const itemsContainer = document.getElementById('dd-items');
    const targetsContainer = document.getElementById('dd-targets');
    itemsContainer.innerHTML = '';
    targetsContainer.innerHTML = '';

    document.getElementById('dd-question').textContent = 'Drag each item to its correct category';
    updateProgress(0);

    let placedCount = 0;

    // Create shuffled draggable items
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    shuffled.forEach(q => {
        const div = document.createElement('div');
        div.className = 'drag-item';
        div.draggable = true;
        div.textContent = q.item;
        div.dataset.item = q.item;
        div.dataset.category = q.category;
        div.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('item', q.item);
            e.dataTransfer.setData('category', q.category);
        });
        itemsContainer.appendChild(div);
    });

    // Create drop targets for each category
    categories.forEach(category => {
        const div = document.createElement('div');
        div.className = 'drop-target';
        div.dataset.category = category;
        div.innerHTML = `<div class="target-label">${category}</div>`;

        div.addEventListener('dragover', (e) => {
            e.preventDefault();
            div.classList.add('dragover');
        });
        div.addEventListener('dragleave', () => {
            div.classList.remove('dragover');
        });
        div.addEventListener('drop', (e) => {
            e.preventDefault();
            div.classList.remove('dragover');

            const itemName = e.dataTransfer.getData('item');
            const itemCategory = e.dataTransfer.getData('category');
            const correct = itemCategory === category;

            const draggedEl = itemsContainer.querySelector(`[data-item="${CSS.escape(itemName)}"]`);
            if (!draggedEl) return;

            draggedEl.classList.add(correct ? 'correct-drop' : 'incorrect-drop');
            div.appendChild(draggedEl);

            if (correct) {
                score++;
                document.getElementById('score').textContent = score;
            }
            showResult(correct);
            placedCount++;
            updateProgress((placedCount / questions.length) * 100);

            if (placedCount === questions.length) {
                setTimeout(() => finishQuiz(), 1400);
            }
        });

        targetsContainer.appendChild(div);
    });
}

// ===== FINISH QUIZ =====

function finishQuiz() {
    updateProgress(100);
    document.getElementById('new-start-btn').classList.remove('hidden');

    const overlay = document.getElementById('result-overlay');
    const animation = document.getElementById('result-animation');
    const text = document.getElementById('result-text');

    animation.textContent = '🎉';
    animation.className = 'result-animation';
    text.textContent = `Quiz Complete! Score: ${score}/${questions.length}`;

    overlay.classList.remove('hidden');
    setTimeout(() => overlay.classList.add('active'), 10);
    setTimeout(() => {
        overlay.classList.remove('active');
        setTimeout(() => overlay.classList.add('hidden'), 300);
    }, 2500);
}

// New Start button returns to home
document.getElementById('new-start-btn').addEventListener('click', () => {
    showPage('home');
});
