const quizData = {
    trueFalseQuestions: [
        { question: "The Earth is flat.", answer: false },
        { question: "Cats are mammals.", answer: true },
        { question: "Water boils at 100°C at sea level.", answer: true },
        { question: "The sun revolves around the Earth.", answer: false },
        { question: "Humans have 206 bones in their body.", answer: true },
        { question: "Gold is heavier than silver.", answer: true },
        { question: "A spider has six legs.", answer: false },
        { question: "The Amazon is the longest river in the world.", answer: false }
    ],
    multipleChoiceQuestions: [
        {
            question: "What is the capital of France?",
            options: ["Berlin", "Madrid", "Paris", "Rome"],
            answer: "Paris"
        },
        {
            question: "Which planet is known as the Red Planet?",
            options: ["Earth", "Mars", "Jupiter", "Saturn"],
            answer: "Mars"
        },
        {
            question: "What is the largest ocean on Earth?",
            options: ["Atlantic", "Indian", "Arctic", "Pacific"],
            answer: "Pacific"
        },
        {
            question: "How many sides does a hexagon have?",
            options: ["5", "6", "7", "8"],
            answer: "6"
        },
        {
            question: "Which element has the chemical symbol 'O'?",
            options: ["Gold", "Oxygen", "Osmium", "Oganesson"],
            answer: "Oxygen"
        }
    ],
    fillInTheBlankQuestions: [
        { question: "The tallest mountain in the world is ________.", answer: "Mount Everest", alternates: ["Mt Everest", "Mt. Everest", "Everest"] },
        { question: "The chemical symbol for water is ________.", answer: "H2O" },
        { question: "The capital of Japan is ________.", answer: "Tokyo" },
        { question: "The largest planet in our solar system is ________.", answer: "Jupiter" },
        { question: "The number of continents on Earth is ________.", answer: "7" }
    ],
    dragAndDropItems: [
        { item: "Apple",    category: "Fruits"     },
        { item: "Carrot",   category: "Vegetables" },
        { item: "Dog",      category: "Animals"    },
        { item: "Banana",   category: "Fruits"     },
        { item: "Broccoli", category: "Vegetables" },
        { item: "Cat",      category: "Animals"    }
    ]
};