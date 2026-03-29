// app.js

let score = 0;
let currentQuestionIndex = 0;
let currentMode = '';
let currentQuestions = [];

const pages = {
    home: document.getElementById('home'),
    quiz: document.getElementById('quiz')
};

const modes = {
    truefalse: document.getElementById('truefalse-mode'),
    multichoice: document.getElementById('multichoice-mode'),
    fillblank: document.getElementById('fillblank-mode'),
    draganddrop: document.getElementById('draganddrop-mode')
};

const scoreEl = document.getElementById('score');
const modeTitleEl = document.getElementById('mode-title');
const progressEl = document.getElementById('progress');
const resultOverlay = document.getElementById('result-overlay');
const resultAnimation = document.getElementById('result-animation');
const resultText = document.getElementById('result-text');
const newStartBtn = document.getElementById('new-start-btn');

/** Navigate to a page by id */
function showPage(pageId) {
    Object.values(pages).forEach(p => p.classList.remove('active'));
    pages[pageId].classList.add('active');
}

/** Show only the quiz mode matching the given mode key */
function showMode(modeKey) {
    Object.values(modes).forEach(m => m.classList.add('hidden'));
    if (modes[modeKey]) {
        modes[modeKey].classList.remove('hidden');
    }
}

/** Update score display */
function updateScore() {
    scoreEl.textContent = score;
}

/** Update progress bar based on current question index */
function updateProgress() {
    const total = currentQuestions.length;
    const pct = total > 0 ? Math.round((currentQuestionIndex / total) * 100) : 0;
    progressEl.style.width = pct + '%';
}

/** Show result overlay with animation */
function showResult(correct) {
    resultOverlay.classList.remove('hidden');
    resultOverlay.classList.add('active');
    if (correct) {
        resultAnimation.textContent = '✅';
        resultText.textContent = 'Correct!';
    } else {
        resultAnimation.textContent = '❌';
        resultText.textContent = 'Wrong!';
    }
    setTimeout(() => {
        resultOverlay.classList.remove('active');
        setTimeout(() => {
            resultOverlay.classList.add('hidden');
            loadNextQuestion();
        }, 300);
    }, 800);
}

/** Show final score screen */
function showFinalScore() {
    const total = currentQuestions.length;
    resultOverlay.classList.remove('hidden');
    resultOverlay.classList.add('active');
    resultAnimation.textContent = '🎉';
    resultText.textContent = `Quiz complete! Score: ${score} / ${total}`;
    newStartBtn.classList.remove('hidden');
    progressEl.style.width = '100%';
}

/** Load the next question or show final score */
function loadNextQuestion() {
    if (currentQuestionIndex >= currentQuestions.length) {
        showFinalScore();
        return;
    }
    updateProgress();
    switch (currentMode) {
        case 'truefalse':     loadTrueFalse();     break;
        case 'multichoice':   loadMultiChoice();   break;
        case 'fillblank':     loadFillBlank();     break;
        case 'draganddrop':   loadDragAndDrop();   break;
    }
}

// ── True / False ──────────────────────────────────────────────────────────────

/** Load current True/False question */
function loadTrueFalse() {
    const q = currentQuestions[currentQuestionIndex];
    document.getElementById('tf-question').textContent = q.question;
}

/** Handle True/False button click */
function handleTrueFalse(answer) {
    const q = currentQuestions[currentQuestionIndex];
    const correct = (answer === q.answer);
    if (correct) score++;
    updateScore();
    currentQuestionIndex++;
    showResult(correct);
}

// ── Multiple Choice ───────────────────────────────────────────────────────────

/** Load current Multiple Choice question */
function loadMultiChoice() {
    const q = currentQuestions[currentQuestionIndex];
    document.getElementById('mc-question').textContent = q.question;
    const container = document.getElementById('mc-options');
    container.innerHTML = '';
    q.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'answer-btn mc-btn';
        btn.textContent = opt;
        btn.addEventListener('click', () => handleMultiChoice(opt));
        container.appendChild(btn);
    });
}

