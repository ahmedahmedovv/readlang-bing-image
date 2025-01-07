function performSearch(query) {
    const resultsContainer = document.getElementById('searchResults');
    const searchUrl = `https://www.bing.com/images/search?q=${encodeURIComponent(query)}`;
    
    resultsContainer.innerHTML = `
        <iframe src="${searchUrl}"></iframe>
    `;
}

document.getElementById('searchButton').addEventListener('click', () => {
    const query = document.getElementById('searchInput').value;
    performSearch(query);
});

document.getElementById('searchInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const query = e.target.value;
        performSearch(query);
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "word_updated" && request.word) {
        document.getElementById('searchInput').value = request.word;
        performSearch(request.word);
    }
});