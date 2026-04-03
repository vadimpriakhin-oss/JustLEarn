let appState = {
    currentScreen: 'dashboard',
    learnChiks: [],
    currentLearnChikId: null,
    activeChik: null,
    editingChik: null,
    userTerms: [],
    learnChikName: '',
    currentQuizIndex: 0,
    score: { correct: 0, total: 0 },
    currentQuizMode: null,
    shuffledTerms: [],
    currentAnswerId: null,
    currentTfAnswer: null,
    draggedElement: null
};

const DEFAULT_TERMS = [
    { term: 'Photosynthesis', definition: 'Process by which plants convert sunlight into chemical energy' },
    { term: 'Mitochondria',   definition: 'Powerhouse of the cell responsible for energy production' },
    { term: 'Osmosis',        definition: 'Movement of water across a semipermeable membrane' },
    { term: 'Enzyme',         definition: 'Protein that speeds up chemical reactions in cells' },
    { term: 'DNA',            definition: 'Molecule that carries genetic instructions for life' },
];

// ── Bootstrap ─────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    initSplashScreen();
    loadLearnChiks();
    registerServiceWorker();
    showDashboard();
});

function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('service-worker.js')
            .then(() => console.log('Service Worker registered'))
            .catch(err => console.error('Service Worker registration failed:', err));
    }
}

function render(html) {
    document.querySelector('main').innerHTML = html;
}

function initSplashScreen() {
    const splash = document.getElementById('splash-screen');
    if (!splash) return;
    splash.classList.add('fly-away');
    setTimeout(() => { splash.style.display = 'none'; }, 3500);
}

// ── LearnChik Utilities ─────────────────────────────────────────────────────

function generateLearnChikId() {
    return Date.now() + '-' + Math.random().toString(36).slice(2, 11);
}

function loadLearnChiks() {
    try {
        const stored = localStorage.getItem('justlearnChiks');
        appState.learnChiks = stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Error loading LearnChiks:', error);
        appState.learnChiks = [];
    }
}

function saveLearnChiks() {
    try {
        localStorage.setItem('justlearnChiks', JSON.stringify(appState.learnChiks));
    } catch (error) {
        console.error('Error saving LearnChiks:', error);
        alert('Failed to save LearnChiks');
    }
}

function saveNewLearnChik() {
    const name = appState.learnChikName.trim();
    if (!name) {
        alert('Please enter a name for your LearnChik!');
        return false;
    }
    const terms = appState.userTerms.filter(t => t.term.trim() && t.definition.trim());
    if (terms.length === 0) {
        alert('Add at least one term!');
        return false;
    }
    const learnChik = {
        id: generateLearnChikId(),
        name: name,
        createdAt: new Date().toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'medium' }),
        terms: terms
    };
    appState.learnChiks.push(learnChik);
    saveLearnChiks();
    return true;
}

function deleteLearnChik(id) {
    if (!confirm('Delete this LearnChik? This cannot be undone.')) return;
    appState.learnChiks = appState.learnChiks.filter(lc => lc.id !== id);
    saveLearnChiks();
    showMyLearnChiks();
}

function selectLearnChik(id) {
    const learnChik = appState.learnChiks.find(lc => lc.id === id);
    if (!learnChik) return;
    appState.currentLearnChikId = id;
    appState.userTerms = learnChik.terms;
    showStudyModeSelection();
}

// ── Screens ─────────────────────────────────────────────────────────────────

function showDashboard() {
    appState.currentScreen = 'dashboard';
    render(
        '<div class="screen">' +
        '<div class="app-header">' +
        '<div class="logo">🧠</div>' +
        '<div class="header-text"><h1>JustLEarn</h1><p>Your Study Sets</p></div>' +
        '</div>' +
        '<div class="dashboard-main">' +
        '<button class="btn btn-danger btn-large" onclick="showCreateLearnChikScreen()">🆕 Create New LearnChik</button>' +
        '<button class="btn btn-primary btn-large" onclick="showMyLearnChiks()">📚 My LearnChiks</button>' +
        '</div>' +
        '</div>'
    );
}

