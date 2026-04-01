// ── State ────────────────────────────────────────────────────────────────────
const appState = {
    currentScreen: 'dashboard',
    learnChiks: [],
    activeChik: null,
    editingChik: null,
    currentQuizIndex: 0,
    score: { correct: 0, total: 0 },
    currentQuizMode: null,
    shuffledTerms: [],
    draggedElement: null,
    currentTfAnswer: null,  // true = shown definition is correct, false = it is wrong
};

const STORAGE_KEY = 'justlearnChiks';

const DEFAULT_TERMS = [
    { term: 'Photosynthesis', definition: 'Process by which plants convert sunlight into chemical energy' },
    { term: 'Mitochondria',   definition: 'Powerhouse of the cell responsible for energy production' },
    { term: 'Osmosis',        definition: 'Movement of water across a semipermeable membrane' },
    { term: 'Enzyme',         definition: 'Protein that speeds up chemical reactions in cells' },
    { term: 'DNA',            definition: 'Molecule that carries genetic instructions for life' },
];

// ── Bootstrap ─────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    registerServiceWorker();
    loadChiks();
    showDashboard();
});

function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('service-worker.js')
            .then(() => console.log('Service Worker registered'))
            .catch(err => console.error('Service Worker registration failed:', err));
    }
}

// ── Persistence ───────────────────────────────────────────────────────────────
function loadChiks() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        appState.learnChiks = stored ? JSON.parse(stored) : [];
    } catch (e) {
        console.error('Error loading LearnChiks:', e);
        appState.learnChiks = [];
    }
}

function saveChiks() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(appState.learnChiks));
    } catch (e) {
        console.error('Error saving LearnChiks:', e);
        alert('Failed to save. Storage may be full.');
    }
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// ── Render helper ─────────────────────────────────────────────────────────────
function render(html) {
    document.getElementById('app').innerHTML = html;
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
function showDashboard() {
    appState.currentScreen = 'dashboard';
    appState.activeChik = null;
    render(
        '<div class="screen dashboard">' +
        '<header class="app-header">' +
        '<span class="logo">&#128218;</span>' +
        '<div class="header-text"><h1>JustLEarn</h1><p>Your Study Sets</p></div>' +
        '</header>' +
        '<main class="dashboard-main">' +
        '<button class="btn btn-primary btn-large" id="btnCreate">Create New LearnChik</button>' +
        '<button class="btn btn-secondary btn-large" id="btnLibrary">&#128218; My LearnChiks</button>' +
        '</main>' +
        '<footer class="app-footer">&copy; 2026 JustLEarn</footer>' +
        '</div>'
    );
    document.getElementById('btnCreate').addEventListener('click', () => showCreateChik(null));
    document.getElementById('btnLibrary').addEventListener('click', showLibrary);
}

// ── Create LearnChik ───────────────────────────────────────────────────────────
function showCreateChik(chikToEdit) {
    appState.currentScreen = 'create';
    const isEdit = chikToEdit && chikToEdit.id;
    appState.editingChik = isEdit
        ? { ...chikToEdit, terms: chikToEdit.terms.map(t => ({ ...t })) }
        : { id: null, name: '', createdAt: null, terms: DEFAULT_TERMS.map(t => ({ ...t })) };
    renderCreateScreen();
}

function renderCreateScreen() {
    const chik = appState.editingChik;
    render(
        '<div class="screen create-screen">' +
        '<header class="top-bar">' +
        '<button class="btn-icon" id="btnBackCreate">&#8592; Back</button>' +
        '<h2 class="top-bar-title">New LearnChik</h2>' +
        '<span></span></header>' +
        '<div class="create-body">' +
        '<input type="text" id="chikName" class="chik-name-input" placeholder="LearnChik Name (e.g. Biology 101)" value="' + escapeAttr(chik.name) + '" maxlength="80" />' +
        '<div id="termsContainer"></div>' +
        '<button class="btn btn-outline" id="btnAddTerm">+ Add Term</button>' +
        '</div>' +
        '<div class="bottom-bar">' +
        '<button class="btn btn-danger" id="btnCancelCreate">Cancel</button>' +
        '<button class="btn btn-primary" id="btnSaveChik">&#128190; Save LearnChik</button>' +
        '</div></div>'
    );
    renderTermFields();
    document.getElementById('btnBackCreate').addEventListener('click', showDashboard);
    document.getElementById('btnCancelCreate').addEventListener('click', showDashboard);
    document.getElementById('btnAddTerm').addEventListener('click', addTerm);
    document.getElementById('btnSaveChik').addEventListener('click', saveChik);
    document.getElementById('chikName').addEventListener('input', e => {
        appState.editingChik.name = e.target.value;
    });
}

function renderTermFields() {
    const container = document.getElementById('termsContainer');
    if (!container) return;
    container.innerHTML = '';
    appState.editingChik.terms.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'term-card';

        const termInput = document.createElement('input');
        termInput.type = 'text';
        termInput.placeholder = 'Term';
        termInput.value = item.term;
        termInput.className = 'term-input';
        termInput.addEventListener('input', e => { appState.editingChik.terms[index].term = e.target.value; });

        const defInput = document.createElement('textarea');
        defInput.placeholder = 'Definition';
        defInput.value = item.definition;
        defInput.className = 'term-textarea';
        defInput.addEventListener('input', e => { appState.editingChik.terms[index].definition = e.target.value; });

        const delBtn = document.createElement('button');
        delBtn.textContent = 'Delete';
        delBtn.className = 'btn btn-danger btn-sm';
        delBtn.addEventListener('click', () => removeTerm(index));

        card.appendChild(termInput);
        card.appendChild(defInput);
        card.appendChild(delBtn);
        container.appendChild(card);
    });
}

