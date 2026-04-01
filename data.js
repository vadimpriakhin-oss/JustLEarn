function safeParseJSON(jsonString) {
    try {
        return JSON.parse(jsonString);
    } catch (error) {
        console.error('Failed to parse JSON: ', error);
        return null;
    }
}

function escapeHTML(str) {
    if (typeof str !== 'string') return str;
    return str.replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;')
              .replace(/'/g, '&#039;');
}

function processData(jsonString) {
    const data = safeParseJSON(jsonString);
    if (data !== null) {
        // Assuming data is an object we want to escape
        return escapeHTML(JSON.stringify(data, null, 2));
    }
    return ''; // Return empty string if parsing fails
}