/** Handle Multiple Choice option click */
function handleMultiChoice(selected) {
    const q = currentQuestions[currentQuestionIndex];
    const correct = (selected === q.answer);
    if (correct) score++;
    updateScore();
    currentQuestionIndex++;
    showResult(correct);
}

// ── Fill in the Blank ─────────────────────────────────────────────────────────

/** Load current Fill-in-the-Blank question */
function loadFillBlank() {
    const q = currentQuestions[currentQuestionIndex];
    document.getElementById('fb-question').textContent = q.question;
    document.getElementById('fb-input').value = '';
    document.getElementById('fb-input').focus();
}

/** Handle Fill-in-the-Blank submit */
function handleFillBlank() {
    const input = document.getElementById('fb-input').value.trim();
    const q = currentQuestions[currentQuestionIndex];
    const correct = input.toLowerCase() === q.answer.toLowerCase();
    if (correct) score++;
    updateScore();
    currentQuestionIndex++;
    showResult(correct);
}

// ── Drag and Drop ─────────────────────────────────────────────────────────────

/** Load current Drag-and-Drop question */
function loadDragAndDrop() {
    const items = currentQuestions;
    const q = items[currentQuestionIndex];
    document.getElementById('dd-question').textContent =
        `Drag "${q.item}" to the correct category`;

    const itemsList = document.getElementById('dd-items');
    const targetsList = document.getElementById('dd-targets');
    itemsList.innerHTML = '';
    targetsList.innerHTML = '';

    const draggable = document.createElement('div');
    draggable.className = 'draggable-item';
    draggable.textContent = q.item;
    draggable.setAttribute('draggable', 'true');
    draggable.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', q.item);
    });
    itemsList.appendChild(draggable);

    const categories = [...new Set(items.map(i => i.category))];
    categories.forEach(cat => {
        const target = document.createElement('div');
        target.className = 'drop-target';
        target.textContent = cat;
        target.addEventListener('dragover', (e) => e.preventDefault());
        target.addEventListener('drop', (e) => {
            e.preventDefault();
            const draggedItem = e.dataTransfer.getData('text/plain');
            handleDragAndDrop(draggedItem, cat);
        });
        targetsList.appendChild(target);
    });
}

/** Handle Drag-and-Drop result */
function handleDragAndDrop(draggedItem, targetCategory) {
    const q = currentQuestions[currentQuestionIndex];
    const correct = (draggedItem === q.item && targetCategory === q.category);
    if (correct) score++;
    updateScore();
    currentQuestionIndex++;
    showResult(correct);
}

// ── Mode selection ────────────────────────────────────────────────────────────

const modeTitles = {
    truefalse: 'True or False',
    multichoice: 'Multiple Choice',
    fillblank: 'Fill in the Blank',
    draganddrop: 'Drag & Drop'
};

const modeData = {
    truefalse: () => quizData.trueFalseQuestions,
    multichoice: () => quizData.multipleChoiceQuestions,
    fillblank: () => quizData.fillInTheBlankQuestions,
    draganddrop: () => quizData.dragAndDropItems
};

document.querySelectorAll('.mode-btn').forEach(button => {
    button.addEventListener('click', () => {
        const mode = button.dataset.mode;
        currentMode = mode;
        currentQuestions = modeData[mode]();
        currentQuestionIndex = 0;
        score = 0;
        updateScore();
        updateProgress();
        modeTitleEl.textContent = modeTitles[mode] || mode;
        newStartBtn.classList.add('hidden');
        showPage('quiz');
        showMode(mode);
        loadNextQuestion();
    });
});

// ── True/False buttons ────────────────────────────────────────────────────────
document.querySelectorAll('.tf-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const answer = btn.dataset.answer === 'true';
        handleTrueFalse(answer);
    });
});

// ── Fill-in-the-Blank submit ──────────────────────────────────────────────────
document.getElementById('fb-submit').addEventListener('click', handleFillBlank);
document.getElementById('fb-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleFillBlank();
});

// ── New Start button ──────────────────────────────────────────────────────────
newStartBtn.addEventListener('click', () => {
    resultOverlay.classList.remove('active');
    resultOverlay.classList.add('hidden');
    newStartBtn.classList.add('hidden');
    showPage('home');
});