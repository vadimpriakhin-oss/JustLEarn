// Navigation Functions
function showHomePage() {
    // Logic to show the home page
}

function showCreateModeSelection() {
    // Logic to show the create mode selection page
}

function showAddTermPage() {
    // Logic to show the add term page
}

// Event Listeners for page navigation
document.getElementById('homeButton').addEventListener('click', showHomePage);
document.getElementById('createModeButton').addEventListener('click', showCreateModeSelection);
document.getElementById('addTermButton').addEventListener('click', showAddTermPage);

// DOMContentLoaded event listener to handle button clicks
window.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('homeButton').addEventListener('click', showHomePage);
    document.getElementById('createModeButton').addEventListener('click', showCreateModeSelection);
    document.getElementById('addTermButton').addEventListener('click', showAddTermPage);
});