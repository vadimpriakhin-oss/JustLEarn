// Quiz Application

class QuizApp {
    constructor() {
        this.questions = [];
        this.score = 0;
    }

    addQuestion(question) {
        this.questions.push(question);
    }

    // Method for True/False Questions
    trueFalseQuestion(question, answer) {
        // Logic for True/False question
    }

    // Method for Multiple Choice Questions
    multipleChoiceQuestion(question, choices, answer) {
        // Logic for Multiple Choice question
    }

    // Method for Fill in the Blank Questions
    fillInTheBlankQuestion(question, answer) {
        // Logic for Fill in the Blank question
    }

    // Method for Drag & Drop Questions
    dragAndDropQuestion(question, items, correctOrder) {
        // Logic for Drag & Drop question
    }

    calculateScore() {
        // Logic for score tracking
    }

    displayScore() {
        console.log(`Your score is: ${this.score}`);
    }
}

// Example usage
let quizApp = new QuizApp();
quizApp.addQuestion({type: 'true/false', text: 'Is the sky blue?', answer: true});

// Add more questions as needed

