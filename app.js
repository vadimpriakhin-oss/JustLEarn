// ===================== DATA =====================

const trueFalseQuestions = [
    { question: 'Is the sky blue?', answer: true },
    { question: 'Is grass red?', answer: false },
    { question: 'Does the Earth orbit the Sun?', answer: true },
    { question: 'Is water a solid at room temperature?', answer: false },
    { question: 'Do mammals breathe air?', answer: true },
    { question: 'Is the Great Wall of China visible from space with the naked eye?', answer: false },
    { question: 'Does light travel faster than sound?', answer: true },
    { question: 'Is the human body made of more than 50% water?', answer: true },
];

const multipleChoiceQuestions = [
    { question: 'What is the capital of France?', options: ['Berlin', 'Madrid', 'Paris', 'Rome'], answer: 'Paris' },
    { question: 'What is 2 + 2?', options: ['3', '4', '5', '6'], answer: '4' },
    { question: 'Which planet is the largest in our solar system?', options: ['Earth', 'Mars', 'Jupiter', 'Saturn'], answer: 'Jupiter' },
    { question: 'What is the chemical symbol for water?', options: ['CO2', 'H2O', 'O2', 'NaCl'], answer: 'H2O' },
    { question: 'Who painted the Mona Lisa?', options: ['Picasso', 'Van Gogh', 'Da Vinci', 'Rembrandt'], answer: 'Da Vinci' },
    { question: 'How many continents are on Earth?', options: ['5', '6', '7', '8'], answer: '7' },
];

const fillInBlankQuestions = [
    { question: 'The capital of Italy is ___.', answer: 'Rome' },
    { question: 'Water freezes at ___ degrees Celsius.', answer: '0' },
    { question: 'The chemical formula for water is ___.', answer: 'H2O' },
    { question: 'The ___ is the largest ocean on Earth.', answer: 'Pacific' },
    { question: 'Albert ___ developed the theory of relativity.', answer: 'Einstein' },
    { question: 'The currency of Japan is the ___.', answer: 'Yen' },
];

const dragAndDropQuestions = [
    {
        question: 'Arrange the planets in order from the Sun:',
        items: ['Mars', 'Mercury', 'Venus', 'Earth'],
        correctOrder: ['Mercury', 'Venus', 'Earth', 'Mars'],
    },
    {
        question: 'Arrange these numbers in ascending order:',
        items: ['4', '1', '3', '2'],
        correctOrder: ['1', '2', '3', '4'],
    },
    {
        question: 'Arrange the seasons in order starting from Spring:',
        items: ['Winter', 'Spring', 'Autumn', 'Summer'],
        correctOrder: ['Spring', 'Summer', 'Autumn', 'Winter'],
    },
];

// ===================== STATE =====================

let currentMode = '';
let currentQuestions = [];
let currentIndex = 0;
let score = 0;
let answered = false;
let customTerms = [];

// ===================== INIT =====================

function init() {
    loadCustomTerms();

    document.querySelectorAll('.mode-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var mode = btn.dataset.mode;
            if (mode === 'addterm') {
                showAddTermPage();
            } else {
                startQuiz(mode);
            }
        });
    });

    document.getElementById('nextBtn').addEventListener('click', nextQuestion);
    document.getElementById('homeBtn').addEventListener('click', showHomePage);
    document.getElementById('addBtn').addEventListener('click', addCustomTerm);
    document.getElementById('backBtn').addEventListener('click', showHomePage);

    showHomePage();
}

// ===================== NAVIGATION =====================

function showHomePage() {
    document.getElementById('homePage').classList.remove('hidden');
    document.getElementById('quizPage').classList.add('hidden');
    document.getElementById('addTermPage').classList.add('hidden');
}

function showQuizPage() {
    document.getElementById('homePage').classList.add('hidden');
    document.getElementById('quizPage').classList.remove('hidden');
    document.getElementById('addTermPage').classList.add('hidden');
}

function showAddTermPage() {
    document.getElementById('homePage').classList.add('hidden');
    document.getElementById('quizPage').classList.add('hidden');
    document.getElementById('addTermPage').classList.remove('hidden');
    renderCustomTerms();
}

// ===================== QUIZ =====================

