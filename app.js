let appState = {
    currentScreen: 'dashboard',
    learnChiks: [],
    currentLearnChikId: null,
    userTerms: [],
    learnChikName: '',
    currentQuizIndex: 0,
    score: { correct: 0, total: 0 },
    currentQuizMode: null,
    shuffledTerms: [],
    currentAnswerId: null,
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
    document.body.style.backgroundColor = '#0a0a0a';
    loadLearnChiks();
    showDashboard();
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
    const main = document.querySelector('main');
    main.style.backgroundColor = '#0a0a0a';
    main.innerHTML = `<div style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; padding: 20px;">
    <h2 style="font-size: 48px; margin-bottom: 15px; color: #00ffcc; text-shadow: 0 0 20px #00ffcc; text-align: center;">🧠 JustLEarn</h2>
    <p style="margin-bottom: 40px; color: #aaa; font-size: 16px; text-align: center;">Your Study Sets</p>
    <div style="display: flex; flex-direction: column; gap: 15px; width: 100%; max-width: 400px;">
        <button onclick="showCreateLearnChikScreen()" style="background: linear-gradient(135deg, #ff007f, #ff4466); color: #fff; border: none; padding: 18px; border-radius: 10px; cursor: pointer; font-weight: bold; font-size: 16px;">🆕 Create New LearnChik</button>
        <button onclick="showMyLearnChiks()" style="background: linear-gradient(135deg, #00ffcc, #00aa88); color: #000; border: none; padding: 18px; border-radius: 10px; cursor: pointer; font-weight: bold; font-size: 16px;">📚 My LearnChiks</button>
    </div>
</div>`;
}

function showCreateLearnChikScreen() {
    appState.currentScreen = 'create';
    appState.userTerms = [];
    appState.learnChikName = '';
    const main = document.querySelector('main');
    main.style.backgroundColor = '#0a0a0a';
    main.innerHTML = `<div style="padding: 20px; max-width: 600px; margin: 0 auto; min-height: 100vh;">
    <h2 style="text-align: center; margin-bottom: 25px; color: #00ffcc;">🆕 Create LearnChik</h2>
    <input id="learnChikNameInput" type="text" placeholder="e.g., Biology 101" value=""
        style="width: 100%; background: #1a1a2e; color: #00ffcc; border: 2px solid #ff007f; padding: 14px; border-radius: 8px; margin-bottom: 25px; font-size: 16px; box-sizing: border-box;"
        oninput="appState.learnChikName = this.value" />
    <div id="termsContainer"></div>
    <div style="display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; margin-bottom: 20px;">
        <button onclick="addTermField()" style="background: #00ffcc; color: #000; border: none; padding: 12px 20px; border-radius: 8px; cursor: pointer; font-weight: bold;">+ Add Term</button>
        <button onclick="saveLearnChikAndReturn()" style="background: #00aa00; color: #fff; border: none; padding: 12px 20px; border-radius: 8px; cursor: pointer; font-weight: bold;">💾 Save LearnChik</button>
        <button onclick="showDashboard()" style="background: #555; color: #fff; border: none; padding: 12px 20px; border-radius: 8px; cursor: pointer; font-weight: bold;">✖ Cancel</button>
    </div>
    <div id="termsList"></div>
</div>`;
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
    const main = document.querySelector('main');
    main.style.backgroundColor = '#0a0a0a';

    let cardsHtml = '';
    if (appState.learnChiks.length === 0) {
        cardsHtml = `<p style="color: #888; text-align: center; margin-top: 40px; font-size: 16px;">No LearnChiks yet. Create your first one!</p>`;
    } else {
        cardsHtml = `<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px;">`;
        appState.learnChiks.forEach(lc => {
            const id = lc.id;
            cardsHtml += `<div onclick="selectLearnChik('${id}')"
                style="background: #1a1a2e; border: 2px solid #00ffcc; border-radius: 10px; padding: 20px; cursor: pointer; transition: box-shadow 0.2s; position: relative;"
                onmouseover="this.style.boxShadow='0 0 20px #00ffcc44'" onmouseout="this.style.boxShadow='none'">
                <div style="font-size: 20px; font-weight: bold; color: #00ffcc; margin-bottom: 8px;">📘 ${escapeHtml(lc.name)}</div>
                <div style="color: #aaa; font-size: 14px; margin-bottom: 4px;">📊 ${lc.terms.length} term${lc.terms.length !== 1 ? 's' : ''}</div>
                <div style="color: #666; font-size: 12px; margin-bottom: 12px;">📅 ${escapeHtml(lc.createdAt)}</div>
                <button onclick="event.stopPropagation(); deleteLearnChik('${id}')"
                    style="background: #ff3333; color: #fff; border: none; padding: 6px 14px; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: bold;">🗑️ Delete</button>
            </div>`;
        });
        cardsHtml += `</div>`;
    }

    main.innerHTML = `<div style="padding: 20px; max-width: 900px; margin: 0 auto; min-height: 100vh;">
    <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 30px;">
        <button onclick="showDashboard()" style="background: #333; color: #fff; border: none; padding: 10px 16px; border-radius: 8px; cursor: pointer; font-weight: bold;">← Back</button>
        <h2 style="margin: 0; color: #00ffcc;">📚 My LearnChiks</h2>
    </div>
    ${cardsHtml}
</div>`;
}

