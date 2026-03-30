/* =============================================
   JustLEarn – Complete App Logic
   ============================================= */

// ── Default demo terms ──────────────────────────────────────────────────────
const DEFAULT_TERMS = [
    { term: 'Photosynthesis', definition: 'Process by which plants convert sunlight into food' },
    { term: 'Mitosis', definition: 'Cell division producing two identical daughter cells' },
    { term: 'Gravity', definition: 'Force that attracts objects toward the centre of the Earth' },
    { term: 'Osmosis', definition: 'Movement of water through a semi-permeable membrane' },
    { term: 'DNA', definition: 'Molecule carrying genetic information in living organisms' },
    { term: 'Atom', definition: 'Smallest unit of an element that retains its properties' },
    { term: 'Ecosystem', definition: 'Community of living organisms and their environment' },
    { term: 'Velocity', definition: 'Speed of an object in a given direction' },
];

// ── App State ────────────────────────────────────────────────────────────────
const appState = {
    currentScreen: 'home',
    currentQuizMode: null,
    userTerms: [],
    currentQuizIndex: 0,
    score: { correct: 0, total: 0 },
    shuffledTerms: [],
    // True/False specific
    currentTFStatement: null,
    currentTFIsCorrect: null,
    // Drag & Drop specific
    draggedCard: null,
    touchDragCard: null,
};

// ── Utility Functions ────────────────────────────────────────────────────────
function shuffleArray(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function getRandomWrongAnswers(correctDef, allTerms, count) {
    const others = allTerms
        .filter(t => t.definition !== correctDef)
        .map(t => t.definition);
    return shuffleArray(others).slice(0, count);
}

function calculateProgress(current, total) {
    if (total === 0) return 0;
    return Math.round((current / total) * 100);
}

function formatScore(correct, total) {
    return `${correct} / ${total}`;
}

// ── localStorage ─────────────────────────────────────────────────────────────
function loadTerms() {
    try {
        const saved = localStorage.getItem('justlearn-terms');
        if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
                appState.userTerms = parsed;
                return;
            }
        }
    } catch (e) {
        console.warn('Failed to load terms from localStorage:', e);
    }
    appState.userTerms = DEFAULT_TERMS.slice();
}

function saveTermsToStorage() {
    try {
        localStorage.setItem('justlearn-terms', JSON.stringify(appState.userTerms));
        localStorage.setItem('justlearn-terms-timestamp', Date.now().toString());
    } catch (e) {
        console.warn('Failed to save terms:', e);
    }
}

// ── Screen Navigation ─────────────────────────────────────────────────────────
function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const target = document.getElementById('screen-' + id);
    if (target) {
        target.classList.add('active');
        appState.currentScreen = id;
    }
}

function goHome() {
    showScreen('home');
    updateHomeTermsCount();
}

function showCreateScreen() {
    showScreen('create');
    renderTermInputs();
    displayTermsList();
}

// ── Home Screen ───────────────────────────────────────────────────────────────
function updateHomeTermsCount() {
    const el = document.getElementById('terms-count-info');
    if (el) {
        const n = appState.userTerms.length;
        el.textContent = `📖 ${n} term${n !== 1 ? 's' : ''} loaded`;
    }
}

// ── Term Creation ─────────────────────────────────────────────────────────────
let termInputCount = 0;

function renderTermInputs() {
    const list = document.getElementById('terms-input-list');
    if (!list) return;
    list.innerHTML = '';
    termInputCount = 0;
    addTermField();
}

function addTermField(termValue, defValue) {
    const list = document.getElementById('terms-input-list');
    if (!list) return;
    termInputCount++;
    const id = termInputCount;

    const row = document.createElement('div');
    row.className = 'term-input-row';
    row.id = 'term-row-' + id;

    row.innerHTML = `
        <input type="text" class="term-input term-field" id="term-${id}" 
               placeholder="Term…" value="${escapeAttr(termValue || '')}"
               onkeydown="handleTermKeydown(event, ${id})" oninput="autoResize(this)">
        <input type="text" class="term-input def-field" id="def-${id}" 
               placeholder="Definition…" value="${escapeAttr(defValue || '')}"
               onkeydown="handleDefKeydown(event, ${id})" oninput="autoResize(this)">
        <button class="remove-term-btn" onclick="removeTermRow(${id})" title="Remove">✕</button>
    `;

    list.appendChild(row);

    // Focus new term field
    requestAnimationFrame(() => {
        const input = document.getElementById('term-' + id);
        if (input) input.focus();
    });
}