function addTerm() {
    appState.editingChik.terms.push({ term: '', definition: '' });
    renderTermFields();
}

function removeTerm(index) {
    appState.editingChik.terms.splice(index, 1);
    renderTermFields();
}

function saveChik() {
    const chik = appState.editingChik;
    const nameEl = document.getElementById('chikName');
    if (nameEl) chik.name = nameEl.value.trim();

    if (!chik.name) { alert('Please give your LearnChik a name!'); return; }
    const validTerms = chik.terms.filter(t => t.term.trim() && t.definition.trim());
    if (validTerms.length === 0) { alert('Add at least one term with a definition!'); return; }
    chik.terms = validTerms;

    if (chik.id) {
        const idx = appState.learnChiks.findIndex(c => c.id === chik.id);
        if (idx !== -1) appState.learnChiks[idx] = chik;
    } else {
        chik.id = generateId();
        chik.createdAt = Date.now();
        appState.learnChiks.push(chik);
    }
    saveChiks();
    showLibrary();
}

// ── Library ────────────────────────────────────────────────────────────────────
function showLibrary() {
    appState.currentScreen = 'library';
    const chiks = appState.learnChiks;
    let cardsHtml = '';
    if (chiks.length === 0) {
        cardsHtml = '<div class="empty-state"><p>&#128205; No study sets yet.</p><p>Create your first LearnChik!</p></div>';
    } else {
        chiks.forEach(chik => {
            const date = new Date(chik.createdAt).toLocaleDateString();
            cardsHtml +=
                '<div class="chik-card" data-id="' + escapeAttr(chik.id) + '">' +
                '<div class="chik-card-body">' +
                '<div class="chik-name">&#128218; ' + escapeHtml(chik.name) + '</div>' +
                '<div class="chik-meta">' +
                '<span>&#128202; ' + chik.terms.length + ' term' + (chik.terms.length !== 1 ? 's' : '') + '</span>' +
                '<span>&#128197; ' + date + '</span>' +
                '</div></div>' +
                '<button class="btn btn-danger btn-sm chik-delete" data-id="' + escapeAttr(chik.id) + '">&#128465;</button>' +
                '</div>';
        });
    }

    render(
        '<div class="screen library-screen">' +
        '<header class="top-bar">' +
        '<button class="btn-icon" id="btnBackLibrary">&#8592; Back</button>' +
        '<h2 class="top-bar-title">My LearnChiks</h2>' +
        '<button class="btn btn-primary btn-sm" id="btnNewChik">+ New</button>' +
        '</header>' +
        '<div class="chik-grid">' + cardsHtml + '</div>' +
        '</div>'
    );

    document.getElementById('btnBackLibrary').addEventListener('click', showDashboard);
    document.getElementById('btnNewChik').addEventListener('click', () => showCreateChik(null));

    document.querySelectorAll('.chik-card').forEach(card => {
        card.addEventListener('click', e => {
            if (e.target.classList.contains('chik-delete')) return;
            const id = card.dataset.id;
            const chik = appState.learnChiks.find(c => c.id === id);
            if (chik) showStudyModeSelection(chik);
        });
    });

    document.querySelectorAll('.chik-delete').forEach(btn => {
        btn.addEventListener('click', e => {
            e.stopPropagation();
            const id = btn.dataset.id;
            const chik = appState.learnChiks.find(c => c.id === id);
            if (!chik) return;
            if (confirm('Delete "' + chik.name + '"? This cannot be undone.')) {
                appState.learnChiks = appState.learnChiks.filter(c => c.id !== id);
                saveChiks();
                showLibrary();
            }
        });
    });
}

