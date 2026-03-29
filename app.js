// JustLEarn — Quiz Application

let currentMode = null;
let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;

// ─── Page Navigation ─────────────────────────────────────────────────────────

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
}

// ─── Quiz Initialization ──────────────────────────────────────────────────────

function startQuiz(mode) {
    currentMode = mode;
    currentQuestionIndex = 0;
    score = 0;

    const titles = {
        truefalse:   'True or False',
        multichoice: 'Multiple Choice',
        fillblank:   'Fill in the Blank',
        draganddrop: 'Drag & Drop'
    };
    document.getElementById('mode-title').textContent = titles[mode];

    switch (mode) {
        case 'truefalse':   currentQuestions = quizData.trueFalseQuestions;       break;
        case 'multichoice': currentQuestions = quizData.multipleChoiceQuestions;  break;
        case 'fillblank':   currentQuestions = quizData.fillInTheBlankQuestions;  break;
        case 'draganddrop': currentQuestions = quizData.dragAndDropItems;         break;
        default:            currentQuestions = [];
    }

    updateScore();
    updateProgress();
    showMode(mode);
    showPage('quiz');
    loadQuestion();
}

function showMode(mode) {
    document.querySelectorAll('.quiz-mode').forEach(m => m.classList.add('hidden'));
    document.getElementById(mode + '-mode').classList.remove('hidden');
    document.getElementById('new-start-btn').classList.add('hidden');
    const summary = document.getElementById('quiz-summary');
    if (summary) summary.classList.add('hidden');
}

// ─── Score & Progress ─────────────────────────────────────────────────────────

function updateScore() {
    document.getElementById('score').textContent = score;
}

function updateProgress() {
    const pct = currentQuestions.length > 0
        ? (currentQuestionIndex / currentQuestions.length) * 100
        : 0;
    document.getElementById('progress').style.width = pct + '%';
}

// ─── Question Loading ─────────────────────────────────────────────────────────

function loadQuestion() {
    if (currentQuestionIndex >= currentQuestions.length) {
        endQuiz();
        return;
    }
    switch (currentMode) {
        case 'truefalse':   loadTrueFalse();   break;
        case 'multichoice': loadMultiChoice(); break;
        case 'fillblank':   loadFillBlank();   break;
        case 'draganddrop': loadDragAndDrop(); break;
    }
}

// ─── True / False ─────────────────────────────────────────────────────────────

function loadTrueFalse() {
    const q = currentQuestions[currentQuestionIndex];
    document.getElementById('tf-question').textContent = q.question;
    document.querySelectorAll('.tf-btn').forEach(btn => {
        btn.classList.remove('correct', 'incorrect');
        btn.disabled = false;
    });
}

function handleTrueFalse(btn, answerStr) {
    const q = currentQuestions[currentQuestionIndex];
    const isCorrect = (answerStr === 'true') === q.answer;

    document.querySelectorAll('.tf-btn').forEach(b => {
        b.disabled = true;
        const bVal = b.dataset.answer === 'true';
        b.classList.add(bVal === q.answer ? 'correct' : 'incorrect');
    });

    if (isCorrect) score++;
    updateScore();
    showResultOverlay(isCorrect);

    setTimeout(function () {
        currentQuestionIndex++;
        updateProgress();
        loadQuestion();
    }, 1000);
}

// ─── Multiple Choice ──────────────────────────────────────────────────────────

function loadMultiChoice() {
    const q = currentQuestions[currentQuestionIndex];
    document.getElementById('mc-question').textContent = q.question;

    const container = document.getElementById('mc-options');
    container.innerHTML = '';
    q.options.forEach(function (option) {
        const btn = document.createElement('button');
        btn.className = 'answer-btn option-btn';
        btn.textContent = option;
        btn.addEventListener('click', function () { handleMultiChoice(btn, option); });
        container.appendChild(btn);
    });
}

function handleMultiChoice(clickedBtn, selected) {
    const q = currentQuestions[currentQuestionIndex];
    const isCorrect = selected === q.answer;

    document.querySelectorAll('.option-btn').forEach(function (b) {
        b.disabled = true;
        if (b.textContent === q.answer) b.classList.add('correct');
        else if (b === clickedBtn && !isCorrect) b.classList.add('incorrect');
    });

    if (isCorrect) score++;
    updateScore();
    showResultOverlay(isCorrect);

    setTimeout(function () {
        currentQuestionIndex++;
        updateProgress();
        loadQuestion();
    }, 1000);
}

// ─── Fill in the Blank ────────────────────────────────────────────────────────

function loadFillBlank() {
    const q = currentQuestions[currentQuestionIndex];
    document.getElementById('fb-question').textContent = q.question;

    var input = document.getElementById('fb-input');
    input.value = '';
    input.disabled = false;
    input.classList.remove('correct', 'incorrect');
    document.getElementById('fb-submit').disabled = false;

    var existing = document.getElementById('fillblank-mode').querySelector('.hint-text');
    if (existing) existing.remove();

    input.focus();
}

