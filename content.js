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
                
                // Add search functionality
                const searchButton = sidebar.querySelector('#searchButton');
                const searchInput = sidebar.querySelector('#searchInput');
                
                searchButton.addEventListener('click', () => performSearch(searchInput.value));
                searchInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        performSearch(searchInput.value);
                    }
                });
                
                console.log('Sidebar content loaded from HTML');
            }
        })
        .catch(error => console.error('Error loading sidebar:', error));
    
    // Add to document
    document.body.appendChild(sidebar);
    console.log('Sidebar added to page');
    
    const closeButton = sidebar.querySelector('#closeButton');
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            sidebar.classList.add('closed');
        });
    }
    
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
    
    // Using Bing image search
    const searchUrl = `https://www.bing.com/images/search?q=${encodeURIComponent(query)}`;
    
    // Create an iframe with loading indicator
    resultsContainer.innerHTML = `
        <div style="height: calc(100vh - 200px); width: 100%;">
            <iframe 
                src="${searchUrl}"
                style="
                    width: 100%;
                    height: 100%;
                    border: none;
                    border-radius: 4px;
                    background: white;
                "
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
} 