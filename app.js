let appState = {
  currentScreen: 'home',
  userTerms: [],
  currentQuizIndex: 0,
  score: { correct: 0, total: 0 },
  currentQuizMode: null,
  shuffledTerms: [],
  currentAnswerId: null
};

const DEFAULT_TERMS = [
  { term: 'Photosynthesis', definition: 'Process by which plants convert sunlight into chemical energy', isTrue: true },
  { term: 'Mitochondria', definition: 'Powerhouse of the cell responsible for energy production', isTrue: true },
  { term: 'Osmosis', definition: 'Movement of water across a semipermeable membrane', isTrue: true },
  { term: 'Enzyme', definition: 'Protein that speeds up chemical reactions in cells', isTrue: true },
  { term: 'DNA', definition: 'Molecule that carries genetic instructions for life', isTrue: true }
];

document.addEventListener('DOMContentLoaded', () => {
  document.body.style.backgroundColor = '#0a0a0a';
  loadTerms();
  showHomeScreen();
});

function escapeHTML(str) {
  if (typeof str !== 'string') return String(str);
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/`/g, '&#x60;')
    .replace(/\//g, '&#x2F;');
}

function loadTerms() {
  const stored = localStorage.getItem('justlearnTerms');
  appState.userTerms = stored ? JSON.parse(stored) : DEFAULT_TERMS;
}

function saveTerms() {
  localStorage.setItem('justlearnTerms', JSON.stringify(appState.userTerms));
}

function showHomeScreen() {
  const main = document.querySelector('main');
  main.style.backgroundColor = '#0a0a0a';
  main.innerHTML = `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; padding: 20px;">
      <h2 style="font-size: 48px; margin-bottom: 40px; color: #00ffcc; text-shadow: 0 0 20px #00ffcc;">🎓 JustLEarn</h2>
      <p style="margin-bottom: 30px; color: #fff;">Choose a learning mode:</p>
      <div style="display: flex; flex-direction: column; gap: 15px; width: 100%; max-width: 400px;">
        <button id="btn-true-false" style="background: linear-gradient(135deg, #00ffcc, #00aa88); color: #000; border: none; padding: 15px; border-radius: 8px; cursor: pointer; font-weight: bold;">🔵 True/False</button>
        <button id="btn-multiple-choice" style="background: linear-gradient(135deg, #00ffcc, #00aa88); color: #000; border: none; padding: 15px; border-radius: 8px; cursor: pointer; font-weight: bold;">🎯 Multiple Choice</button>
        <button id="btn-fill-blank" style="background: linear-gradient(135deg, #00ffcc, #00aa88); color: #000; border: none; padding: 15px; border-radius: 8px; cursor: pointer; font-weight: bold;">✏️ Fill the Blank</button>
        <button id="btn-drag-drop" style="background: linear-gradient(135deg, #00ffcc, #00aa88); color: #000; border: none; padding: 15px; border-radius: 8px; cursor: pointer; font-weight: bold;">🖱️ Drag &amp; Drop</button>
        <button id="btn-create" style="background: linear-gradient(135deg, #ff007f, #ff4466); color: #fff; border: none; padding: 15px; border-radius: 8px; cursor: pointer; font-weight: bold;">➕ Create Terms</button>
      </div>
    </div>`;

  document.getElementById('btn-true-false').addEventListener('click', () => startQuiz('true-false'));
  document.getElementById('btn-multiple-choice').addEventListener('click', () => startQuiz('multiple-choice'));
  document.getElementById('btn-fill-blank').addEventListener('click', () => startQuiz('fill-blank'));
  document.getElementById('btn-drag-drop').addEventListener('click', () => startQuiz('drag-drop'));
  document.getElementById('btn-create').addEventListener('click', () => showCreateScreen());
}

function showCreateScreen() {
  const main = document.querySelector('main');
  main.style.backgroundColor = '#0a0a0a';
  main.innerHTML = `
    <div style="padding: 20px; max-width: 600px; margin: 0 auto; min-height: 100vh;">
      <h2 style="text-align: center; margin-bottom: 30px; color: #00ffcc;">📚 Create Terms</h2>
      <div id="termsContainer"></div>
      <div style="display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; margin-bottom: 20px;">
        <button id="btn-add-term" style="background: #00ffcc; color: #000; border: none; padding: 12px 20px; border-radius: 8px; cursor: pointer; font-weight: bold;">+ Add Term</button>
        <button id="btn-save" style="background: #00aa00; color: #fff; border: none; padding: 12px 20px; border-radius: 8px; cursor: pointer; font-weight: bold;">✅ Save</button>
        <button id="btn-home" style="background: #555; color: #fff; border: none; padding: 12px 20px; border-radius: 8px; cursor: pointer; font-weight: bold;">🏠 Home</button>
      </div>
      <div id="termsList"></div>
    </div>`;

  document.getElementById('btn-add-term').addEventListener('click', () => addTermField());
  document.getElementById('btn-save').addEventListener('click', () => saveAndHome());
  document.getElementById('btn-home').addEventListener('click', () => showHomeScreen());

  renderTermFields();
  renderTermsList();
}

function renderTermFields() {
  const container = document.getElementById('termsContainer');
  container.innerHTML = '';
  appState.userTerms.forEach((item, index) => {
    const div = document.createElement('div');
    div.style.cssText = 'background: #1a1a2e; border: 2px solid #00ffcc; border-radius: 8px; padding: 15px; margin-bottom: 15px;';

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Term';
    input.value = item.term;
    input.style.cssText = 'width: 100%; background: #0f0f1e; color: #00ffcc; border: 1px solid #00ffcc; padding: 10px; border-radius: 5px; margin-bottom: 10px; font-size: 14px; box-sizing: border-box;';
    input.addEventListener('change', (e) => { appState.userTerms[index].term = e.target.value; });

    const textarea = document.createElement('textarea');
    textarea.placeholder = 'Definition';
    textarea.value = item.definition;
    textarea.style.cssText = 'width: 100%; background: #0f0f1e; color: #00ffcc; border: 1px solid #00ffcc; padding: 10px; border-radius: 5px; margin-bottom: 10px; min-height: 60px; font-size: 14px; box-sizing: border-box;';
    textarea.addEventListener('change', (e) => { appState.userTerms[index].definition = e.target.value; });

    const btn = document.createElement('button');
    btn.innerHTML = '🗑️ Delete';
    btn.style.cssText = 'width: 100%; background: #ff3333; color: white; border: none; padding: 8px; border-radius: 5px; cursor: pointer; font-weight: bold;';
    btn.addEventListener('click', () => { removeTermField(index); });

    div.appendChild(input);
    div.appendChild(textarea);
    div.appendChild(btn);
    container.appendChild(div);
  });
}

function addTermField() {
  appState.userTerms.push({ term: '', definition: '', isTrue: true });
  renderTermFields();
}

function removeTermField(index) {
  appState.userTerms.splice(index, 1);
  renderTermFields();
}

function renderTermsList() {
  const list = document.getElementById('termsList');
  if (appState.userTerms.length === 0) {
    list.innerHTML = '<p style="color: #888; text-align: center;">No terms yet</p>';
    return;
  }
  let html = `<h3 style="color: #00ffcc; border-bottom: 2px solid #00ffcc; padding-bottom: 10px;">📋 Terms: ${appState.userTerms.length}</h3><ul style="list-style: none; padding: 0;">`;
  appState.userTerms.forEach((item, i) => {
    html += `<li style="background: #1a1a2e; padding: 12px; margin: 8px 0; border-left: 4px solid #ff007f; border-radius: 4px; color: #fff;"><strong style="color: #00ffcc;">${i + 1}. ${escapeHTML(item.term)}</strong><br/><span style="color: #aaa; font-size: 12px;">${escapeHTML(item.definition)}</span></li>`;
  });
  list.innerHTML = html + '</ul>';
}

function saveAndHome() {
  appState.userTerms = appState.userTerms.filter(t => t.term.trim() && t.definition.trim());
  if (appState.userTerms.length === 0) {
    alert('Add at least one term!');
    return;
  }
  saveTerms();
  alert(appState.userTerms.length + ' terms saved!');
  showHomeScreen();
}

function startQuiz(mode) {
  if (appState.userTerms.length === 0) {
    alert('Create terms first!');
    showCreateScreen();
    return;
  }
  appState.currentQuizMode = mode;
  appState.currentQuizIndex = 0;
  appState.score = { correct: 0, total: appState.userTerms.length };
  appState.shuffledTerms = shuffle([...appState.userTerms]);
  showQuizScreen();
}

function showQuizScreen() {
  if (appState.currentQuizIndex >= appState.shuffledTerms.length) {
    showResultsScreen();
    return;
  }

  const term = appState.shuffledTerms[appState.currentQuizIndex];
  const progress = appState.currentQuizIndex + 1;
  const total = appState.shuffledTerms.length;
  const modeName = appState.currentQuizMode.replace('-', ' ').toUpperCase();

  let content = `
    <div style="padding: 20px; max-width: 600px; margin: 0 auto; min-height: 100vh;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
        <h2 style="margin: 0; color: #00ffcc;">${escapeHTML(modeName)}</h2>
        <div style="color: #00ffcc; font-weight: bold;">Score: ${appState.score.correct}/${appState.score.total}</div>
      </div>
      <div style="background: #1a1a2e; border: 1px solid #00ffcc; border-radius: 10px; height: 8px; margin-bottom: 20px; overflow: hidden;">
        <div style="background: linear-gradient(90deg, #00ffcc, #ff007f); height: 100%; width: ${(progress / total) * 100}%;"></div>
      </div>
      <p style="color: #888; text-align: center;">Question ${progress}/${total}</p>
      <div style="background: #1a1a2e; border: 2px solid #00ffcc; border-radius: 8px; padding: 20px; margin-bottom: 20px; text-align: center;">
        <h3 style="margin: 0; color: #00ffcc;">${escapeHTML(term.term)}</h3>
      </div>`;

  if (appState.currentQuizMode === 'true-false') {
    content += `
      <div style="display: flex; gap: 10px;">
        <button id="btn-true" style="flex: 1; background: #00aa00; color: white; border: none; padding: 15px; border-radius: 8px; cursor: pointer; font-weight: bold;">True</button>
        <button id="btn-false" style="flex: 1; background: #aa0000; color: white; border: none; padding: 15px; border-radius: 8px; cursor: pointer; font-weight: bold;">False</button>
      </div>`;
  } else if (appState.currentQuizMode === 'multiple-choice') {
    content += '<div id="optionsArea" style="display: flex; flex-direction: column; gap: 10px;"></div>';
  } else if (appState.currentQuizMode === 'fill-blank') {
    content += `
      <input type="text" id="answerInput" placeholder="Type answer" style="width: 100%; background: #0f0f1e; color: #00ffcc; border: 2px solid #00ffcc; padding: 12px; border-radius: 8px; margin-bottom: 10px; font-size: 16px; box-sizing: border-box;">
      <button id="btn-submit" style="width: 100%; background: #00ffcc; color: #000; border: none; padding: 12px; border-radius: 8px; cursor: pointer; font-weight: bold;">Submit</button>`;
  } else if (appState.currentQuizMode === 'drag-drop') {
    content += '<div id="dragDropArea"></div>';
  }

  content += `
      <button id="btn-home-quiz" style="width: 100%; margin-top: 20px; background: #333; color: #fff; border: none; padding: 12px; border-radius: 8px; cursor: pointer; font-weight: bold;">Home</button>
    </div>`;

  const main = document.querySelector('main');
  main.style.backgroundColor = '#0a0a0a';
  main.innerHTML = content;

  // Attach event listeners after setting innerHTML
  document.getElementById('btn-home-quiz').addEventListener('click', () => showHomeScreen());

  if (appState.currentQuizMode === 'true-false') {
    document.getElementById('btn-true').addEventListener('click', () => checkAnswer('true'));
    document.getElementById('btn-false').addEventListener('click', () => checkAnswer('false'));
  } else if (appState.currentQuizMode === 'multiple-choice') {
    buildMultipleChoiceOptions(term);
  } else if (appState.currentQuizMode === 'fill-blank') {
    const submitBtn = document.getElementById('btn-submit');
    submitBtn.addEventListener('click', () => checkFillBlank());
    document.getElementById('answerInput').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') checkFillBlank();
    });
  } else if (appState.currentQuizMode === 'drag-drop') {
    buildDragDropOptions(term);
  }
}

function buildMultipleChoiceOptions(term) {
  const wrong = getRandomWrong(term.definition, 3);
  const options = shuffle([term.definition, ...wrong]);
  const optionsArea = document.getElementById('optionsArea');

  options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.textContent = String.fromCharCode(65 + i) + ': ' + opt;
    btn.style.cssText = 'background: #1a1a2e; color: #00ffcc; border: 2px solid #00ffcc; padding: 15px; border-radius: 8px; cursor: pointer; text-align: left; font-weight: bold;';
    btn.addEventListener('click', () => checkAnswerMultiple(opt));
    optionsArea.appendChild(btn);
  });
}

function buildDragDropOptions(term) {
  const wrong = getRandomWrong(term.definition, 3);
  const options = shuffle([term.definition, ...wrong]);
  const area = document.getElementById('dragDropArea');

  // Drop zone
  const dropZone = document.createElement('div');
  dropZone.id = 'dropZone';
  dropZone.style.cssText = 'border: 3px dashed #00ffcc; border-radius: 8px; padding: 30px; text-align: center; color: #00ffcc; margin-bottom: 20px; min-height: 80px; display: flex; align-items: center; justify-content: center; font-weight: bold;';
  dropZone.textContent = 'Drop your answer here';

  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.style.background = '#1a1a2e';
  });
  dropZone.addEventListener('dragleave', () => {
    dropZone.style.background = '';
  });
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.style.background = '';
    const answer = e.dataTransfer.getData('text/plain');
    checkAnswerMultiple(answer);
  });

  // Draggable option cards
  const optionsContainer = document.createElement('div');
  optionsContainer.style.cssText = 'display: flex; flex-direction: column; gap: 10px;';

  options.forEach((opt, i) => {
    const card = document.createElement('div');
    card.draggable = true;
    card.textContent = String.fromCharCode(65 + i) + ': ' + opt;
    card.style.cssText = 'background: #1a1a2e; color: #00ffcc; border: 2px solid #00ffcc; padding: 15px; border-radius: 8px; cursor: grab; font-weight: bold; user-select: none;';
    card.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', opt);
      card.style.opacity = '0.5';
    });
    card.addEventListener('dragend', () => {
      card.style.opacity = '1';
    });
    optionsContainer.appendChild(card);
  });

  area.appendChild(dropZone);
  area.appendChild(optionsContainer);
}

function checkAnswer(userAnswer) {
  const correct = appState.shuffledTerms[appState.currentQuizIndex];
  let isCorrect = false;
  if (appState.currentQuizMode === 'true-false') {
    isCorrect = (userAnswer === 'true') === correct.isTrue;
  } else {
    isCorrect = userAnswer === correct.definition;
  }
  if (isCorrect) {
    appState.score.correct++;
    showFeedback('Correct!', '#00ff00');
  } else {
    showFeedback('Incorrect!', '#ff3333');
  }
  setTimeout(() => {
    appState.currentQuizIndex++;
    showQuizScreen();
  }, 1500);
}

function checkAnswerMultiple(answer) {
  const correct = appState.shuffledTerms[appState.currentQuizIndex];
  const isCorrect = answer === correct.definition;
  if (isCorrect) {
    appState.score.correct++;
    showFeedback('Correct!', '#00ff00');
  } else {
    showFeedback('Incorrect!', '#ff3333');
  }
  setTimeout(() => {
    appState.currentQuizIndex++;
    showQuizScreen();
  }, 1500);
}

function checkFillBlank() {
  const inputEl = document.getElementById('answerInput');
  const userAnswer = inputEl.value.trim().toLowerCase();
  if (!userAnswer) {
    alert('Please type an answer before submitting!');
    inputEl.focus();
    return;
  }
  const correct = appState.shuffledTerms[appState.currentQuizIndex].term.toLowerCase();
  if (userAnswer === correct) {
    appState.score.correct++;
    showFeedback('Correct!', '#00ff00');
  } else {
    showFeedback('Incorrect!', '#ff3333');
  }
  setTimeout(() => {
    appState.currentQuizIndex++;
    showQuizScreen();
  }, 1500);
}

function showFeedback(message, color) {
  const feedback = document.createElement('div');
  feedback.textContent = message;
  feedback.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(0,0,0,0.95); color: ' + color + '; padding: 30px 50px; border-radius: 10px; font-size: 24px; font-weight: bold; border: 2px solid ' + color + '; z-index: 1000; box-shadow: 0 0 30px ' + color + ';';
  document.body.appendChild(feedback);
  setTimeout(() => feedback.remove(), 1500);
}

function showResultsScreen() {
  const percentage = Math.round((appState.score.correct / appState.score.total) * 100);
  const main = document.querySelector('main');
  main.style.backgroundColor = '#0a0a0a';
  const message = percentage === 100 ? 'Perfect!' : percentage >= 80 ? 'Great!' : 'Keep trying!';
  main.innerHTML = `
    <div style="padding: 40px 20px; max-width: 600px; margin: 0 auto; text-align: center; display: flex; flex-direction: column; justify-content: center; min-height: 100vh;">
      <h2 style="color: #00ffcc;">Results</h2>
      <div style="background: #1a1a2e; border: 2px solid #00ffcc; border-radius: 8px; padding: 30px; margin-bottom: 20px;">
        <div style="font-size: 60px; color: #00ffcc; font-weight: bold; margin-bottom: 10px;">${appState.score.correct}/${appState.score.total}</div>
        <div style="font-size: 36px; color: #ff007f; font-weight: bold; margin-bottom: 20px;">${percentage}%</div>
        <p style="color: #00ffcc; font-size: 20px; margin: 0;">${escapeHTML(message)}</p>
      </div>
      <button id="btn-play-again" style="width: 100%; background: #00ffcc; color: #000; font-weight: bold; border: none; padding: 12px; border-radius: 8px; cursor: pointer; margin-bottom: 10px;">Play Again</button>
      <button id="btn-results-home" style="width: 100%; background: #333; color: #fff; border: none; padding: 12px; border-radius: 8px; cursor: pointer; font-weight: bold;">Home</button>
    </div>`;

  document.getElementById('btn-play-again').addEventListener('click', () => startQuiz(appState.currentQuizMode));
  document.getElementById('btn-results-home').addEventListener('click', () => showHomeScreen());
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = a[i];
    a[i] = a[j];
    a[j] = temp;
  }
  return a;
}

function getRandomWrong(correct, count) {
  const all = appState.userTerms.map(t => t.definition);
  const wrong = all.filter(a => a !== correct);
  if (wrong.length === 0) {
    return ['Sample answer 1', 'Sample answer 2', 'Sample answer 3'].slice(0, count);
  }
  if (wrong.length < count) {
    const needed = count - wrong.length;
    const generic = ['Sample answer ' + (count + 1), 'Sample answer ' + (count + 2), 'Sample answer ' + (count + 3)];
    return shuffle([...wrong, ...generic.slice(0, needed)]);
  }
  return shuffle(wrong).slice(0, count);
}