function showStudyModeSelection() {
    appState.currentScreen = 'study-modes';
    const learnChik = appState.learnChiks.find(lc => lc.id === appState.currentLearnChikId);
    const name = learnChik ? learnChik.name : 'Unknown';
    const count = appState.userTerms.length;
    const main = document.querySelector('main');
    main.style.backgroundColor = '#0a0a0a';
    main.innerHTML = `<div style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; padding: 20px;">
    <div style="width: 100%; max-width: 400px; background: #1a1a2e; border: 1px solid #00ffcc44; border-radius: 10px; padding: 14px 20px; margin-bottom: 30px; text-align: center;">
        <div style="color: #00ffcc; font-size: 18px; font-weight: bold;">📘 ${escapeHtml(name)}</div>
        <div style="color: #aaa; font-size: 13px; margin-top: 4px;">📊 ${count} term${count !== 1 ? 's' : ''}</div>
    </div>
    <p style="margin-bottom: 20px; color: #fff; font-size: 16px;">Choose a learning mode:</p>
    <div style="display: flex; flex-direction: column; gap: 15px; width: 100%; max-width: 400px;">
        <button onclick="startQuiz('true-false')" style="background: linear-gradient(135deg, #00ffcc, #00aa88); color: #000; border: none; padding: 15px; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 15px;">✅ True/False</button>
        <button onclick="startQuiz('multiple-choice')" style="background: linear-gradient(135deg, #00ffcc, #00aa88); color: #000; border: none; padding: 15px; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 15px;">🎯 Multiple Choice</button>
        <button onclick="startQuiz('fill-blank')" style="background: linear-gradient(135deg, #00ffcc, #00aa88); color: #000; border: none; padding: 15px; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 15px;">✏️ Fill the Blank</button>
        <button onclick="startQuiz('drag-drop')" style="background: linear-gradient(135deg, #00ffcc, #00aa88); color: #000; border: none; padding: 15px; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 15px;">🎪 Drag & Drop</button>
        <button onclick="showMyLearnChiks()" style="background: #333; color: #fff; border: none; padding: 12px; border-radius: 8px; cursor: pointer; font-weight: bold;">← Back to My LearnChiks</button>
    </div>
</div>`;
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

function renderTermsList() {
    const list = document.getElementById('termsList');
    if (!list) return;
    if (appState.userTerms.length === 0) {
        list.innerHTML = '<p style="color: #888; text-align: center;">No terms yet</p>';
        return;
    }
    let html = `<h3 style="color: #00ffcc; border-bottom: 2px solid #00ffcc; padding-bottom: 10px;">📚 Terms: ${appState.userTerms.length}</h3><ul style="list-style: none; padding: 0;">`;
    appState.userTerms.forEach((item, i) => {
        html += `<li style="background: #1a1a2e; padding: 12px; margin: 8px 0; border-left: 4px solid #ff007f; border-radius: 4px; color: #fff;"><strong style="color: #00ffcc;">${i+1}. ${escapeHtml(item.term)}</strong><br/><span style="color: #aaa; font-size: 12px;">${escapeHtml(item.definition)}</span></li>`;
    });
    list.innerHTML = html + '</ul>';
}

function startQuiz(mode) {
    if (appState.userTerms.length === 0) {
        alert('No terms in this LearnChik!');
        return;
    }
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

    content += `<button onclick="showStudyModeSelection()" style="width: 100%; margin-top: 20px; background: #333; color: #fff; border: none; padding: 12px; border-radius: 8px; cursor: pointer; font-weight: bold;">← Back to Modes</button></div>`;
    document.querySelector('main').style.backgroundColor = '#0a0a0a';
    document.querySelector('main').innerHTML = content;
    if (appState.currentQuizMode === 'drag-drop') {
        setupDragAndDrop();
    }
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
    const percentage = Math.round((appState.score.correct / appState.score.total) * 100);
    const message = percentage === 100 ? 'Perfect!' : percentage >= 80 ? 'Great!' : 'Keep trying!';
    const main = document.querySelector('main');
    main.style.backgroundColor = '#0a0a0a';
    main.innerHTML = `<div style="padding: 40px 20px; max-width: 600px; margin: 0 auto; text-align: center; display: flex; flex-direction: column; justify-content: center; min-height: 100vh;">
        <h2 style="color: #00ffcc;">Results</h2>
        <div style="background: #1a1a2e; border: 2px solid #00ffcc; border-radius: 8px; padding: 30px; margin-bottom: 20px;">
            <div style="font-size: 60px; color: #00ffcc; font-weight: bold; margin-bottom: 10px;">${appState.score.correct}/${appState.score.total}</div>
            <div style="font-size: 36px; color: #ff007f; font-weight: bold; margin-bottom: 20px;">${percentage}%</div>
            <p style="color: #00ffcc; font-size: 20px; margin: 0;">${message}</p>
        </div>
        <button onclick="startQuiz('${appState.currentQuizMode}')" style="width: 100%; background: #00ffcc; color: #000; font-weight: bold; border: none; padding: 12px; border-radius: 8px; cursor: pointer; margin-bottom: 10px;">Play Again</button>
        <button onclick="showStudyModeSelection()" style="width: 100%; background: #333; color: #fff; border: none; padding: 12px; border-radius: 8px; cursor: pointer; font-weight: bold;">← Back to Modes</button>
    </div>`;
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
