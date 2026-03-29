// app.js

document.addEventListener('DOMContentLoaded', () => {
    let score = 0;
    let currentMode = '';
    let currentQuestionIndex = 0;
    let questions = [];
    let totalQuestions = 0;

    // Page elements
    const homePage = document.getElementById('home');
    const quizPage = document.getElementById('quiz');
    const modeBtns = document.querySelectorAll('.mode-btn');
    const modeTitle = document.getElementById('mode-title');
    const scoreEl = document.getElementById('score');
    const progressEl = document.getElementById('progress');
    const newStartBtn = document.getElementById('new-start-btn');

    // Quiz mode elements
    const tfMode = document.getElementById('truefalse-mode');
    const mcMode = document.getElementById('multichoice-mode');
    const fbMode = document.getElementById('fillblank-mode');
    const ddMode = document.getElementById('draganddrop-mode');

    // True/False elements
    const tfQuestion = document.getElementById('tf-question');
    const tfBtns = document.querySelectorAll('.tf-btn');

    // Multiple Choice elements
    const mcQuestion = document.getElementById('mc-question');
    const mcOptions = document.getElementById('mc-options');

    // Fill in Blank elements
    const fbQuestion = document.getElementById('fb-question');
    const fbInput = document.getElementById('fb-input');
    const fbSubmit = document.getElementById('fb-submit');

    // Drag and Drop elements
    const ddQuestion = document.getElementById('dd-question');
    const ddItems = document.getElementById('dd-items');
    const ddTargets = document.getElementById('dd-targets');

    // Result overlay elements
    const resultOverlay = document.getElementById('result-overlay');
    const resultAnimation = document.getElementById('result-animation');
    const resultText = document.getElementById('result-text');

    // Mode button click handlers
    modeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            currentMode = btn.dataset.mode;
            startQuiz(currentMode);
        });
    });

    // New Start button
    newStartBtn.addEventListener('click', () => {
        resultOverlay.classList.add('hidden');
        showPage(homePage);
        resetQuiz();
    });

    function showPage(page) {
        homePage.classList.remove('active');
        quizPage.classList.remove('active');
        page.classList.add('active');
    }

    function resetQuiz() {
        score = 0;
        currentQuestionIndex = 0;
        scoreEl.textContent = '0';
        progressEl.style.width = '0%';
        newStartBtn.classList.add('hidden');
    }

    function startQuiz(mode) {
        resetQuiz();
        showPage(quizPage);

        // Hide all quiz modes
        [tfMode, mcMode, fbMode, ddMode].forEach(m => m.classList.add('hidden'));

        switch (mode) {
            case 'truefalse':
                modeTitle.textContent = 'True or False';
                questions = [...quizData.trueFalseQuestions];
                totalQuestions = questions.length;
                tfMode.classList.remove('hidden');
                loadTrueFalseQuestion();
                break;
            case 'multichoice':
                modeTitle.textContent = 'Multiple Choice';
                questions = [...quizData.multipleChoiceQuestions];
                totalQuestions = questions.length;
                mcMode.classList.remove('hidden');
                loadMultipleChoiceQuestion();
                break;
            case 'fillblank':
                modeTitle.textContent = 'Fill in the Blank';
                questions = [...quizData.fillInTheBlankQuestions];
                totalQuestions = questions.length;
                fbMode.classList.remove('hidden');
                loadFillBlankQuestion();
                break;
            case 'draganddrop':
                modeTitle.textContent = 'Drag & Drop';
                questions = [...quizData.dragAndDropItems];
                totalQuestions = questions.length;
                ddMode.classList.remove('hidden');
                loadDragDropQuestion();
                break;
        }
    }

    function updateProgress() {
        const percent = (currentQuestionIndex / totalQuestions) * 100;
        progressEl.style.width = percent + '%';
    }

    function showResult(correct) {
        resultAnimation.textContent = correct ? '✅' : '❌';
        resultText.textContent = correct ? 'Correct!' : 'Incorrect!';
        resultOverlay.classList.remove('hidden');
        setTimeout(() => {
            resultOverlay.classList.add('hidden');
            nextQuestion();
        }, 1200);
    }

    function showFinalScore() {
        resultAnimation.textContent = '🎉';
        resultText.textContent = `Final Score: ${score} / ${totalQuestions}`;
        resultOverlay.classList.remove('hidden');
        newStartBtn.classList.remove('hidden');
    }

    function nextQuestion() {
        currentQuestionIndex++;
        updateProgress();
        if (currentQuestionIndex >= totalQuestions) {
            showFinalScore();
            return;
        }
        switch (currentMode) {
            case 'truefalse':
                loadTrueFalseQuestion();
                break;
            case 'multichoice':
                loadMultipleChoiceQuestion();
                break;
            case 'fillblank':
                loadFillBlankQuestion();
                break;
            case 'draganddrop':
                loadDragDropQuestion();
                break;
        }
    }

    // True/False
    function loadTrueFalseQuestion() {
        const q = questions[currentQuestionIndex];
        tfQuestion.textContent = q.question;
        tfBtns.forEach(btn => {
            btn.disabled = false;
        });
    }

    tfBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const answer = btn.dataset.answer === 'true';
            const correct = answer === questions[currentQuestionIndex].answer;
            if (correct) score++;
            scoreEl.textContent = score;
            tfBtns.forEach(b => b.disabled = true);
            showResult(correct);
        });
    });

    // Multiple Choice
    function loadMultipleChoiceQuestion() {
        const q = questions[currentQuestionIndex];
        mcQuestion.textContent = q.question;
        mcOptions.innerHTML = '';
        q.options.forEach(option => {
            const btn = document.createElement('button');
            btn.className = 'answer-btn mc-option';
            btn.textContent = option;
            btn.addEventListener('click', () => {
                const correct = option === q.answer;
                if (correct) score++;
                scoreEl.textContent = score;
                mcOptions.querySelectorAll('.mc-option').forEach(b => b.disabled = true);
                showResult(correct);
            });
            mcOptions.appendChild(btn);
        });
    }

    // Fill in Blank
    function loadFillBlankQuestion() {
        const q = questions[currentQuestionIndex];
        fbQuestion.textContent = q.question;
        fbInput.value = '';
        fbInput.disabled = false;
        fbSubmit.disabled = false;
    }

    fbSubmit.addEventListener('click', () => {
        const answer = fbInput.value.trim();
        if (!answer) return;
        const correct = answer.toLowerCase() === questions[currentQuestionIndex].answer.toLowerCase();
        if (correct) score++;
        scoreEl.textContent = score;
        fbInput.disabled = true;
        fbSubmit.disabled = true;
        showResult(correct);
    });

    fbInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') fbSubmit.click();
    });

    // Drag and Drop
    function loadDragDropQuestion() {
        const q = questions[currentQuestionIndex];
        ddQuestion.textContent = `Drag "${q.item}" to its correct category`;

        ddItems.innerHTML = '';
        ddTargets.innerHTML = '';

        // Create draggable item
        const item = document.createElement('div');
        item.className = 'drag-item';
        item.textContent = q.item;
        item.draggable = true;
        item.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', q.item);
        });
        ddItems.appendChild(item);

        // Create drop targets (all unique categories)
        const allCategories = [...new Set(quizData.dragAndDropItems.map(i => i.category))];
        allCategories.forEach(category => {
            const target = document.createElement('div');
            target.className = 'drop-target';
            target.textContent = category;
            target.dataset.category = category;
            target.addEventListener('dragover', (e) => e.preventDefault());
            target.addEventListener('drop', (e) => {
                e.preventDefault();
                const correct = category === q.category;
                if (correct) score++;
                scoreEl.textContent = score;
                showResult(correct);
            });
            ddTargets.appendChild(target);
        });
    }
});