function startQuiz(mode) {
    currentMode = mode;
    currentIndex = 0;
    score = 0;
    answered = false;

    switch (mode) {
        case 'truefalse':
            currentQuestions = shuffle(trueFalseQuestions.slice());
            document.getElementById('modeTitle').textContent = 'True or False';
            break;
        case 'multichoice':
            currentQuestions = shuffle(multipleChoiceQuestions.slice());
            document.getElementById('modeTitle').textContent = 'Multiple Choice';
            break;
        case 'fillblank':
            currentQuestions = shuffle(fillInBlankQuestions.slice());
            document.getElementById('modeTitle').textContent = 'Fill in the Blank';
            break;
        case 'draganddrop':
            currentQuestions = dragAndDropQuestions.slice();
            document.getElementById('modeTitle').textContent = 'Drag & Drop';
            break;
    }

    showQuizPage();
    updateScore();
    renderQuestion();
}

function renderQuestion() {
    var q = currentQuestions[currentIndex];
    answered = false;
    updateProgress();
    document.getElementById('nextBtn').classList.add('hidden');

    switch (currentMode) {
        case 'truefalse':
            renderTrueFalse(q);
            break;
        case 'multichoice':
            renderMultipleChoice(q);
            break;
        case 'fillblank':
            renderFillInBlank(q);
            break;
        case 'draganddrop':
            renderDragAndDrop(q);
            break;
    }
}

function nextQuestion() {
    currentIndex++;
    if (currentIndex >= currentQuestions.length) {
        showResults();
    } else {
        renderQuestion();
    }
}

function markAnswer(correct) {
    if (answered) return;
    answered = true;
    if (correct) {
        score++;
        updateScore();
    }
    document.getElementById('nextBtn').classList.remove('hidden');
}

function updateScore() {
    document.getElementById('score').textContent = score;
}

function updateProgress() {
    var percent = (currentIndex / currentQuestions.length) * 100;
    document.getElementById('progress').style.width = percent + '%';
}

function showResults() {
    document.getElementById('progress').style.width = '100%';
    var total = currentQuestions.length;
    var percent = Math.round((score / total) * 100);

    var message = 'Keep practicing!';
    if (percent >= 80) message = 'Excellent work! 🎉';
    else if (percent >= 60) message = 'Good job! 👍';
    else if (percent >= 40) message = 'Not bad! Keep it up! 💪';

    var content = document.getElementById('quizContent');
    content.innerHTML =
        '<div class="results-container">' +
            '<h2>Quiz Complete!</h2>' +
            '<p class="result-score">' + score + ' / ' + total + '</p>' +
            '<p class="result-percent">' + percent + '%</p>' +
            '<p class="result-message">' + escapeHtml(message) + '</p>' +
            '<button id="playAgainBtn" class="btn-primary">Play Again</button>' +
        '</div>';
    document.getElementById('nextBtn').classList.add('hidden');

    var savedMode = currentMode;
    document.getElementById('playAgainBtn').addEventListener('click', function () {
        startQuiz(savedMode);
    });
}

// ===================== TRUE / FALSE =====================

function renderTrueFalse(q) {
    document.getElementById('quizContent').innerHTML =
        '<div class="question-box">' +
            '<p class="question-number">Question ' + (currentIndex + 1) + ' of ' + currentQuestions.length + '</p>' +
            '<p class="question-text">' + q.question + '</p>' +
            '<div class="tf-buttons">' +
                '<button class="btn-tf btn-true" onclick="checkTrueFalse(true)">✓ True</button>' +
                '<button class="btn-tf btn-false" onclick="checkTrueFalse(false)">✗ False</button>' +
            '</div>' +
            '<div id="feedback" class="feedback hidden"></div>' +
        '</div>';
}

function checkTrueFalse(userAnswer) {
    if (answered) return;
    var q = currentQuestions[currentIndex];
    var correct = userAnswer === q.answer;

    markAnswer(correct);

    var trueBtn = document.querySelector('.btn-true');
    var falseBtn = document.querySelector('.btn-false');
    trueBtn.disabled = true;
    falseBtn.disabled = true;

    var feedback = document.getElementById('feedback');
    feedback.classList.remove('hidden');

    if (correct) {
        feedback.className = 'feedback correct';
        feedback.textContent = '✓ Correct!';
        (q.answer ? trueBtn : falseBtn).classList.add('correct-answer');
    } else {
        feedback.className = 'feedback incorrect';
        feedback.textContent = '✗ Wrong! The answer is ' + (q.answer ? 'True' : 'False');
        (userAnswer ? trueBtn : falseBtn).classList.add('wrong-answer');
        (q.answer ? trueBtn : falseBtn).classList.add('correct-answer');
    }
}

// ===================== MULTIPLE CHOICE =====================