function escapeAttr(str) {
    return String(str).replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function autoResize(el) {
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
}

function handleTermKeydown(e, id) {
    if (e.key === 'Enter') {
        e.preventDefault();
        const defField = document.getElementById('def-' + id);
        if (defField) defField.focus();
    }
}

function handleDefKeydown(e, id) {
    if (e.key === 'Enter') {
        e.preventDefault();
        addTermField();
    }
}

function removeTermRow(id) {
    const row = document.getElementById('term-row-' + id);
    if (row) row.remove();
}

function collectInputTerms() {
    const rows = document.querySelectorAll('.term-input-row');
    const terms = [];
    rows.forEach(row => {
        const termEl = row.querySelector('.term-field');
        const defEl = row.querySelector('.def-field');
        if (termEl && defEl) {
            const term = termEl.value.trim();
            const definition = defEl.value.trim();
            if (term && definition) {
                terms.push({ term, definition });
            }
        }
    });
    return terms;
}

function saveTerms() {
    const newTerms = collectInputTerms();
    if (newTerms.length === 0) {
        showSaveMessage('⚠️ Please fill in at least one term and definition.', 'error');
        return;
    }
    appState.userTerms = newTerms;
    saveTermsToStorage();
    displayTermsList();
    updateHomeTermsCount();
    showSaveMessage(`✅ ${newTerms.length} term${newTerms.length !== 1 ? 's' : ''} saved!`, 'success');
}

function showSaveMessage(msg, type) {
    const el = document.getElementById('save-message');
    if (!el) return;
    el.textContent = msg;
    el.className = 'save-message ' + (type === 'error' ? 'save-error' : 'save-success');
    el.style.display = 'block';
    setTimeout(() => { el.style.display = 'none'; }, 3000);
}

function displayTermsList() {
    const container = document.getElementById('saved-terms-list');
    if (!container) return;
    container.innerHTML = '';
    if (appState.userTerms.length === 0) {
        container.innerHTML = '<p class="no-terms">No terms saved yet.</p>';
        return;
    }
    appState.userTerms.forEach((t, i) => {
        const div = document.createElement('div');
        div.className = 'saved-term-item';
        div.innerHTML = `<span class="saved-term-num">${i + 1}.</span>
                         <span class="saved-term-term">${escapeHtml(t.term)}</span>
                         <span class="saved-term-sep">→</span>
                         <span class="saved-term-def">${escapeHtml(t.definition)}</span>`;
        container.appendChild(div);
    });
}

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

// ── Quiz Entry Point ──────────────────────────────────────────────────────────
const MODE_NAMES = {
    trueFalse: '📚 True / False',
    multipleChoice: '🎯 Multiple Choice',
    fillBlank: '✏️ Fill the Blank',
    dragDrop: '🔀 Drag & Drop',
};

function startQuiz(mode) {
    if (appState.userTerms.length < 2) {
        alert('You need at least 2 terms to play! Go to "Create Terms" and add some.');
        return;
    }
    appState.currentQuizMode = mode;
    appState.shuffledTerms = shuffleArray(appState.userTerms);
    appState.currentQuizIndex = 0;
    appState.score = { correct: 0, total: 0 };

    // Show quiz screen
    showScreen('quiz');

    // Update mode name
    const modeNameEl = document.getElementById('quiz-mode-name');
    if (modeNameEl) modeNameEl.textContent = MODE_NAMES[mode] || mode;

    // Hide all mode panels, show the right one
    document.querySelectorAll('.mode-panel').forEach(p => p.style.display = 'none');
    const panelId = 'mode-' + mode.toLowerCase();
    const panel = document.getElementById(panelId);
    if (panel) panel.style.display = 'block';

    loadQuestion();
}

function loadQuestion() {
    const terms = appState.shuffledTerms;
    const idx = appState.currentQuizIndex;

    if (idx >= terms.length) {
        showResultScreen();
        return;
    }

    const current = terms[idx];

    // Update progress
    updateProgress(idx, terms.length);
    updateScore();

    // Update question
    const questionEl = document.getElementById('quiz-question');
    if (questionEl) questionEl.textContent = current.term;

    // Clear feedback
    clearFeedback();

    // Hide next button
    const nextBtn = document.getElementById('next-btn');
    if (nextBtn) nextBtn.style.display = 'none';

    // Load mode-specific UI
    const mode = appState.currentQuizMode;
    if (mode === 'trueFalse') loadTrueFalse(current);
    else if (mode === 'multipleChoice') loadMultipleChoice(current);
    else if (mode === 'fillBlank') loadFillBlank();
    else if (mode === 'dragDrop') loadDragDrop(current);
}

function updateProgress(current, total) {
    const bar = document.getElementById('progress-bar');
    if (bar) bar.style.width = calculateProgress(current, total) + '%';
}

function updateScore() {
    const el = document.getElementById('quiz-score');
    if (el) el.textContent = formatScore(appState.score.correct, appState.score.total);
}

function clearFeedback() {
    const el = document.getElementById('feedback');
    if (el) { el.textContent = ''; el.className = 'feedback'; }
}

function showFeedback(msg, correct) {
    const el = document.getElementById('feedback');
    if (el) {
        el.textContent = msg;
        el.className = 'feedback ' + (correct ? 'feedback-correct' : 'feedback-wrong');
    }
}

function nextQuestion() {
    appState.currentQuizIndex++;
    loadQuestion();
}

// ── True / False Mode ─────────────────────────────────────────────────────────
function loadTrueFalse(current) {
    // 50/50 chance of showing the correct or a wrong definition
    const isCorrect = Math.random() < 0.5;
    let shownDef;
    if (isCorrect) {
        shownDef = current.definition;
    } else {
        const wrongs = getRandomWrongAnswers(current.definition, appState.shuffledTerms, 1);
        shownDef = wrongs.length > 0 ? wrongs[0] : current.definition;
        // Edge case: if no wrong answers available, force correct
        if (wrongs.length === 0) {
            appState.currentTFIsCorrect = true;
            appState.currentTFStatement = current.definition;
            document.getElementById('tf-shown-def').textContent = '"' + current.definition + '"';
            enableTFButtons();
            return;
        }
    }
    appState.currentTFIsCorrect = isCorrect;
    appState.currentTFStatement = shownDef;

    const defEl = document.getElementById('tf-shown-def');
    if (defEl) defEl.textContent = '"' + shownDef + '"';

    enableTFButtons();
}

function enableTFButtons() {
    document.querySelectorAll('.tf-btn').forEach(b => b.disabled = false);
}

function answerTrueFalse(userSaidTrue) {
    document.querySelectorAll('.tf-btn').forEach(b => b.disabled = true);
    appState.score.total++;

    const isCorrect = appState.currentTFIsCorrect;
    const correct = (userSaidTrue === isCorrect);

    if (correct) {
        appState.score.correct++;
        showFeedback('✅ Correct!', true);
    } else {
        const correctAnswer = isCorrect ? 'True' : 'False';
        showFeedback(`❌ Wrong! The answer is ${correctAnswer}.`, false);
    }

    updateScore();

    const nextBtn = document.getElementById('next-btn');
    if (nextBtn) nextBtn.style.display = 'block';
}

// ── Multiple Choice Mode ──────────────────────────────────────────────────────
function loadMultipleChoice(current) {
    const container = document.getElementById('mc-options');
    if (!container) return;
    container.innerHTML = '';

    const wrongs = getRandomWrongAnswers(current.definition, appState.shuffledTerms, 3);
    const options = shuffleArray([current.definition, ...wrongs]);

    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'mc-btn';
        btn.textContent = opt;
        btn.onclick = () => answerMultipleChoice(btn, opt, current.definition);
        container.appendChild(btn);
    });
}

