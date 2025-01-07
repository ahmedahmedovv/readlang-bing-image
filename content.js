function observeWordChanges() {
    if (window.wordObserver) {
        window.wordObserver.disconnect();
    }
    
    window.wordObserver = new MutationObserver((mutations) => {
        const wordElement = document.querySelector('#wordCardText');
        if (wordElement) {
            const newSearchText = wordElement.textContent.trim();
            chrome.runtime.sendMessage({
                action: "word_updated",
                word: newSearchText
            });
        }
    });

    window.wordObserver.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true
    });
}

observeWordChanges();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "check_word") {
        const wordElement = document.querySelector('#wordCardText');
        if (wordElement) {
            chrome.runtime.sendMessage({
                action: "word_updated",
                word: wordElement.textContent.trim()
            });
        }
    }
}); 