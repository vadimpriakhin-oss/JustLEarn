// app.js

// Global state
let score = 0;
let currentMode = '';
let currentQuestionIndex = 0;
let questions = [];
let totalQuestions = 0;

// --- Page navigation ---
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
}

// --- Show quiz mode section ---
function showQuizMode(mode) {
    document.querySelectorAll('.quiz-mode').forEach(m => m.classList.add('hidden'));
    document.getElementById(mode + '-mode').classList.remove('hidden');
}

// --- Mode button click handlers ---
document.querySelectorAll('.mode-btn').forEach(button => {
    button.addEventListener('click', (event) => {
        currentMode = event.currentTarget.dataset.mode;
        startQuiz(currentMode);
    });
});

// --- Start quiz ---
function startQuiz(mode) {
    score = 0;
    currentQuestionIndex = 0;
    document.getElementById('score').textContent = '0';

    const titles = {
        truefalse: 'True or False',
        multichoice: 'Multiple Choice',
        fillblank: 'Fill in the Blank',
        draganddrop: 'Drag & Drop'
    };
    document.getElementById('mode-title').textContent = titles[mode] || mode;

    if (mode === 'truefalse') {
        questions = quizData.trueFalseQuestions;
    } else if (mode === 'multichoice') {
        questions = quizData.multipleChoiceQuestions;
    } else if (mode === 'fillblank') {
        questions = quizData.fillInTheBlankQuestions;
    } else if (mode === 'draganddrop') {
        questions = quizData.dragAndDropItems;
    }

    totalQuestions = questions.length;

    document.getElementById('new-start-btn').classList.add('hidden');
    hideResultOverlay();
    showPage('quiz');
    showQuizMode(mode);
    loadQuestion();
}

// --- Load current question ---
function loadQuestion() {
    if (currentMode !== 'draganddrop' && currentQuestionIndex >= totalQuestions) {
        showFinalResult();
        return;
    }

    updateProgress();

    if (currentMode === 'truefalse') {
        loadTrueFalseQuestion();
    } else if (currentMode === 'multichoice') {
        loadMultipleChoiceQuestion();
    } else if (currentMode === 'fillblank') {
        loadFillBlankQuestion();
    } else if (currentMode === 'draganddrop') {
        loadDragDropQuestion();
    }
}

// --- Progress bar ---
function updateProgress() {
    const pct = totalQuestions > 0 ? (currentQuestionIndex / totalQuestions) * 100 : 0;
    document.getElementById('progress').style.width = pct + '%';
}

// ============================================================
// True / False
// ============================================================
function loadTrueFalseQuestion() {
    const q = questions[currentQuestionIndex];
    document.getElementById('tf-question').textContent = q.question;
    document.querySelectorAll('.tf-btn').forEach(btn => {
        btn.disabled = false;
        btn.classList.remove('correct', 'incorrect');
    });
}

document.querySelectorAll('.tf-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const answer = e.currentTarget.dataset.answer === 'true';
        const correct = answer === questions[currentQuestionIndex].answer;

        if (correct) {
            score++;
            document.getElementById('score').textContent = score;
            e.currentTarget.classList.add('correct');
        } else {
            e.currentTarget.classList.add('incorrect');
            document.querySelectorAll('.tf-btn').forEach(b => {
                if (b.dataset.answer === String(questions[currentQuestionIndex].answer)) {
                    b.classList.add('correct');
                }
            });
        }

        document.querySelectorAll('.tf-btn').forEach(b => (b.disabled = true));
        showResultOverlay(correct);

        setTimeout(() => {
            hideResultOverlay();
            currentQuestionIndex++;
            loadQuestion();
        }, 1200);
    });
});

// ============================================================
// Multiple Choice
// ============================================================
function loadMultipleChoiceQuestion() {
    const q = questions[currentQuestionIndex];
    document.getElementById('mc-question').textContent = q.question;

    const container = document.getElementById('mc-options');
    container.innerHTML = '';

    q.options.forEach(option => {
        const btn = document.createElement('button');
        btn.className = 'answer-btn mc-btn';
        btn.textContent = option;
        btn.addEventListener('click', () => handleMultipleChoiceAnswer(option, btn, container));
        container.appendChild(btn);
    });
}

function handleMultipleChoiceAnswer(selected, btn, container) {
    const correct = selected === questions[currentQuestionIndex].answer;

    container.querySelectorAll('.mc-btn').forEach(b => (b.disabled = true));

    if (correct) {
        score++;
        document.getElementById('score').textContent = score;
        btn.classList.add('correct');
    } else {
        btn.classList.add('incorrect');
        container.querySelectorAll('.mc-btn').forEach(b => {
            if (b.textContent === questions[currentQuestionIndex].answer) {
                b.classList.add('correct');
            }
        });
    }

    showResultOverlay(correct);

    setTimeout(() => {
        hideResultOverlay();
        currentQuestionIndex++;
        loadQuestion();
    }, 1200);
}