function showCreateLearnChikScreen() {
    appState.currentScreen = 'create';
    appState.editingChik = { name: '', terms: [] };
    render(
        '<div class="screen">' +
        '<header class="top-bar">' +
        '<button class="btn-icon" id="btnBackCreate">&#8592; Back</button>' +
        '<h2 class="top-bar-title">🆕 Create LearnChik</h2>' +
        '<span></span>' +
        '</header>' +
        '<div class="create-body">' +
        '<input id="chikName" class="chik-name-input" type="text" placeholder="e.g., Biology 101" autocomplete="off" />' +
        '<div id="termsContainer"></div>' +
        '</div>' +
        '<div class="bottom-bar">' +
        '<button id="btnAddTerm" class="btn btn-secondary">+ Add Term</button>' +
        '<button id="btnSaveChik" class="btn btn-primary">💾 Save</button>' +
        '<button id="btnCancelCreate" class="btn btn-outline">✖ Cancel</button>' +
        '</div>' +
        '</div>'
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

function showMyLearnChiks() {
    appState.currentScreen = 'library';

    let cardsHtml = '';
    if (appState.learnChiks.length === 0) {
        cardsHtml = '<div class="empty-state">No LearnChiks yet.<br>Create your first one!</div>';
    } else {
        cardsHtml = '<div class="chik-grid">';
        appState.learnChiks.forEach(lc => {
            const id = lc.id;
            cardsHtml +=
                '<div class="chik-card" onclick="selectLearnChik(\'' + id + '\')">' +
                '<div class="chik-card-body">' +
                '<div class="chik-name">📘 ' + escapeHtml(lc.name) + '</div>' +
                '<div class="chik-meta">' +
                '<span>📊 ' + lc.terms.length + ' term' + (lc.terms.length !== 1 ? 's' : '') + '</span>' +
                '<span>📅 ' + escapeHtml(lc.createdAt) + '</span>' +
                '</div>' +
                '</div>' +
                '<button class="btn btn-danger btn-sm" onclick="event.stopPropagation(); deleteLearnChik(\'' + id + '\')">🗑️ Delete</button>' +
                '</div>';
        });
        cardsHtml += '</div>';
    }

    render(
        '<div class="screen">' +
        '<header class="top-bar">' +
        '<button class="btn-icon" onclick="showDashboard()">&#8592; Back</button>' +
        '<h2 class="top-bar-title">📚 My LearnChiks</h2>' +
        '<span></span>' +
        '</header>' +
        cardsHtml +
        '</div>'
    );
}

function showLibrary() { showMyLearnChiks(); }

function showStudyModeSelection() {
    appState.currentScreen = 'study-modes';
    const learnChik = appState.learnChiks.find(lc => lc.id === appState.currentLearnChikId);
    const name = learnChik ? learnChik.name : 'Unknown';
    const count = appState.userTerms.length;
    render(
        '<div class="screen">' +
        '<header class="top-bar">' +
        '<button class="btn-icon" onclick="showMyLearnChiks()">&#8592; Back</button>' +
        '<h2 class="top-bar-title">📘 ' + escapeHtml(name) + '</h2>' +
        '<span class="chik-meta">' + count + ' term' + (count !== 1 ? 's' : '') + '</span>' +
        '</header>' +
        '<div class="study-modes">' +
        '<p class="choose-label">Choose a learning mode:</p>' +
        '<button class="btn btn-primary mode-btn" onclick="startQuiz(\'true-false\')">✅ True / False</button>' +
        '<button class="btn btn-primary mode-btn" onclick="startQuiz(\'multiple-choice\')">🎯 Multiple Choice</button>' +
        '<button class="btn btn-primary mode-btn" onclick="startQuiz(\'fill-blank\')">✏️ Fill in the Blank</button>' +
        '<button class="btn btn-primary mode-btn" onclick="startQuiz(\'drag-drop\')">🎪 Drag &amp; Drop</button>' +
        '</div>' +
        '</div>'
    );
}

function saveLearnChikAndReturn() {
    const nameInput = document.getElementById('learnChikNameInput');
    if (nameInput) appState.learnChikName = nameInput.value;
    appState.userTerms = appState.userTerms.filter(t => t.term.trim() && t.definition.trim());
    if (saveNewLearnChik()) {
        alert('LearnChik saved!');
        showDashboard();
    }
}

function saveChik() {
    const name = appState.editingChik.name.trim();
    if (!name) { alert('Please enter a name!'); return; }
    const terms = appState.editingChik.terms.filter(t => t.term.trim() && t.definition.trim());
    if (terms.length === 0) { alert('Please add at least one term!'); return; }
    const learnChik = {
        id: generateLearnChikId(),
        name,
        createdAt: new Date().toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'medium' }),
        terms
    };
    appState.learnChiks.push(learnChik);
    saveLearnChiks();
    alert('LearnChik saved!');
    showDashboard();
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

function startQuiz(mode) {
    const chik = appState.learnChiks.find(lc => lc.id === appState.currentLearnChikId);
    if (!chik || chik.terms.length === 0) {
        alert('No terms in this LearnChik!');
        return;
    }
    appState.activeChik = chik;
    appState.currentQuizMode = mode;
    appState.currentQuizIndex = 0;
    appState.score = { correct: 0, total: chik.terms.length };
    appState.shuffledTerms = shuffle([...chik.terms]);
    showQuizScreen();
}

function showQuizScreen() {
    if (appState.currentQuizIndex >= appState.shuffledTerms.length) {
        showResultsScreen();
        return;
    }
    const term     = appState.shuffledTerms[appState.currentQuizIndex];
    const chik     = appState.activeChik;
    const progress = appState.currentQuizIndex + 1;
    const total    = appState.shuffledTerms.length;
    const pct      = Math.round((progress / total) * 100);

    let questionHtml = '';

    if (appState.currentQuizMode === 'true-false') {
        const wrongs = chik.terms
            .map(t => t.definition)
            .filter(d => d !== term.definition);
        const canShowFalse = wrongs.length > 0;
        const showReal = !canShowFalse || Math.random() < 0.5;
        appState.currentTfAnswer = showReal;
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

    document.getElementById('btnBackQuiz').addEventListener('click', () => showStudyModeSelection());

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
    const pct = Math.round((correct / total) * 100);
    const msg = pct === 100 ? 'Perfect!' : pct >= 80 ? 'Great job!' : pct >= 50 ? 'Keep going!' : 'Keep trying!';

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

    document.getElementById('btnBackResults').addEventListener('click',   () => showStudyModeSelection());
    document.getElementById('btnPlayAgain').addEventListener('click',     () => startQuiz(appState.currentQuizMode));
    document.getElementById('btnBackToModes').addEventListener('click',   () => showStudyModeSelection());
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
    const chik = appState.activeChik;
    if (!chik) return ['Option A', 'Option B', 'Option C'].slice(0, count);
    const all   = chik.terms.map(t => t.definition);
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