// ── Study Mode Selection ───────────────────────────────────────────────────────
function showStudyModeSelection(chik) {
    appState.currentScreen = 'study-select';
    appState.activeChik = chik;

    render(
        '<div class="screen study-select-screen">' +
        '<header class="top-bar">' +
        '<button class="btn-icon" id="btnBackStudy">&#8592; Back</button>' +
        '<div class="top-bar-center">' +
        '<div class="top-bar-title">' + escapeHtml(chik.name) + '</div>' +
        '<div class="top-bar-sub">' + chik.terms.length + ' term' + (chik.terms.length !== 1 ? 's' : '') + '</div>' +
        '</div><span></span></header>' +
        '<main class="study-modes">' +
        '<p class="choose-label">Choose a study mode:</p>' +
        '<button class="btn btn-primary mode-btn" id="mode-tf">&#10003; True / False</button>' +
        '<button class="btn btn-primary mode-btn" id="mode-mc">&#127919; Multiple Choice</button>' +
        '<button class="btn btn-primary mode-btn" id="mode-fb">&#9998; Fill the Blank</button>' +
        '<button class="btn btn-primary mode-btn" id="mode-dd">&#127914; Drag &amp; Drop</button>' +
        '</main></div>'
    );

    document.getElementById('btnBackStudy').addEventListener('click', showLibrary);
    document.getElementById('mode-tf').addEventListener('click', () => startQuiz('true-false'));
    document.getElementById('mode-mc').addEventListener('click', () => startQuiz('multiple-choice'));
    document.getElementById('mode-fb').addEventListener('click', () => startQuiz('fill-blank'));
    document.getElementById('mode-dd').addEventListener('click', () => startQuiz('drag-drop'));
}

// ── Quiz ──────────────────────────────────────────────────────────────────────
function startQuiz(mode) {
    const chik = appState.activeChik;
    if (!chik || chik.terms.length === 0) { alert('This LearnChik has no terms!'); return; }
    appState.currentQuizMode = mode;
    appState.currentQuizIndex = 0;
    appState.score = { correct: 0, total: chik.terms.length };
    appState.shuffledTerms = shuffle([...chik.terms]);
    showQuizScreen();
}

