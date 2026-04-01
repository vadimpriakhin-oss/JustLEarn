// Function to escape HTML
function escapeHTML(string) {
    return string.replace(/&/g, '&amp;')
                 .replace(/</g, '&lt;')
                 .replace(/>/g, '&gt;')
                 .replace(/"/g, '&quot;')
                 .replace(/'/g, '&#039;');
}

// Properly defined function which uses the corrected regex
function processData(jsonData) {
    // Example of jsonData usage
    if(!jsonData) return;
    const escapedData = escapeHTML(jsonData);
    // Further processing...
}

// Dummy jsonData example moved into a function
function exampleUsage() {
    const jsonData = '{ "key": "value" }'; // Example JSON data
    processData(jsonData);
}

// Call the example usage function
exampleUsage();