function renderMultipleChoice(q) {
    var box = document.createElement('div');
    box.className = 'question-box';

    var num = document.createElement('p');
    num.className = 'question-number';
    num.textContent = 'Question ' + (currentIndex + 1) + ' of ' + currentQuestions.length;

    var text = document.createElement('p');
    text.className = 'question-text';
    text.textContent = q.question;

    var grid = document.createElement('div');
    grid.className = 'options-grid';

    q.options.forEach(function (opt) {
        var btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = opt;
        btn.addEventListener('click', function () { checkMultipleChoice(opt); });
        grid.appendChild(btn);
    });

    var feedback = document.createElement('div');
    feedback.id = 'feedback';
    feedback.className = 'feedback hidden';

    box.appendChild(num);
    box.appendChild(text);
    box.appendChild(grid);
    box.appendChild(feedback);

    var content = document.getElementById('quizContent');
    content.innerHTML = '';
    content.appendChild(box);
}

function checkMultipleChoice(userAnswer) {
    if (answered) return;
    var q = currentQuestions[currentIndex];
    var correct = userAnswer === q.answer;

    markAnswer(correct);

    document.querySelectorAll('.option-btn').forEach(function (btn) {
        btn.disabled = true;
        if (btn.textContent === q.answer) {
            btn.classList.add('correct-answer');
        } else if (btn.textContent === userAnswer && !correct) {
            btn.classList.add('wrong-answer');
        }
    });

    var feedback = document.getElementById('feedback');
    feedback.classList.remove('hidden');
    if (correct) {
        feedback.className = 'feedback correct';
        feedback.textContent = '✓ Correct!';
    } else {
        feedback.className = 'feedback incorrect';
        feedback.textContent = '✗ Wrong! The correct answer is "' + q.answer + '"';
    }
}

// ===================== FILL IN THE BLANK =====================

function renderFillInBlank(q) {
    document.getElementById('quizContent').innerHTML =
        '<div class="question-box">' +
            '<p class="question-number">Question ' + (currentIndex + 1) + ' of ' + currentQuestions.length + '</p>' +
            '<p class="question-text">' + q.question + '</p>' +
            '<div class="fill-blank-input">' +
                '<input type="text" id="blankInput" class="form-input" placeholder="Your answer…" autocomplete="off">' +
                '<button class="btn-primary" onclick="checkFillInBlank()">Submit</button>' +
            '</div>' +
            '<div id="feedback" class="feedback hidden"></div>' +
        '</div>';

    document.getElementById('blankInput').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') checkFillInBlank();
    });
}

function checkFillInBlank() {
    if (answered) return;
    var input = document.getElementById('blankInput');
    var userAnswer = input.value.trim();
    if (!userAnswer) return;

    var q = currentQuestions[currentIndex];
    var correct = userAnswer.toLowerCase() === q.answer.toLowerCase();

    markAnswer(correct);

    input.disabled = true;
    var submitBtn = document.querySelector('.fill-blank-input .btn-primary');
    if (submitBtn) submitBtn.disabled = true;

    var feedback = document.getElementById('feedback');
    feedback.classList.remove('hidden');
    if (correct) {
        feedback.className = 'feedback correct';
        feedback.textContent = '✓ Correct!';
        input.classList.add('correct-input');
    } else {
        feedback.className = 'feedback incorrect';
        feedback.textContent = '✗ Wrong! The correct answer is "' + q.answer + '"';
        input.classList.add('wrong-input');
    }
}

// ===================== DRAG AND DROP =====================

function renderDragAndDrop(q) {
    var shuffledItems = shuffle(q.items.slice());

    var box = document.createElement('div');
    box.className = 'question-box';

    var num = document.createElement('p');
    num.className = 'question-number';
    num.textContent = 'Question ' + (currentIndex + 1) + ' of ' + currentQuestions.length;

    var text = document.createElement('p');
    text.className = 'question-text';
    text.textContent = q.question;

    var dragContainer = document.createElement('div');
    dragContainer.className = 'drag-and-drop';
    dragContainer.id = 'dragContainer';

    shuffledItems.forEach(function (item) {
        var div = document.createElement('div');
        div.className = 'drag-item';
        div.draggable = true;
        div.dataset.item = item;

        var handle = document.createElement('span');
        handle.className = 'drag-handle';
        handle.textContent = '⠿';

        div.appendChild(handle);
        div.appendChild(document.createTextNode(item));
        dragContainer.appendChild(div);
    });

    var checkBtn = document.createElement('button');
    checkBtn.className = 'btn-primary check-order-btn';
    checkBtn.textContent = 'Check Order';
    checkBtn.addEventListener('click', checkDragAndDrop);

    var feedback = document.createElement('div');
    feedback.id = 'feedback';
    feedback.className = 'feedback hidden';

    box.appendChild(num);
    box.appendChild(text);
    box.appendChild(dragContainer);
    box.appendChild(checkBtn);
    box.appendChild(feedback);

    var content = document.getElementById('quizContent');
    content.innerHTML = '';
    content.appendChild(box);

    initDragAndDrop();
}

