// Enhanced XSS Protection and Error Handling

function safeExecute(fn) {
    try {
        if (typeof fn !== 'function') {
            throw new Error('Invalid function');
        }
        fn();
    } catch (error) {
        console.error('Error during execution:', error.message);
    }
}

// Function to handle user input with XSS protection using native escaping
function handleUserInput(input) {
    const sanitizedInput = String(input)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    console.log('Sanitized Input:', sanitizedInput);
    return sanitizedInput;
}