function normalizeAnswer(str) {
    return str.trim().toLowerCase().replace(/[.,!?;:'"-]/g, '');
}

function handleFillBlank() {
    var q = currentQuestions[currentQuestionIndex];
    var input = document.getElementById('fb-input');
    var userAnswer = normalizeAnswer(input.value);
    var isCorrect = userAnswer === normalizeAnswer(q.answer) ||
        (Array.isArray(q.alternates) && q.alternates.some(function (a) {
            return userAnswer === normalizeAnswer(a);
        }));

    input.disabled = true;
    document.getElementById('fb-submit').disabled = true;
    input.classList.add(isCorrect ? 'correct' : 'incorrect');

    if (!isCorrect) {
        var hint = document.createElement('p');
        hint.className = 'hint-text';
        hint.textContent = 'Correct: ' + q.answer;
        document.getElementById('fillblank-mode').appendChild(hint);
    }

    if (isCorrect) score++;
    updateScore();
    showResultOverlay(isCorrect);

    setTimeout(function () {
        currentQuestionIndex++;
        updateProgress();
        loadQuestion();
    }, 1200);
}

// ─── Drag and Drop ────────────────────────────────────────────────────────────

var touchDragEl = null;
var touchClone = null;

function loadDragAndDrop() {
    var items = currentQuestions;
    var categories = items.reduce(function (acc, i) {
        if (acc.indexOf(i.category) === -1) acc.push(i.category);
        return acc;
    }, []);

    document.getElementById('dd-question').textContent =
        'Drag each item to its correct category:';

    // Build draggable items
    var itemsEl = document.getElementById('dd-items');
    itemsEl.innerHTML = '';
    items.forEach(function (q, idx) {
        var div = document.createElement('div');
        div.className = 'drag-item';
        div.textContent = q.item;
        div.draggable = true;
        div.dataset.index = idx;
        div.addEventListener('dragstart', onDragStart);
        div.addEventListener('touchstart', onTouchStart, { passive: false });
        itemsEl.appendChild(div);
    });

    // Build drop targets
    var targetsEl = document.getElementById('dd-targets');
    targetsEl.innerHTML = '';
    categories.forEach(function (cat) {
        var wrap = document.createElement('div');
        wrap.className = 'drop-target';

        var label = document.createElement('div');
        label.className = 'drop-target-label';
        label.textContent = cat;

        var zone = document.createElement('div');
        zone.className = 'drop-zone';
        zone.dataset.category = cat;
        zone.addEventListener('dragover', function (e) {
            e.preventDefault();
            zone.classList.add('drag-over');
        });
        zone.addEventListener('dragleave', function () {
            zone.classList.remove('drag-over');
        });
        zone.addEventListener('drop', onDrop);

        wrap.appendChild(label);
        wrap.appendChild(zone);
        targetsEl.appendChild(wrap);
    });

    // Check answers button
    var checkBtn = document.getElementById('dd-check-btn');
    if (!checkBtn) {
        checkBtn = document.createElement('button');
        checkBtn.id = 'dd-check-btn';
        checkBtn.className = 'answer-btn submit-btn';
        checkBtn.textContent = 'Check Answers';
        document.getElementById('draganddrop-mode').appendChild(checkBtn);
    }
    checkBtn.classList.remove('hidden');
    checkBtn.disabled = false;
    checkBtn.onclick = checkDragAndDrop;

    document.getElementById('new-start-btn').classList.add('hidden');
}

function onDragStart(e) {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', e.currentTarget.dataset.index);
    e.currentTarget.classList.add('dragging');
}

function onDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    var idx = e.dataTransfer.getData('text/plain');
    var item = document.querySelector('.drag-item[data-index="' + idx + '"]');
    if (item) {
        item.classList.remove('dragging');
        e.currentTarget.appendChild(item);
    }
}

// Touch drag support
function onTouchStart(e) {
    e.preventDefault();
    touchDragEl = e.currentTarget;
    var touch = e.touches[0];

    touchClone = touchDragEl.cloneNode(true);
    touchClone.style.cssText = 'position:fixed;opacity:0.75;pointer-events:none;' +
        'z-index:999;width:' + touchDragEl.offsetWidth + 'px;margin:0;';
    document.body.appendChild(touchClone);
    moveTouchClone(touch);

    document.addEventListener('touchmove', onTouchMove, { passive: false });
    document.addEventListener('touchend', onTouchEndGlobal, { once: true });
}

function onTouchMove(e) {
    e.preventDefault();
    moveTouchClone(e.touches[0]);
}

function moveTouchClone(touch) {
    if (touchClone) {
        touchClone.style.left = (touch.clientX - touchClone.offsetWidth / 2) + 'px';
        touchClone.style.top  = (touch.clientY - touchClone.offsetHeight / 2) + 'px';
    }
}

function onTouchEndGlobal(e) {
    document.removeEventListener('touchmove', onTouchMove);
    if (touchClone) {
        document.body.removeChild(touchClone);
        touchClone = null;
    }
    var touch = e.changedTouches[0];
    var el = document.elementFromPoint(touch.clientX, touch.clientY);
    var zone = el && el.closest('.drop-zone');
    if (zone && touchDragEl) {
        zone.appendChild(touchDragEl);
    }
    touchDragEl = null;
}

function checkDragAndDrop() {
    var correct = 0;
    var total = currentQuestions.length;

    document.querySelectorAll('.drop-zone').forEach(function (zone) {
        zone.classList.remove('drag-over');
        zone.querySelectorAll('.drag-item').forEach(function (item) {
            var idx = parseInt(item.dataset.index, 10);
            var expected = currentQuestions[idx].category;
            var placed = zone.dataset.category;
            item.classList.add(placed === expected ? 'correct' : 'incorrect');
            if (placed === expected) correct++;
        });
    });

    // Items still in source list are wrong
    document.querySelectorAll('#dd-items .drag-item').forEach(function (item) {
        item.classList.add('incorrect');
    });

    document.getElementById('dd-check-btn').disabled = true;
    score += correct;
    updateScore();
    currentQuestionIndex = total;
    updateProgress();

    showResultOverlay(correct === total, correct + ' / ' + total + ' correct');

    setTimeout(function () {
        document.querySelectorAll('.quiz-mode').forEach(function (m) {
            m.classList.add('hidden');
        });
        showEndSummary(total, score);
        document.getElementById('new-start-btn').classList.remove('hidden');
    }, 1000);
}

// ─── Result Overlay ───────────────────────────────────────────────────────────

function showResultOverlay(isCorrect, message) {
    var overlay = document.getElementById('result-overlay');
    var anim = document.getElementById('result-animation');
    var txt = document.getElementById('result-text');

    overlay.className = 'result-overlay ' + (isCorrect ? 'correct' : 'incorrect') + ' show';
    anim.textContent = isCorrect ? '✓' : '✗';
    txt.textContent = message || (isCorrect ? 'Correct!' : 'Incorrect!');

    setTimeout(function () {
        overlay.className = 'result-overlay hidden';
    }, 900);
}

// ─── End Quiz ─────────────────────────────────────────────────────────────────

function endQuiz() {
    document.querySelectorAll('.quiz-mode').forEach(function (m) {
        m.classList.add('hidden');
    });
    showEndSummary(currentQuestions.length, score);
    document.getElementById('new-start-btn').classList.remove('hidden');
}

function showEndSummary(total, pts) {
    var pct = total > 0 ? Math.round((pts / total) * 100) : 0;
    var quizEl = document.querySelector('#quiz .container');
    if (!quizEl) return;
    var summary = document.getElementById('quiz-summary');
    if (!summary) {
        summary = document.createElement('div');
        summary.id = 'quiz-summary';
        summary.className = 'quiz-summary';
        quizEl.appendChild(summary);
    }

    // Build summary using DOM methods to avoid XSS
    summary.innerHTML = '';

    var icon = document.createElement('div');
    icon.className = 'summary-icon';
    icon.textContent = pct >= 70 ? '🎉' : '📚';

    var title = document.createElement('h2');
    title.className = 'summary-title';
    title.textContent = 'Quiz Complete!';

    var scoreEl = document.createElement('p');
    scoreEl.className = 'summary-score';
    scoreEl.textContent = pts + ' / ' + total;

    var pctEl = document.createElement('p');
    pctEl.className = 'summary-percent';
    pctEl.textContent = pct + '%';

    var msg = document.createElement('p');
    msg.className = 'summary-msg';
    msg.textContent = pct >= 70 ? 'Great job!' : 'Keep practicing!';

    summary.appendChild(icon);
    summary.appendChild(title);
    summary.appendChild(scoreEl);
    summary.appendChild(pctEl);
    summary.appendChild(msg);

    summary.classList.remove('hidden');
}

// ─── Event Bindings ───────────────────────────────────────────────────────────

// Home: mode buttons
document.querySelectorAll('.mode-btn').forEach(function (btn) {
    btn.addEventListener('click', function () { startQuiz(btn.dataset.mode); });
});

// Quiz: True/False buttons
document.querySelectorAll('.tf-btn').forEach(function (btn) {
    btn.addEventListener('click', function () { handleTrueFalse(btn, btn.dataset.answer); });
});

// Quiz: Fill-in-Blank submit
document.getElementById('fb-submit').addEventListener('click', handleFillBlank);
document.getElementById('fb-input').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') handleFillBlank();
});

// Quiz: New Start
document.getElementById('new-start-btn').addEventListener('click', function () {
    var summary = document.getElementById('quiz-summary');
    if (summary) summary.classList.add('hidden');
    showPage('home');
});