chrome.action.onClicked.addListener((tab) => {
  console.log('Extension icon clicked');
  chrome.tabs.sendMessage(tab.id, {action: "toggle_sidebar"}, (response) => {
    if (chrome.runtime.lastError) {
      console.error('Error:', chrome.runtime.lastError);
    }
  });
}); 