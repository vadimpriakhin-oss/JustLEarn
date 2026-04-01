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
              .replace(/'/g, '&#039;')
              .replace(/`/g, '&#x60;')
              .replace(/\//g, '&#x2F;');
}

function processData(jsonString) {
    const data = safeParseJSON(jsonString);
    if (data !== null) {
        // Convert data to JSON string first, then escape HTML
        const jsonStr = JSON.stringify(data, null, 2);
        return escapeHTML(jsonStr);
    }
    return ''; // Return empty string if parsing fails
}