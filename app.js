// Import necessary libraries
import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { Quiz } from './Quiz';
import { TermsCreation } from './TermsCreation';

// Set the initial state
const initialState = {
    quizMode: null,
    terms: [],
    score: 0
};

// Reducer to manage state
const reducer = (state = initialState, action) => {
    switch(action.type) {
        case 'ADD_TERM':
            return { ...state, terms: [...state.terms, action.term] };
        case 'SET_MODE':
            return { ...state, quizMode: action.mode };
        case 'UPDATE_SCORE':
            return { ...state, score: action.score };
        default:
            return state;
    }
};

// Create redux store
const store = createStore(reducer);

// App component
function App() {
    const [showTermsCreation, setShowTermsCreation] = React.useState(false);

    return (
        <Provider store={store}>
            <div style={{ backgroundColor: '#0a0a0a', color: '#00ffcc', height: '100vh', padding: '20px' }}>
                <h1 style={{ textAlign: 'center', color: '#00ffcc', fontFamily: 'Neon', fontSize: '2em' }}>JustLEarn</h1>
                <button style={{ backgroundColor: '#00ffcc', color: '#0a0a0a', border: 'none', padding: '10px', cursor: 'pointer' }} onClick={() => setShowTermsCreation(!showTermsCreation)}>Create Terms</button>
                {showTermsCreation && <TermsCreation />}
                <Quiz />
            </div>
        </Provider>
    );
}

export default App;