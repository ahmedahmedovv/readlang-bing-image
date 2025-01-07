// Create and inject sidebar
function createSidebar() {
    console.log('Creating sidebar');
    
    // Check if sidebar already exists
    let sidebar = document.querySelector('.extension-sidebar');
    if (sidebar) {
        return sidebar;
    }

    sidebar = document.createElement('div');
    sidebar.className = 'extension-sidebar closed';
    
    // Load sidebar content from HTML file
    fetch(chrome.runtime.getURL('sidebar.html'))
        .then(response => response.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const content = doc.querySelector('.sidebar-content');
            if (content) {
                sidebar.appendChild(content);
                
                // Find and search for word when sidebar opens
                const searchForWord = () => {
                    const wordElement = document.querySelector('#wordCardText');
                    if (wordElement) {
                        const searchText = wordElement.textContent.trim();
                        console.log('Found word:', searchText);
                        
                        // Update search input with the found text
                        const searchInput = sidebar.querySelector('#searchInput');
                        if (searchInput) {
                            searchInput.value = searchText;
                        }
                        
                        // Perform the search
                        performSearch(searchText);
                    } else {
                        console.log('No word element found');
                        document.querySelector('#searchResults').innerHTML = 
                            '<div style="padding: 20px; text-align: center; color: #666;">No word selected on the page</div>';
                    }
                };
                
                // Add close button functionality
                const closeButton = sidebar.querySelector('#closeButton');
                if (closeButton) {
                    closeButton.addEventListener('click', () => {
                        sidebar.classList.add('closed');
                    });
                }
                
                // Search automatically when sidebar is opened
                sidebar.addEventListener('transitionend', (e) => {
                    if (e.propertyName === 'transform' && !sidebar.classList.contains('closed')) {
                        searchForWord();
                    }
                });
                
                console.log('Sidebar content loaded from HTML');
            }
        })
        .catch(error => console.error('Error loading sidebar:', error));
    
    // Add to document
    document.body.appendChild(sidebar);
    console.log('Sidebar added to page');
    
    return sidebar;
}

// Initialize sidebar when content script loads
let sidebar = createSidebar();

// Listen for toggle message from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Message received:', request);
    if (request.action === "toggle_sidebar") {
        console.log('Toggling sidebar');
        sidebar.classList.toggle('closed');
        // Add debug log for sidebar state
        console.log('Sidebar classes:', sidebar.className);
    }
});

function performSearch(query) {
    const resultsContainer = document.querySelector('#searchResults');
    resultsContainer.innerHTML = 'Loading...';
    
    const searchUrl = `https://www.bing.com/images/search?q=${encodeURIComponent(query)}`;
    
    resultsContainer.innerHTML = `
        <div style="height: calc(100vh - 200px); width: 100%;">
            <iframe 
                src="${searchUrl}"
                style="width: 100%; height: 100%; border: none; border-radius: 4px; background: white;"
                onload="this.parentNode.querySelector('.loading-indicator')?.remove()"
            ></iframe>
            <div class="loading-indicator" style="
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            ">Loading...</div>
        </div>
    `;

    // Set up mutation observer instead of interval
    if (window.wordObserver) {
        window.wordObserver.disconnect();
    }
    
    window.wordObserver = new MutationObserver((mutations) => {
        if (!sidebar.classList.contains('closed')) {
            const wordElement = document.querySelector('#wordCardText');
            if (wordElement) {
                const newSearchText = wordElement.textContent.trim();
                console.log('Content changed, found new word:', newSearchText);
                
                // Update search input with the new text
                const searchInput = sidebar.querySelector('#searchInput');
                if (searchInput) {
                    searchInput.value = newSearchText;
                }
                
                // Perform the new search
                const iframe = resultsContainer.querySelector('iframe');
                if (iframe) {
                    iframe.src = `https://www.bing.com/images/search?q=${encodeURIComponent(newSearchText)}`;
                }
            }
        }
    });

    // Start observing the document with configured parameters
    window.wordObserver.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true
    });
}

// Update cleanup when sidebar is closed
sidebar.addEventListener('transitionend', (e) => {
    if (e.propertyName === 'transform' && sidebar.classList.contains('closed')) {
        if (window.wordObserver) {
            window.wordObserver.disconnect();
            window.wordObserver = null;
        }
    }
}); 