function answerMultipleChoice(btn, selected, correct) {
    // Disable all
    document.querySelectorAll('.mc-btn').forEach(b => b.disabled = true);
    appState.score.total++;

    if (selected === correct) {
        appState.score.correct++;
        btn.classList.add('mc-correct');
        showFeedback('✅ Correct!', true);
    } else {
        btn.classList.add('mc-wrong');
        // Highlight correct
        document.querySelectorAll('.mc-btn').forEach(b => {
            if (b.textContent === correct) b.classList.add('mc-correct');
        });
        showFeedback(`❌ Wrong! Correct: "${correct}"`, false);
    }

    updateScore();
    const nextBtn = document.getElementById('next-btn');
    if (nextBtn) nextBtn.style.display = 'block';
}

// ── Fill the Blank Mode ───────────────────────────────────────────────────────
function loadFillBlank() {
    const input = document.getElementById('fill-input');
    if (input) {
        input.value = '';
        input.disabled = false;
        requestAnimationFrame(() => input.focus());
    }
    const submitBtn = document.querySelector('.fill-submit-btn');
    if (submitBtn) submitBtn.disabled = false;
}

function handleFillKeydown(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        submitFillBlank();
    }
}

function submitFillBlank() {
    const input = document.getElementById('fill-input');
    if (!input || input.disabled) return;

    const userAnswer = input.value.trim();
    if (!userAnswer) return;

    const current = appState.shuffledTerms[appState.currentQuizIndex];
    const correct = current.definition.trim().toLowerCase();
    const given = userAnswer.toLowerCase();

    input.disabled = true;
    const submitBtn = document.querySelector('.fill-submit-btn');
    if (submitBtn) submitBtn.disabled = true;

    appState.score.total++;

    if (given === correct) {
        appState.score.correct++;
        input.classList.add('fill-correct');
        showFeedback('✅ Correct!', true);
    } else {
        input.classList.add('fill-wrong');
        showFeedback(`❌ Wrong! Correct: "${current.definition}"`, false);
    }

    input.classList.remove('fill-correct', 'fill-wrong');
    setTimeout(() => {
        if (given === correct) input.classList.add('fill-correct');
        else input.classList.add('fill-wrong');
    }, 10);

    updateScore();
    const nextBtn = document.getElementById('next-btn');
    if (nextBtn) nextBtn.style.display = 'block';
}

