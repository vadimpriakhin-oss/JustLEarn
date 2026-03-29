// app.js

// ── State ──────────────────────────────────────────────────────────────────────
let score = 0;
let currentMode = '';
let currentQuestions = [];
let currentIndex = 0;
let totalQuestions = 0;

// ── DOM References ─────────────────────────────────────────────────────────────
const homePage      = document.getElementById('home');
const quizPage      = document.getElementById('quiz');
const scoreEl       = document.getElementById('score');
const modeTitleEl   = document.getElementById('mode-title');
const progressEl    = document.getElementById('progress');
const resultOverlay = document.getElementById('result-overlay');
const resultAnim    = document.getElementById('result-animation');
const resultText    = document.getElementById('result-text');
const newStartBtn   = document.getElementById('new-start-btn');

// ── Page Switching ─────────────────────────────────────────────────────────────
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
}

// ── Quiz-Mode Panel Switching ──────────────────────────────────────────────────
function showMode(modeId) {
    document.querySelectorAll('.quiz-mode').forEach(m => m.classList.add('hidden'));
    const panel = document.getElementById(modeId + '-mode');
    if (panel) panel.classList.remove('hidden');
}

// ── UI Helpers ─────────────────────────────────────────────────────────────────
function updateScore() {
    scoreEl.textContent = score;
}

function updateProgress() {
    const pct = totalQuestions > 0 ? (currentIndex / totalQuestions) * 100 : 0;
    progressEl.style.width = pct + '%';
}

// ── Result Overlay ─────────────────────────────────────────────────────────────
function showResult(correct) {
    resultAnim.textContent = correct ? '✅' : '❌';
    resultText.textContent  = correct ? 'Correct!' : 'Incorrect!';
    resultOverlay.classList.remove('hidden');
    resultOverlay.classList.add('active');
    setTimeout(() => {
        resultOverlay.classList.remove('active');
        resultOverlay.classList.add('hidden');
        nextQuestion();
    }, 1200);
}

function showFinalScore() {
    resultAnim.textContent = '🏆';
    resultText.textContent  = `Quiz Complete!  Score: ${score} / ${totalQuestions}`;
    resultOverlay.classList.remove('hidden');
    resultOverlay.classList.add('active');
    newStartBtn.classList.remove('hidden');
}

// ── Start Quiz ─────────────────────────────────────────────────────────────────
function startQuiz(mode) {
    currentMode  = mode;
    score        = 0;
    currentIndex = 0;
    updateScore();
    updateProgress();

    const modeTitles = {
        truefalse:   'True or False',
        multichoice: 'Multiple Choice',
        fillblank:   'Fill in the Blank',
        draganddrop: 'Drag & Drop'
    };
    modeTitleEl.textContent = modeTitles[mode] || mode;

    switch (mode) {
        case 'truefalse':   currentQuestions = quizData.trueFalseQuestions;        break;
        case 'multichoice': currentQuestions = quizData.multipleChoiceQuestions;   break;
        case 'fillblank':   currentQuestions = quizData.fillInTheBlankQuestions;   break;
        case 'draganddrop': currentQuestions = quizData.dragAndDropItems;          break;
        default:            currentQuestions = [];
    }

    totalQuestions = currentQuestions.length;
    newStartBtn.classList.add('hidden');
    resultOverlay.classList.add('hidden');
    resultOverlay.classList.remove('active');

    showPage('quiz');
    showMode(mode);
    loadQuestion();
}

// ── Question Loader ────────────────────────────────────────────────────────────
function loadQuestion() {
    if (currentIndex >= totalQuestions) {
        showFinalScore();
        return;
    }
    updateProgress();

    switch (currentMode) {
        case 'truefalse':   loadTrueFalse();       break;
        case 'multichoice': loadMultipleChoice();  break;
        case 'fillblank':   loadFillInBlank();     break;
        case 'draganddrop': loadDragAndDrop();     break;
    }
}

function nextQuestion() {
    currentIndex++;
    loadQuestion();
}

// ── True / False ───────────────────────────────────────────────────────────────
function loadTrueFalse() {
    const q = currentQuestions[currentIndex];
    document.getElementById('tf-question').textContent = q.question;
    document.querySelectorAll('.tf-btn').forEach(btn => {
        btn.disabled     = false;
        btn.style.opacity = '1';
    });
}

document.querySelectorAll('.tf-btn').forEach(btn => {
    btn.addEventListener('click', e => {
        if (currentMode !== 'truefalse' || currentIndex >= totalQuestions) return;
        const answer  = e.currentTarget.dataset.answer === 'true';
        const correct = answer === currentQuestions[currentIndex].answer;
        if (correct) score++;
        updateScore();
        document.querySelectorAll('.tf-btn').forEach(b => {
            b.disabled     = true;
            b.style.opacity = '0.6';
        });
        showResult(correct);
    });
});

