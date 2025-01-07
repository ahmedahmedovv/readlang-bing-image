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
    
    // Add immediate content while HTML loads
    sidebar.innerHTML = '<div class="sidebar-content"><h1>Hello World!</h1></div>';
    
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