// ============================================================
// Fill in the Blank
// ============================================================
function loadFillBlankQuestion() {
    const q = questions[currentQuestionIndex];
    document.getElementById('fb-question').textContent = q.question;
    const input = document.getElementById('fb-input');
    input.value = '';
    input.disabled = false;
    input.classList.remove('correct', 'incorrect');
    document.getElementById('fb-submit').disabled = false;
}

document.getElementById('fb-submit').addEventListener('click', () => {
    const input = document.getElementById('fb-input');
    const answer = input.value.trim();
    if (!answer) return;

    const correct = answer.toLowerCase() === questions[currentQuestionIndex].answer.toLowerCase();

    input.disabled = true;
    document.getElementById('fb-submit').disabled = true;

    if (correct) {
        score++;
        document.getElementById('score').textContent = score;
        input.classList.add('correct');
    } else {
        input.classList.add('incorrect');
    }

    showResultOverlay(correct);

    setTimeout(() => {
        hideResultOverlay();
        input.classList.remove('correct', 'incorrect');
        currentQuestionIndex++;
        loadQuestion();
    }, 1200);
});

document.getElementById('fb-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        document.getElementById('fb-submit').click();
    }
});

// ============================================================
// Drag & Drop
// ============================================================
let draggedEl = null;

function loadDragDropQuestion() {
    const ddItems = document.getElementById('dd-items');
    const ddTargets = document.getElementById('dd-targets');

    document.getElementById('dd-question').textContent = 'Drag each item to its correct category:';

    ddItems.innerHTML = '';
    ddTargets.innerHTML = '';

    const categories = [...new Set(questions.map(q => q.category))];

    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    shuffled.forEach(q => {
        const item = document.createElement('div');
        item.className = 'drag-item';
        item.textContent = q.item;
        item.draggable = true;
        item.dataset.itemCategory = q.category;

        item.addEventListener('dragstart', () => {
            draggedEl = item;
            item.classList.add('dragging');
        });
        item.addEventListener('dragend', () => {
            draggedEl = null;
            item.classList.remove('dragging');
        });

        ddItems.appendChild(item);
    });

    categories.forEach(cat => {
        const target = document.createElement('div');
        target.className = 'drop-target';
        target.dataset.category = cat;
        target.innerHTML = `<div class="drop-label">${cat}</div><div class="drop-zone"></div>`;

        const dropZone = target.querySelector('.drop-zone');

        target.addEventListener('dragover', (e) => {
            e.preventDefault();
            target.classList.add('drag-over');
        });
        target.addEventListener('dragleave', () => target.classList.remove('drag-over'));
        target.addEventListener('drop', (e) => {
            e.preventDefault();
            target.classList.remove('drag-over');

            if (!draggedEl) return;

            const itemCategory = draggedEl.dataset.itemCategory;
            const correct = itemCategory === cat;

            draggedEl.classList.remove('dragging');
            draggedEl.classList.add(correct ? 'correct' : 'incorrect');
            draggedEl.draggable = false;
            dropZone.appendChild(draggedEl);

            if (correct) {
                score++;
                document.getElementById('score').textContent = score;
            }

            draggedEl = null;

            const remaining = ddItems.querySelectorAll('.drag-item').length;
            if (remaining === 0) {
                setTimeout(() => showFinalResult(), 800);
            }
        });

        ddTargets.appendChild(target);
    });
}

// ============================================================
// Result Overlay
// ============================================================
function showResultOverlay(correct) {
    const overlay = document.getElementById('result-overlay');
    const animation = document.getElementById('result-animation');
    const text = document.getElementById('result-text');

    animation.className = 'result-animation ' + (correct ? 'correct' : 'incorrect');
    animation.textContent = correct ? '✓' : '✗';
    text.textContent = correct ? 'Correct!' : 'Incorrect!';

    overlay.classList.remove('hidden');
}

function hideResultOverlay() {
    document.getElementById('result-overlay').classList.add('hidden');
}

// --- Final Result ---
function showFinalResult() {
    document.getElementById('progress').style.width = '100%';

    const overlay = document.getElementById('result-overlay');
    const animation = document.getElementById('result-animation');
    const text = document.getElementById('result-text');

    animation.className = 'result-animation trophy';
    animation.textContent = '🏆';
    text.textContent = `Quiz complete! Score: ${score}/${totalQuestions}`;

    overlay.classList.remove('hidden');
    document.getElementById('new-start-btn').classList.remove('hidden');
}

// --- New Start ---
document.getElementById('new-start-btn').addEventListener('click', () => {
    hideResultOverlay();
    showPage('home');
});