function showQuizScreen() {
    if (appState.currentQuizIndex >= appState.shuffledTerms.length) { showResultsScreen(); return; }
    const term     = appState.shuffledTerms[appState.currentQuizIndex];
    const progress = appState.currentQuizIndex + 1;
    const total    = appState.shuffledTerms.length;
    const pct      = Math.round((progress / total) * 100);
    const chik     = appState.activeChik;

    let questionHtml = '';

    if (appState.currentQuizMode === 'true-false') {
        // Randomly show the real definition (correct answer = True) or a wrong one
        // from another term (correct answer = False). When there is only one term in
        // the set, a wrong definition cannot be found, so we always show the real one.
        const wrongs = appState.activeChik.terms
            .map(t => t.definition)
            .filter(d => d !== term.definition);
        const canShowFalse = wrongs.length > 0;
        const showReal = !canShowFalse || Math.random() < 0.5;
        appState.currentTfAnswer = showReal; // true = correct answer is "True"
        const displayedDef = showReal
            ? term.definition
            : wrongs[Math.floor(Math.random() * wrongs.length)];
        questionHtml =
            '<div class="tf-prompt">' +
            '<p class="tf-definition">' + escapeHtml(displayedDef) + '</p>' +
            '<p class="tf-question">Is this the definition of <strong>' + escapeHtml(term.term) + '</strong>?</p>' +
            '</div>' +
            '<div class="tf-buttons">' +
            '<button class="btn btn-true" id="tfTrue">&#10003; True</button>' +
            '<button class="btn btn-false" id="tfFalse">&#10007; False</button>' +
            '</div>';
    } else if (appState.currentQuizMode === 'multiple-choice') {
        const wrong   = getRandomWrong(term.definition, 3);
        const options = shuffle([term.definition, ...wrong]);
        questionHtml  = '<div class="mc-options">';
        options.forEach((opt, i) => {
            questionHtml += '<button class="btn mc-option" data-answer="' + escapeAttr(opt) + '">' + String.fromCharCode(65 + i) + ': ' + escapeHtml(opt) + '</button>';
        });
        questionHtml += '</div>';
    } else if (appState.currentQuizMode === 'fill-blank') {
        questionHtml =
            '<input type="text" id="answerInput" class="fill-input" placeholder="Type the term..." autocomplete="off" />' +
            '<button class="btn btn-primary" id="btnSubmitFill">Submit</button>';
    } else if (appState.currentQuizMode === 'drag-drop') {
        const defs = shuffle(appState.shuffledTerms.map(t => t.definition));
        questionHtml = '<div id="dragContainer" class="drag-container">';
        defs.forEach(def => {
            questionHtml += '<div class="drag-item" draggable="true" data-def="' + escapeAttr(def) + '">' + escapeHtml(def) + '</div>';
        });
        questionHtml += '</div><div id="dropZone" class="drop-zone">Drop the correct definition here</div>';
    }

    render(
        '<div class="screen quiz-screen">' +
        '<header class="top-bar">' +
        '<button class="btn-icon" id="btnBackQuiz">&#8592; Back</button>' +
        '<div class="top-bar-center">' +
        '<div class="top-bar-title">' + escapeHtml(chik.name) + '</div>' +
        '<div class="top-bar-sub">' + appState.currentQuizMode.replace(/-/g, ' ').toUpperCase() + '</div>' +
        '</div>' +
        '<div class="score-badge">' + appState.score.correct + '/' + total + '</div>' +
        '</header>' +
        '<div class="quiz-body">' +
        '<div class="progress-bar"><div class="progress-fill" style="width:' + pct + '%"></div></div>' +
        '<p class="progress-label">Question ' + progress + ' / ' + total + '</p>' +
        '<div class="term-card-display"><h3>' + escapeHtml(term.term) + '</h3></div>' +
        questionHtml +
        '</div></div>'
    );

    document.getElementById('btnBackQuiz').addEventListener('click', () => showStudyModeSelection(appState.activeChik));

    if (appState.currentQuizMode === 'true-false') {
        document.getElementById('tfTrue').addEventListener('click',  () => checkTrueFalse(true,  term));
        document.getElementById('tfFalse').addEventListener('click', () => checkTrueFalse(false, term));
    } else if (appState.currentQuizMode === 'multiple-choice') {
        document.querySelectorAll('.mc-option').forEach(btn => {
            btn.addEventListener('click', () => checkMultipleChoice(btn.dataset.answer, term.definition));
        });
    } else if (appState.currentQuizMode === 'fill-blank') {
        document.getElementById('btnSubmitFill').addEventListener('click', checkFillBlank);
        document.getElementById('answerInput').addEventListener('keydown', e => { if (e.key === 'Enter') checkFillBlank(); });
    } else if (appState.currentQuizMode === 'drag-drop') {
        setupDragAndDrop(term);
    }
}

// ── Answer checkers ────────────────────────────────────────────────────────────
function checkTrueFalse(userSaidTrue, term) {
    const isCorrect = userSaidTrue === appState.currentTfAnswer;
    if (isCorrect) {
        appState.score.correct++;
        showFeedback('Correct!', '#00ff00');
    } else {
        const correctWord = appState.currentTfAnswer ? 'True' : 'False';
        showFeedback('Incorrect! Answer: ' + correctWord, '#ff3333');
    }
    advance();
}

function checkMultipleChoice(selected, correctDef) {
    if (selected === correctDef) {
        appState.score.correct++;
        showFeedback('Correct!', '#00ff00');
    } else {
        showFeedback('Incorrect!', '#ff3333');
    }
    advance();
}