// ── Drag & Drop Mode ──────────────────────────────────────────────────────────
function loadDragDrop(current) {
    const cardsContainer = document.getElementById('drag-cards');
    const dropZone = document.getElementById('drop-zone');
    const dropText = document.getElementById('drop-zone-text');
    if (!cardsContainer || !dropZone) return;

    cardsContainer.innerHTML = '';
    dropZone.classList.remove('drop-correct', 'drop-wrong');
    if (dropText) dropText.textContent = 'Drop the correct answer here';
    appState.draggedCard = null;
    appState.touchDragCard = null;

    const wrongs = getRandomWrongAnswers(current.definition, appState.shuffledTerms, 3);
    const options = shuffleArray([current.definition, ...wrongs]);

    options.forEach(opt => {
        const card = document.createElement('div');
        card.className = 'drag-card';
        card.textContent = opt;
        card.draggable = true;
        card.dataset.value = opt;

        // Desktop drag events
        card.addEventListener('dragstart', e => {
            appState.draggedCard = opt;
            e.dataTransfer.setData('text/plain', opt);
            card.classList.add('dragging');
        });
        card.addEventListener('dragend', () => {
            card.classList.remove('dragging');
        });

        // Touch events for mobile
        card.addEventListener('touchstart', e => {
            appState.touchDragCard = card;
            card.classList.add('dragging');
        }, { passive: true });
        card.addEventListener('touchmove', e => {
            e.preventDefault();
            const touch = e.touches[0];
            card.style.position = 'fixed';
            card.style.left = (touch.clientX - card.offsetWidth / 2) + 'px';
            card.style.top = (touch.clientY - card.offsetHeight / 2) + 'px';
            card.style.zIndex = '1000';
        }, { passive: false });
        card.addEventListener('touchend', e => {
            const touch = e.changedTouches[0];
            card.style.position = '';
            card.style.left = '';
            card.style.top = '';
            card.style.zIndex = '';
            card.classList.remove('dragging');
            const zone = document.getElementById('drop-zone');
            if (zone) {
                const rect = zone.getBoundingClientRect();
                if (
                    touch.clientX >= rect.left && touch.clientX <= rect.right &&
                    touch.clientY >= rect.top && touch.clientY <= rect.bottom
                ) {
                    evaluateDrop(opt, current.definition);
                }
            }
        });

        cardsContainer.appendChild(card);
    });
}

