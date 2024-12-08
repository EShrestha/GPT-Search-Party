document.addEventListener('keydown', function(event) {
    // Check if both Ctrl and Enter keys are pressed
    if (event.ctrlKey && event.key === 'Enter') {
        // Get the focused input
        const activeElement = document.activeElement;
        
        if (activeElement.id === 'default-search') {
            // Handle default search
            const searchQuery = activeElement.value;
            window.open(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`, '_blank');
        } else if (activeElement.id === 'custom-search') {
            // Handle ChatGPT search
            const searchQuery = activeElement.value;
            window.open(`https://chat.openai.com/`, '_blank');
        }
    }
});