function checkFillBlank() {
    const input = document.getElementById('answerInput');
    if (!input || !input.value.trim()) { alert('Please type an answer!'); return; }
    const userAns = input.value.trim().toLowerCase();
    const correct = appState.shuffledTerms[appState.currentQuizIndex].term.toLowerCase();
    if (userAns === correct) {
        appState.score.correct++;
        showFeedback('Correct!', '#00ff00');
    } else {
        showFeedback('Incorrect! Answer: ' + appState.shuffledTerms[appState.currentQuizIndex].term, '#ff3333');
    }
    advance();
}

function setupDragAndDrop(term) {
    const dragItems = document.querySelectorAll('.drag-item');
    const dropZone  = document.getElementById('dropZone');
    dragItems.forEach(el => {
        el.addEventListener('dragstart', () => { appState.draggedElement = el; el.style.opacity = '0.5'; });
        el.addEventListener('dragend',   () => { el.style.opacity = '1'; });
    });
    dropZone.addEventListener('dragover',  e => { e.preventDefault(); dropZone.classList.add('drag-over'); });
    dropZone.addEventListener('dragleave', ()  => dropZone.classList.remove('drag-over'));
    dropZone.addEventListener('drop', e => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        if (!appState.draggedElement) return;
        const droppedDef = appState.draggedElement.dataset.def;
        if (droppedDef === term.definition) {
            appState.score.correct++;
            showFeedback('Correct!', '#00ff00');
        } else {
            showFeedback('Incorrect!', '#ff3333');
        }
        advance();
    });
}

function advance() {
    setTimeout(() => { appState.currentQuizIndex++; showQuizScreen(); }, 1600);
}

function showFeedback(message, color) {
    const fb = document.createElement('div');
    fb.className = 'feedback-overlay';
    fb.style.color       = color;
    fb.style.borderColor = color;
    fb.style.boxShadow   = '0 0 30px ' + color;
    fb.textContent = message;
    document.body.appendChild(fb);
    setTimeout(() => fb.remove(), 1600);
}

// ── Results ────────────────────────────────────────────────────────────────────
function showResultsScreen() {
    const { correct, total } = appState.score;
    const pct  = Math.round((correct / total) * 100);
    const msg  = pct === 100 ? 'Perfect!' : pct >= 80 ? 'Great job!' : pct >= 50 ? 'Keep going!' : 'Keep trying!';
    const chik = appState.activeChik;

    render(
        '<div class="screen results-screen">' +
        '<header class="top-bar">' +
        '<button class="btn-icon" id="btnBackResults">&#8592; Back</button>' +
        '<h2 class="top-bar-title">Results</h2>' +
        '<span></span></header>' +
        '<div class="results-body">' +
        '<div class="results-card">' +
        '<div class="results-score">' + correct + '/' + total + '</div>' +
        '<div class="results-pct">' + pct + '%</div>' +
        '<p class="results-msg">' + msg + '</p>' +
        '</div>' +
        '<button class="btn btn-primary"   id="btnPlayAgain">&#128260; Play Again</button>' +
        '<button class="btn btn-secondary" id="btnBackToModes">&#128218; Study Modes</button>' +
        '<button class="btn btn-outline"   id="btnBackToLibrary">&#127968; My LearnChiks</button>' +
        '</div></div>'
    );

    document.getElementById('btnBackResults').addEventListener('click',   () => showStudyModeSelection(chik));
    document.getElementById('btnPlayAgain').addEventListener('click',     () => startQuiz(appState.currentQuizMode));
    document.getElementById('btnBackToModes').addEventListener('click',   () => showStudyModeSelection(chik));
    document.getElementById('btnBackToLibrary').addEventListener('click', showLibrary);
}

// ── Utilities ──────────────────────────────────────────────────────────────────
function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function getRandomWrong(correctDef, count) {
    const all   = appState.activeChik.terms.map(t => t.definition);
    const wrong = all.filter(d => d !== correctDef);
    if (wrong.length === 0) return ['Option A', 'Option B', 'Option C'].slice(0, count);
    if (wrong.length < count) return shuffle([...wrong, 'Option A', 'Option B', 'Option C']).slice(0, count);
    return shuffle(wrong).slice(0, count);
}

// escapeHtml covers both HTML text content and attribute values.
function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// Alias used for attribute values; identical behaviour.
const escapeAttr = escapeHtml;