function initDragAndDrop() {
    var container = document.getElementById('dragContainer');
    var draggedItem = null;

    container.addEventListener('dragstart', function (e) {
        draggedItem = e.target.closest('.drag-item');
        if (!draggedItem) return;
        draggedItem.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
    });

    container.addEventListener('dragend', function (e) {
        var item = e.target.closest('.drag-item');
        if (item) item.classList.remove('dragging');
        draggedItem = null;
    });

    container.addEventListener('dragover', function (e) {
        e.preventDefault();
        var dragging = container.querySelector('.dragging');
        if (!dragging) return;
        var afterElement = getDragAfterElement(container, e.clientY);
        if (afterElement == null) {
            container.appendChild(dragging);
        } else {
            container.insertBefore(dragging, afterElement);
        }
    });
}

function getDragAfterElement(container, y) {
    var items = Array.prototype.slice.call(container.querySelectorAll('.drag-item:not(.dragging)'));
    var result = { offset: Number.NEGATIVE_INFINITY, element: null };
    items.forEach(function (child) {
        var box = child.getBoundingClientRect();
        var offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > result.offset) {
            result = { offset: offset, element: child };
        }
    });
    return result.element;
}

function checkDragAndDrop() {
    if (answered) return;
    var q = currentQuestions[currentIndex];
    var container = document.getElementById('dragContainer');
    var currentOrder = Array.prototype.slice.call(container.querySelectorAll('.drag-item')).map(function (el) {
        return el.dataset.item;
    });

    var correct = JSON.stringify(currentOrder) === JSON.stringify(q.correctOrder);
    markAnswer(correct);

    var domItems = Array.prototype.slice.call(container.querySelectorAll('.drag-item'));
    domItems.forEach(function (el, idx) {
        el.draggable = false;
        if (currentOrder[idx] === q.correctOrder[idx]) {
            el.classList.add('correct-item');
        } else {
            el.classList.add('wrong-item');
        }
    });

    var feedback = document.getElementById('feedback');
    feedback.classList.remove('hidden');
    if (correct) {
        feedback.className = 'feedback correct';
        feedback.textContent = '✓ Correct order!';
    } else {
        feedback.className = 'feedback incorrect';
        feedback.textContent = '✗ Wrong order! Correct: ' + q.correctOrder.join(' → ');
    }
}

// ===================== CUSTOM TERMS =====================

function loadCustomTerms() {
    var stored = localStorage.getItem('customTerms');
    customTerms = stored ? JSON.parse(stored) : [];
}

function saveCustomTerms() {
    localStorage.setItem('customTerms', JSON.stringify(customTerms));
}

function addCustomTerm() {
    var termInput = document.getElementById('termInput');
    var answerInput = document.getElementById('answerInput');
    var term = termInput.value.trim();
    var answer = answerInput.value.trim();

    if (!term || !answer) {
        alert('Please enter both a term and an answer.');
        return;
    }

    customTerms.push({ term: term, answer: answer });
    saveCustomTerms();
    termInput.value = '';
    answerInput.value = '';
    renderCustomTerms();
}

function deleteTerm(index) {
    customTerms.splice(index, 1);
    saveCustomTerms();
    renderCustomTerms();
}

function renderCustomTerms() {
    var list = document.getElementById('termsList');
    var container = document.getElementById('customTermsList');

    if (customTerms.length === 0) {
        container.classList.add('hidden');
        return;
    }

    container.classList.remove('hidden');
    list.innerHTML = customTerms.map(function (t, i) {
        return '<li class="term-item">' +
                   '<span class="term-text">' + escapeHtml(t.term) + '</span>' +
                   '<span class="term-answer">→ ' + escapeHtml(t.answer) + '</span>' +
                   '<button class="btn-delete" onclick="deleteTerm(' + i + ')">✕</button>' +
               '</li>';
    }).join('');
}

// ===================== UTILS =====================

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function shuffle(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

// ===================== START =====================

document.addEventListener('DOMContentLoaded', init);