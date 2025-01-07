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