function handleDrop(e) {
    e.preventDefault();
    const dropped = e.dataTransfer.getData('text/plain') || appState.draggedCard;
    if (!dropped) return;
    const current = appState.shuffledTerms[appState.currentQuizIndex];
    evaluateDrop(dropped, current.definition);
}

function handleTouchDrop(e) {
    // handled inside touchend of card
}

function evaluateDrop(dropped, correctDef) {
    const dropZone = document.getElementById('drop-zone');
    const dropText = document.getElementById('drop-zone-text');
    const cardsContainer = document.getElementById('drag-cards');

    // Prevent double-answering
    if (dropZone && dropZone.classList.contains('drop-answered')) return;
    if (dropZone) dropZone.classList.add('drop-answered');

    // Disable cards
    if (cardsContainer) {
        cardsContainer.querySelectorAll('.drag-card').forEach(c => {
            c.draggable = false;
            c.style.pointerEvents = 'none';
        });
    }

    appState.score.total++;

    if (dropped === correctDef) {
        appState.score.correct++;
        if (dropZone) dropZone.classList.add('drop-correct');
        if (dropText) dropText.textContent = '✅ ' + dropped;
        showFeedback('✅ Correct!', true);
    } else {
        if (dropZone) dropZone.classList.add('drop-wrong');
        if (dropText) dropText.textContent = '❌ ' + dropped;
        showFeedback(`❌ Wrong! Correct: "${correctDef}"`, false);
    }

    updateScore();
    const nextBtn = document.getElementById('next-btn');
    if (nextBtn) nextBtn.style.display = 'block';

    // Re-enable drop zone for next question (cleaned up in loadDragDrop)
    if (dropZone) {
        setTimeout(() => dropZone.classList.remove('drop-answered'), 100);
    }
}

// ── Results Screen ────────────────────────────────────────────────────────────
function showResultScreen() {
    showScreen('results');

    const { correct, total } = appState.score;
    const pct = total > 0 ? Math.round((correct / total) * 100) : 0;

    const emoji = document.getElementById('results-emoji');
    const scoreEl = document.getElementById('results-score');
    const msgEl = document.getElementById('results-message');

    if (scoreEl) scoreEl.textContent = `${correct} / ${total} (${pct}%)`;

    let emj = '😔';
    let msg = 'Keep practicing! You\'ll get better!';
    if (pct === 100) { emj = '🏆'; msg = 'Perfect score! Amazing!'; }
    else if (pct >= 80) { emj = '🎉'; msg = 'Great job! Almost perfect!'; }
    else if (pct >= 60) { emj = '👍'; msg = 'Good effort! Keep it up!'; }
    else if (pct >= 40) { emj = '💪'; msg = 'You\'re improving! Try again!'; }

    if (emoji) emoji.textContent = emj;
    if (msgEl) msgEl.textContent = msg;
}

function playAgain() {
    startQuiz(appState.currentQuizMode);
}

// ── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    loadTerms();
    updateHomeTermsCount();
});