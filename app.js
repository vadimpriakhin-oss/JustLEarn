/* ═══════════════════════════════════════════════════════════════
   JustLEarn – Quizlet-like App
   Vanilla JS, no dependencies
═══════════════════════════════════════════════════════════════ */

const App = (() => {
    'use strict';

    // ─── Default terms (demo data) ──────────────────────────────
    const DEFAULT_TERMS = [
        { term: 'Photosynthesis', definition: 'Process by which plants convert sunlight into food' },
        { term: 'Gravity',        definition: 'Force of attraction between two masses' },
        { term: 'Mitosis',        definition: 'Cell division producing two identical daughter cells' },
        { term: 'Democracy',      definition: 'System of government by the population' },
        { term: 'Atom',           definition: 'Smallest unit of a chemical element' },
        { term: 'Metaphor',       definition: 'Figure of speech comparing two unlike things' },
    ];

    // ─── State ──────────────────────────────────────────────────
    let terms       = [];        // [{term, definition}, …]
    let inputRows   = [];        // DOM rows in create screen
    let currentMode = null;      // 'truefalse' | 'multiplechoice' | 'fillinblank' | 'dragdrop'
    let queue       = [];        // shuffled copy of terms for current game
    let currentIdx  = 0;
    let score       = 0;
    let total       = 0;
    let awaitingNext = false;    // debounce between questions

    // ─── Drag & Drop state ──────────────────────────────────────
    let ddDragValue = null;
    let ddDragEl    = null;

    // ─── LocalStorage ───────────────────────────────────────────
    const LS_KEY = 'justlearn_terms';

    function loadTerms() {
        try {
            const raw = localStorage.getItem(LS_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    terms = parsed;
                    return;
                }
            }
        } catch (_) {}
        terms = DEFAULT_TERMS.slice();
    }

    function persistTerms() {
        localStorage.setItem(LS_KEY, JSON.stringify(terms));
    }

    // ─── Navigation ─────────────────────────────────────────────
    function goTo(screenId) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(screenId).classList.add('active');
        if (screenId === 'screen-create') renderCreateScreen();
        if (screenId === 'screen-home')   renderHomeCount();
    }

    function goHome() {
        goTo('screen-home');
    }

    function renderHomeCount() {
        const el = document.getElementById('home-term-count');
        if (el) el.textContent = `${terms.length} term${terms.length !== 1 ? 's' : ''} saved`;
    }

    // ─── CREATE TERMS SCREEN ────────────────────────────────────
    function renderCreateScreen() {
        renderInputRows();
        renderSavedList();
    }

    function renderInputRows() {
        const container = document.getElementById('terms-input-list');
        container.innerHTML = '';
        inputRows = [];
        // Always show at least 1 empty row
        addInputRow(container, '', '');
    }

    function addInputRow(container, termVal, defVal) {
        const rowNum = container.children.length + 1;
        const row = document.createElement('div');
        row.className = 'term-input-row';
        row.innerHTML = `
            <span class="row-num">${rowNum}</span>
            <input type="text" class="term-field" placeholder="Term" value="${escHtml(termVal)}" autocomplete="off">
            <input type="text" class="def-field"  placeholder="Definition" value="${escHtml(defVal)}" autocomplete="off">
            <button class="del-btn" title="Remove row">✕</button>
        `;

        const termInput = row.querySelector('.term-field');
        const defInput  = row.querySelector('.def-field');
        const delBtn    = row.querySelector('.del-btn');

        // Enter on either field: save row, add new empty row
        [termInput, defInput].forEach(inp => {
            inp.addEventListener('keydown', e => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    commitRow(row);
                    const newRow = addInputRow(container, '', '');
                    newRow.querySelector('.term-field').focus();
                    updateRowNumbers(container);
                }
            });
        });

        delBtn.addEventListener('click', () => {
            row.remove();
            updateRowNumbers(container);
        });

        container.appendChild(row);
        inputRows.push(row);
        return row;
    }

    function updateRowNumbers(container) {
        container.querySelectorAll('.row-num').forEach((el, i) => { el.textContent = i + 1; });
    }

    function commitRow(row) {
        // nothing persistent yet – rows are read on Save
    }

    function saveTerms() {
        const container = document.getElementById('terms-input-list');
        const rows = container.querySelectorAll('.term-input-row');
        const newTerms = [];
        rows.forEach(row => {
            const t = row.querySelector('.term-field').value.trim();
            const d = row.querySelector('.def-field').value.trim();
            if (t && d) newTerms.push({ term: t, definition: d });
        });

        if (newTerms.length === 0) {
            flashConfirmation('⚠️ No complete terms to save (fill both fields).', false);
            return;
        }

        terms = newTerms;
        persistTerms();
        flashConfirmation(`✅ ${terms.length} term${terms.length !== 1 ? 's' : ''} saved!`, true);
        renderSavedList();
        renderHomeCount();
    }

    function flashConfirmation(msg, success) {
        const el = document.getElementById('save-confirmation');
        el.textContent = msg;
        el.className = 'save-confirmation' + (success ? '' : ' warn');
        el.classList.remove('hidden');
        clearTimeout(el._timeout);
        el._timeout = setTimeout(() => el.classList.add('hidden'), 3000);
    }

    function renderSavedList() {
        const container = document.getElementById('saved-terms-list');
        const countEl   = document.getElementById('saved-count');
        countEl.textContent = terms.length;
        container.innerHTML = '';

        terms.forEach((item, idx) => {
            const card = document.createElement('div');
            card.className = 'saved-term-card';
            card.innerHTML = `
                <span class="term-text">${escHtml(item.term)}</span>
                <span class="def-text">${escHtml(item.definition)}</span>
                <button class="edit-btn" title="Edit">✏️</button>
                <button class="remove-btn" title="Remove">🗑️</button>
            `;
            card.querySelector('.remove-btn').addEventListener('click', () => removeTerm(idx));
            card.querySelector('.edit-btn').addEventListener('click', () => editTerm(idx, card, item));
            container.appendChild(card);
        });
    }

    function removeTerm(idx) {
        terms.splice(idx, 1);
        persistTerms();
        renderSavedList();
        renderHomeCount();
    }

    function editTerm(idx, card, item) {
        card.innerHTML = `
            <input class="term-field" value="${escHtml(item.term)}" style="flex:1">
            <input class="def-field"  value="${escHtml(item.definition)}" style="flex:2">
            <button class="btn btn-save" style="padding:8px 12px;font-size:0.8rem;">Save</button>
        `;
        card.querySelector('.btn-save').addEventListener('click', () => {
            const t = card.querySelector('.term-field').value.trim();
            const d = card.querySelector('.def-field').value.trim();
            if (t && d) {
                terms[idx] = { term: t, definition: d };
                persistTerms();
                renderSavedList();
                renderHomeCount();
            }
        });
    }

    // ─── Toast notification ──────────────────────────────────
    function showToast(msg, warn) {
        const el = document.getElementById('toast');
        el.textContent = msg;
        el.className = 'toast' + (warn ? ' warn' : '');
        clearTimeout(el._t);
        el._t = setTimeout(() => el.classList.add('hidden'), 3200);
    }

    // ─── GAME: Start ────────────────────────────────────────────
    function startGame(mode) {
        if (terms.length < 2) {
            showToast('⚠️ Please create at least 2 terms before playing!', true);
            return;
        }

        currentMode = mode;
        queue = shuffle(terms.slice());
        currentIdx = 0;
        score = 0;
        total = terms.length;
        awaitingNext = false;

        // Set title
        const titles = {
            truefalse:      '✓✗ True / False',
            multiplechoice: '◉ Multiple Choice',
            fillinblank:    '✍️ Fill in the Blank',
            dragdrop:       '⇄ Drag & Drop',
        };
        document.getElementById('game-mode-title').textContent = titles[mode];

        // Hide all game areas, show the right one
        document.querySelectorAll('.game-area').forEach(a => a.classList.add('hidden'));
        document.getElementById(`game-${mode}`).classList.remove('hidden');

        updateScoreDisplay();
        updateProgressBar();
        goTo('screen-game');
        renderQuestion();
    }

    function renderQuestion() {
        if (currentIdx >= queue.length) {
            showResults();
            return;
        }
        awaitingNext = false;
        const item = queue[currentIdx];
        updateProgressBar();
        updateScoreDisplay();

        const handlers = {
            truefalse:      renderTrueFalse,
            multiplechoice: renderMultipleChoice,
            fillinblank:    renderFillInBlank,
            dragdrop:       renderDragDrop,
        };
        handlers[currentMode](item);
    }

    // ─── TRUE / FALSE ────────────────────────────────────────────
    function renderTrueFalse(item) {
        hideFeedback('tf-feedback');
        document.getElementById('tf-term').textContent = item.term;

        // 50% chance show correct definition, 50% show a wrong one
        const showCorrect = Math.random() > 0.5;
        const displayed   = showCorrect
            ? item.definition
            : getWrongDefinition(item);

        document.getElementById('tf-definition').textContent = displayed;
        document.getElementById('tf-definition').dataset.correct = showCorrect ? 'true' : 'false';

        // Re-enable buttons
        document.querySelectorAll('.btn-true, .btn-false').forEach(b => b.disabled = false);
    }

    function tfAnswer(userSaysTrue) {
        if (awaitingNext) return;
        const isCorrect = document.getElementById('tf-definition').dataset.correct === 'true';
        const correct   = userSaysTrue === isCorrect;
        if (correct) score++;
        showFeedback('tf-feedback', correct,
            correct
                ? '✅ Correct!'
                : `❌ Wrong! The definition was ${isCorrect ? 'correct' : 'incorrect'}.`
        );
        document.querySelectorAll('.btn-true, .btn-false').forEach(b => b.disabled = true);
        awaitingNext = true;
        setTimeout(next, 1600);
    }

    // ─── MULTIPLE CHOICE ─────────────────────────────────────────
    function renderMultipleChoice(item) {
        hideFeedback('mc-feedback');
        document.getElementById('mc-term').textContent = item.term;

        const options = buildOptions(item, 4);
        const container = document.getElementById('mc-options');
        container.innerHTML = '';
        shuffle(options).forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'mc-option';
            btn.textContent = opt;
            btn.addEventListener('click', () => mcAnswer(btn, opt, item.definition));
            container.appendChild(btn);
        });
    }

    function mcAnswer(btn, chosen, correctDef) {
        if (awaitingNext) return;
        const allBtns = document.querySelectorAll('.mc-option');
        allBtns.forEach(b => b.disabled = true);

        const correct = chosen === correctDef;
        if (correct) {
            btn.classList.add('correct');
            score++;
        } else {
            btn.classList.add('wrong');
            // Highlight correct answer
            allBtns.forEach(b => {
                if (b.textContent === correctDef) b.classList.add('correct');
            });
        }
        showFeedback('mc-feedback', correct, correct ? '✅ Correct!' : `❌ Wrong! Correct: "${correctDef}"`);
        awaitingNext = true;
        setTimeout(next, 1800);
    }

    // ─── FILL IN THE BLANK ───────────────────────────────────────
    function renderFillInBlank(item) {
        hideFeedback('fib-feedback');
        document.getElementById('fib-term').textContent = item.term;
        const input = document.getElementById('fib-input');
        input.value = '';
        input.disabled = false;
        input.focus();

        input.onkeydown = e => { if (e.key === 'Enter') fibSubmit(); };
    }

    function fibSubmit() {
        if (awaitingNext) return;
        const item  = queue[currentIdx];
        const input = document.getElementById('fib-input');
        const raw   = input.value.trim();
        if (!raw) return;

        const correct = raw.toLowerCase() === item.definition.toLowerCase();
        if (correct) score++;
        input.disabled = true;
        showFeedback('fib-feedback', correct,
            correct ? '✅ Correct!' : `❌ Wrong! Answer: "${item.definition}"`
        );
        awaitingNext = true;
        setTimeout(next, 1800);
    }

    // ─── DRAG & DROP ─────────────────────────────────────────────
    function renderDragDrop(item) {
        hideFeedback('dd-feedback');
        document.getElementById('dd-term').textContent = item.term;

        const dropZone = document.getElementById('dd-drop-zone');
        dropZone.textContent = 'Drag here';
        dropZone.className = 'dd-drop-zone';
        dropZone.dataset.answer = '';
        ddDragValue = null;
        ddDragEl    = null;

        const options = buildOptions(item, 4);
        const container = document.getElementById('dd-options');
        container.innerHTML = '';

        shuffle(options).forEach(opt => {
            const chip = createDragChip(opt, item.definition);
            container.appendChild(chip);
        });

        // Drop zone highlight on drag over
        dropZone.addEventListener('dragenter', () => dropZone.classList.add('over'));
        dropZone.addEventListener('dragleave', () => dropZone.classList.remove('over'));
    }

    function createDragChip(text, correctDef) {
        const chip = document.createElement('div');
        chip.className = 'dd-chip';
        chip.textContent = text;
        chip.draggable = true;
        chip.dataset.value = text;

        // Desktop drag
        chip.addEventListener('dragstart', e => {
            ddDragValue = text;
            ddDragEl    = chip;
            chip.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', text);
        });
        chip.addEventListener('dragend', () => chip.classList.remove('dragging'));

        // Touch drag fallback
        chip.addEventListener('touchstart', touchStart, { passive: true });
        chip.addEventListener('touchmove',  touchMove,  { passive: false });
        chip.addEventListener('touchend',   touchEnd,   { passive: true });

        return chip;
    }

    // ── Touch drag helpers ──
    let _touchClone  = null;
    let _touchOrigin = null;

    function touchStart(e) {
        const chip = e.currentTarget;
        ddDragValue = chip.dataset.value;
        ddDragEl    = chip;
        _touchOrigin = chip;

        _touchClone = chip.cloneNode(true);
        _touchClone.style.position   = 'fixed';
        _touchClone.style.pointerEvents = 'none';
        _touchClone.style.opacity    = '0.8';
        _touchClone.style.zIndex     = '9999';
        _touchClone.style.transform  = 'scale(1.05)';
        document.body.appendChild(_touchClone);
        _moveTouchClone(e.touches[0]);
    }

    function touchMove(e) {
        e.preventDefault();
        _moveTouchClone(e.touches[0]);
        const dropZone = document.getElementById('dd-drop-zone');
        const rect = dropZone.getBoundingClientRect();
        const t = e.touches[0];
        const over = t.clientX >= rect.left && t.clientX <= rect.right &&
                     t.clientY >= rect.top  && t.clientY <= rect.bottom;
        dropZone.classList.toggle('over', over);
    }

    function touchEnd(e) {
        if (_touchClone) { _touchClone.remove(); _touchClone = null; }
        const dropZone = document.getElementById('dd-drop-zone');
        dropZone.classList.remove('over');

        const rect = dropZone.getBoundingClientRect();
        const t = e.changedTouches[0];
        const inZone = t.clientX >= rect.left && t.clientX <= rect.right &&
                       t.clientY >= rect.top  && t.clientY <= rect.bottom;
        if (inZone && ddDragValue) ddDrop(null, ddDragValue);
    }

    function _moveTouchClone(touch) {
        if (!_touchClone) return;
        _touchClone.style.left = (touch.clientX - 60) + 'px';
        _touchClone.style.top  = (touch.clientY - 24) + 'px';
    }

    function ddDrop(event, forcedValue) {
        if (awaitingNext) return;
        const value = forcedValue || (event && event.dataTransfer.getData('text/plain')) || ddDragValue;
        if (!value) return;

        const item     = queue[currentIdx];
        const dropZone = document.getElementById('dd-drop-zone');
        dropZone.classList.remove('over');
        dropZone.textContent = value;
        dropZone.classList.add('filled');

        const correct = value === item.definition;
        if (correct) score++;

        // Disable chips
        document.querySelectorAll('.dd-chip').forEach(c => {
            c.draggable = false;
            c.style.cursor = 'default';
        });

        showFeedback('dd-feedback', correct,
            correct ? '✅ Correct!' : `❌ Wrong! Correct answer: "${item.definition}"`
        );
        awaitingNext = true;
        setTimeout(next, 1800);
    }

    // ─── Game Utilities ──────────────────────────────────────────
    function next() {
        currentIdx++;
        renderQuestion();
    }

    function showFeedback(id, correct, msg) {
        const el = document.getElementById(id);
        el.textContent = msg;
        el.className = `feedback ${correct ? 'correct' : 'wrong'}`;
        el.classList.remove('hidden');
    }

    function hideFeedback(id) {
        const el = document.getElementById(id);
        el.classList.add('hidden');
        el.textContent = '';
        el.className = 'feedback hidden';
    }

    function updateScoreDisplay() {
        document.getElementById('game-score').textContent = `${score} / ${total}`;
    }

    function updateProgressBar() {
        const pct = total > 0 ? (currentIdx / total) * 100 : 0;
        document.getElementById('progress-bar').style.width = pct + '%';
    }

    /** Build an array of `count` options that includes the correct one */
    function buildOptions(item, count) {
        const correct = item.definition;
        const pool = terms
            .filter(t => t.definition !== correct)
            .map(t => t.definition);
        shuffle(pool);
        const opts = pool.slice(0, count - 1);
        opts.push(correct);
        return opts;
    }

    /** Return a definition that is NOT the correct one for item */
    function getWrongDefinition(item) {
        const others = terms.filter(t => t.definition !== item.definition);
        if (others.length === 0) return item.definition; // fallback
        return others[Math.floor(Math.random() * others.length)].definition;
    }

    // ─── Results ─────────────────────────────────────────────────
    function showResults() {
        updateProgressBar(); // 100%
        document.getElementById('progress-bar').style.width = '100%';

        const pct = Math.round((score / total) * 100);
        document.getElementById('results-score').textContent = `${score} / ${total}  (${pct}%)`;
        document.getElementById('results-message').textContent =
            pct === 100 ? '🎉 Perfect score! Amazing!' :
            pct >= 80   ? '💪 Great job! Almost perfect.' :
            pct >= 60   ? '👍 Good effort! Keep practising.' :
                          '📚 Keep studying – you\'ll get it!';

        goTo('screen-results');
    }

    function playAgain() {
        startGame(currentMode);
    }

    // ─── Helpers ─────────────────────────────────────────────────
    function shuffle(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    function escHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    // ─── Init ────────────────────────────────────────────────────
    function init() {
        loadTerms();
        renderHomeCount();

        // Pre-populate create screen input list
        const inputListEl = document.getElementById('terms-input-list');
        if (inputListEl && inputListEl.children.length === 0) {
            addInputRow(inputListEl, '', '');
        }
    }

    // Run on DOM ready
    document.addEventListener('DOMContentLoaded', init);

    // ─── Public API ──────────────────────────────────────────────
    return { goTo, goHome, startGame, tfAnswer, mcAnswer, fibSubmit, ddDrop, saveTerms, playAgain };
})();