// ── Multiple Choice ────────────────────────────────────────────────────────────
function loadMultipleChoice() {
    const q        = currentQuestions[currentIndex];
    const optionsEl = document.getElementById('mc-options');
    document.getElementById('mc-question').textContent = q.question;
    optionsEl.innerHTML = '';

    q.options.forEach(option => {
        const btn = document.createElement('button');
        btn.className   = 'answer-btn mc-btn';
        btn.textContent = option;
        btn.addEventListener('click', () => {
            const correct = option === q.answer;
            if (correct) score++;
            updateScore();
            optionsEl.querySelectorAll('.mc-btn').forEach(b => {
                b.disabled     = true;
                b.style.opacity = '0.6';
            });
            showResult(correct);
        });
        optionsEl.appendChild(btn);
    });
}

// ── Fill in the Blank ──────────────────────────────────────────────────────────
function loadFillInBlank() {
    const q   = currentQuestions[currentIndex];
    const inp = document.getElementById('fb-input');
    document.getElementById('fb-question').textContent = q.question;
    inp.value    = '';
    inp.disabled = false;
    document.getElementById('fb-submit').disabled = false;
}

document.getElementById('fb-submit').addEventListener('click', () => {
    if (currentMode !== 'fillblank' || currentIndex >= totalQuestions) return;
    const inp     = document.getElementById('fb-input');
    const answer  = inp.value.trim().toLowerCase();
    const correct = answer === currentQuestions[currentIndex].answer.toLowerCase();
    if (correct) score++;
    updateScore();
    inp.disabled = true;
    document.getElementById('fb-submit').disabled = true;
    showResult(correct);
});

document.getElementById('fb-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('fb-submit').click();
});

// ── Drag & Drop ────────────────────────────────────────────────────────────────
let draggedEl = null;

function loadDragAndDrop() {
    const items      = quizData.dragAndDropItems;
    const categories = [...new Set(items.map(i => i.category))];
    const itemsEl    = document.getElementById('dd-items');
    const targetsEl  = document.getElementById('dd-targets');
    totalQuestions   = items.length;   // one point per item

    document.getElementById('dd-question').textContent =
        'Drag each item to its correct category:';

    // Draggable items (shuffled)
    itemsEl.innerHTML = '';
    // Fisher-Yates shuffle for uniform randomness
    const shuffled = [...items];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    shuffled.forEach(item => {
        const el = document.createElement('div');
        el.className       = 'drag-item';
        el.textContent     = item.item;
        el.draggable       = true;
        el.dataset.item     = item.item;
        el.dataset.category = item.category;

        el.addEventListener('dragstart', e => {
            draggedEl = el;
            e.dataTransfer.setData('text/plain', item.item);
            el.classList.add('dragging');
        });
        el.addEventListener('dragend', () => el.classList.remove('dragging'));
        itemsEl.appendChild(el);
    });

    // Drop targets (one per category)
    targetsEl.innerHTML = '';
    categories.forEach(cat => {
        const target = document.createElement('div');
        target.className        = 'drop-target';
        target.dataset.category = cat;

        const label = document.createElement('div');
        label.className   = 'drop-label';
        label.textContent = cat;

        const zone = document.createElement('div');
        zone.className        = 'drop-zone';
        zone.dataset.category = cat;

        target.appendChild(label);
        target.appendChild(zone);

        target.addEventListener('dragover', e => {
            e.preventDefault();
            target.classList.add('drag-over');
        });
        target.addEventListener('dragleave', () => target.classList.remove('drag-over'));
        target.addEventListener('drop', e => {
            e.preventDefault();
            target.classList.remove('drag-over');
            if (!draggedEl) return;

            const correct = draggedEl.dataset.category === cat;
            if (correct) {
                score++;
                updateScore();
                draggedEl.classList.add('correct-drop');
                draggedEl.draggable = false;
                zone.appendChild(draggedEl);
            } else {
                draggedEl.classList.add('wrong-drop');
                setTimeout(() => draggedEl.classList.remove('wrong-drop'), 600);
            }
            draggedEl = null;

            // End when all items have been placed correctly
            const placed = document.querySelectorAll('.drag-item.correct-drop').length;
            if (placed === items.length) {
                setTimeout(showFinalScore, 800);
            }
        });

        targetsEl.appendChild(target);
    });
}

// ── Mode Buttons (Home → Quiz) ────────────────────────────────────────────────
document.querySelectorAll('.mode-btn').forEach(button => {
    button.addEventListener('click', e => {
        startQuiz(e.currentTarget.dataset.mode);
    });
});

// ── New Start Button ───────────────────────────────────────────────────────────
newStartBtn.addEventListener('click', () => {
    resultOverlay.classList.add('hidden');
    resultOverlay.classList.remove('active');
    newStartBtn.classList.add('hidden');
    score        = 0;
    currentIndex = 0;
    updateScore();
    showPage('home');
});
