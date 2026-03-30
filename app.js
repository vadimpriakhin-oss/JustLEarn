let appState = {
    currentScreen: 'home',
    userTerms: [],
    currentQuizIndex: 0,
    score: { correct: 0, total: 0 },
    currentQuizMode: null,
    shuffledTerms: []
};

const DEFAULT_TERMS = [
    { term: 'Photosynthesis', definition: 'Process by which plants convert sunlight into chemical energy' },
    { term: 'Mitochondria', definition: 'Powerhouse of the cell responsible for energy production' },
    { term: 'Osmosis', definition: 'Movement of water across a semipermeable membrane' },
    { term: 'Enzyme', definition: 'Protein that speeds up chemical reactions in cells' },
    { term: 'DNA', definition: 'Molecule that carries genetic instructions for life' }
];

document.addEventListener('DOMContentLoaded', () => {
    document.body.style.backgroundColor = '#0a0a0a';
    loadTerms();
    showHomeScreen();
});

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
                <button onclick="startQuiz('true-false')" style="background: linear-gradient(135deg, #00ffcc, #00aa88); color: #000; border: none; padding: 15px; border-radius: 8px; cursor: pointer; font-weight: bold;">🔵 True/False</button>
                <button onclick="startQuiz('multiple-choice')" style="background: linear-gradient(135deg, #00ffcc, #00aa88); color: #000; border: none; padding: 15px; border-radius: 8px; cursor: pointer; font-weight: bold;">🎯 Multiple Choice</button>
                <button onclick="startQuiz('fill-blank')" style="background: linear-gradient(135deg, #00ffcc, #00aa88); color: #000; border: none; padding: 15px; border-radius: 8px; cursor: pointer; font-weight: bold;">✏️ Fill the Blank</button>
                <button onclick="showCreateScreen()" style="background: linear-gradient(135deg, #ff007f, #ff4466); color: #fff; border: none; padding: 15px; border-radius: 8px; cursor: pointer; font-weight: bold;">➕ Create Terms</button>
            </div>
        </div>
    `;
}

function showCreateScreen() {
    const main = document.querySelector('main');
    main.style.backgroundColor = '#0a0a0a';
    main.innerHTML = `
        <div style="padding: 20px; max-width: 600px; margin: 0 auto; min-height: 100vh;">
            <h2 style="text-align: center; margin-bottom: 30px; color: #00ffcc;">📚 Create Terms</h2>
            <div id="termsContainer"></div>
            <div style="display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; margin-bottom: 20px;">
                <button onclick="addTermField()" style="background: #00ffcc; color: #000; border: none; padding: 12px 20px; border-radius: 8px; cursor: pointer; font-weight: bold;">+ Add Term</button>
                <button onclick="saveAndHome()" style="background: #00aa00; color: #fff; border: none; padding: 12px 20px; border-radius: 8px; cursor: pointer; font-weight: bold;">✅ Save</button>
                <button onclick="showHomeScreen()" style="background: #555; color: #fff; border: none; padding: 12px 20px; border-radius: 8px; cursor: pointer; font-weight: bold;">🏠 Home</button>
            </div>
            <div id="termsList"></div>
        </div>
    `;
    renderTermFields();
    renderTermsList();
}

function renderTermFields() {
    const container = document.getElementById('termsContainer');
    container.innerHTML = '';
    appState.userTerms.forEach((item, index) => {
        container.innerHTML += `
            <div style="background: #1a1a2e; border: 2px solid #00ffcc; border-radius: 8px; padding: 15px; margin-bottom: 15px;">
                <input type="text" placeholder="Term" value="${item.term}" onchange="appState.userTerms[${index}].term = this.value" style="width: 100%; background: #0f0f1e; color: #00ffcc; border: 1px solid #00ffcc; padding: 10px; border-radius: 5px; margin-bottom: 10px; font-size: 14px; box-sizing: border-box;">
                <textarea placeholder="Definition" onchange="appState.userTerms[${index}].definition = this.value" style="width: 100%; background: #0f0f1e; color: #00ffcc; border: 1px solid #00ffcc; padding: 10px; border-radius: 5px; margin-bottom: 10px; min-height: 60px; font-size: 14px; box-sizing: border-box;">${item.definition}</textarea>
                <button onclick="removeTermField(${index})" style="width: 100%; background: #ff3333; color: white; border: none; padding: 8px; border-radius: 5px; cursor: pointer; font-weight: bold;">🗑️ Delete</button>
            </div>
        `;
    });
}

function addTermField() {
    appState.userTerms.push({ term: '', definition: '' });
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
        html += `<li style="background: #1a1a2e; padding: 12px; margin: 8px 0; border-left: 4px solid #ff007f; border-radius: 4px; color: #fff;"><strong style="color: #00ffcc;">${i+1}. ${item.term}</strong><br/><span style="color: #aaa; font-size: 12px;">${item.definition}</span></li>`;
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
    
    let content = `<div style="padding: 20px; max-width: 600px; margin: 0 auto; min-height: 100vh;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
            <h2 style="margin: 0; color: #00ffcc;">${modeName}</h2>
            <div style="color: #00ffcc; font-weight: bold;">Score: ${appState.score.correct}/${appState.score.total}</div>
        </div>
        <div style="background: #1a1a2e; border: 1px solid #00ffcc; border-radius: 10px; height: 8px; margin-bottom: 20px; overflow: hidden;">
            <div style="background: linear-gradient(90deg, #00ffcc, #ff007f); height: 100%; width: ${(progress / total) * 100}%;"></div>
        </div>
        <p style="color: #888; text-align: center;">Question ${progress}/${total}</p>
        <div style="background: #1a1a2e; border: 2px solid #00ffcc; border-radius: 8px; padding: 20px; margin-bottom: 20px; text-align: center;">
            <h3 style="margin: 0; color: #00ffcc;">${term.term}</h3>
        </div>`;
    
    if (appState.currentQuizMode === 'true-false') {
        content += `<div style="display: flex; gap: 10px;">
            <button onclick="checkAnswer('true')" style="flex: 1; background: #00aa00; color: white; border: none; padding: 15px; border-radius: 8px; cursor: pointer; font-weight: bold;">True</button>
            <button onclick="checkAnswer('false')" style="flex: 1; background: #aa0000; color: white; border: none; padding: 15px; border-radius: 8px; cursor: pointer; font-weight: bold;">False</button>
        </div>`;
    } else if (appState.currentQuizMode === 'multiple-choice') {
        const wrong = getRandomWrong(term.definition, 3);
        const options = shuffle([term.definition, ...wrong]);
        content += '<div style="display: flex; flex-direction: column; gap: 10px;">';
        options.forEach((opt, i) => {
            const safeOpt = opt.replace(/'/g, "\\'").replace(/"/g, '\\"');
            content += `<button onclick="checkAnswer(\\"${safeOpt}\\")" style="background: #1a1a2e; color: #00ffcc; border: 2px solid #00ffcc; padding: 15px; border-radius: 8px; cursor: pointer; text-align: left; font-weight: bold;">${String.fromCharCode(65+i)}: ${opt}</button>`;
        });
        content += '</div>';
    } else if (appState.currentQuizMode === 'fill-blank') {
        content += `<input type="text" id="answerInput" placeholder="Type answer" style="width: 100%; background: #0f0f1e; color: #00ffcc; border: 2px solid #00ffcc; padding: 12px; border-radius: 8px; margin-bottom: 10px; font-size: 16px; box-sizing: border-box;">
            <button onclick="checkFillBlank()" style="width: 100%; background: #00ffcc; color: #000; border: none; padding: 12px; border-radius: 8px; cursor: pointer; font-weight: bold;">Submit</button>`;
    }
    
    content += `<button onclick="showHomeScreen()" style="width: 100%; margin-top: 20px; background: #333; color: #fff; border: none; padding: 12px; border-radius: 8px; cursor: pointer; font-weight: bold;">Home</button></div>`;
    
    document.querySelector('main').style.backgroundColor = '#0a0a0a';
    document.querySelector('main').innerHTML = content;
}

function checkAnswer(userAnswer) {
    const correct = appState.shuffledTerms[appState.currentQuizIndex].definition;
    let isCorrect = false;
    
    if (appState.currentQuizMode === 'true-false') {
        isCorrect = (userAnswer === 'true') === (correct.toLowerCase().includes('true'));
    } else {
        isCorrect = userAnswer === correct;
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

function checkFillBlank() {
    const userAnswer = document.getElementById('answerInput').value.trim().toLowerCase();
    const correct = appState.shuffledTerms[appState.currentQuizIndex].definition.toLowerCase();
    
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
    main.innerHTML = `<div style="padding: 40px 20px; max-width: 600px; margin: 0 auto; text-align: center; display: flex; flex-direction: column; justify-content: center; min-height: 100vh;">
        <h2 style="color: #00ffcc;">Results</h2>
        <div style="background: #1a1a2e; border: 2px solid #00ffcc; border-radius: 8px; padding: 30px; margin-bottom: 20px;">
            <div style="font-size: 60px; color: #00ffcc; font-weight: bold; margin-bottom: 10px;">${appState.score.correct}/${appState.score.total}</div>
            <div style="font-size: 36px; color: #ff007f; font-weight: bold; margin-bottom: 20px;">${percentage}%</div>
            <p style="color: #00ffcc; font-size: 20px; margin: 0;">${message}</p>
        </div>
        <button onclick="startQuiz('${appState.currentQuizMode}')" style="width: 100%; background: #00ffcc; color: #000; font-weight: bold; border: none; padding: 12px; border-radius: 8px; cursor: pointer; margin-bottom: 10px;">Play Again</button>
        <button onclick="showHomeScreen()" style="width: 100%; background: #333; color: #fff; border: none; padding: 12px; border-radius: 8px; cursor: pointer; font-weight: bold;">Home</button>
    </div>`;
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
    return shuffle(wrong).slice(0, count);
}
