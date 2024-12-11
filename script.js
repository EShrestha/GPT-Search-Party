// Handle initial installation
chrome.runtime.onInstalled.addListener(() => {
    // Override new tab page
    chrome.storage.local.set({ 'override': true });
});

// Override Chrome's new tab page
chrome.tabs.onCreated.addListener((tab) => {
    if (tab.url === 'chrome://newtab/') {
        chrome.tabs.update(tab.id, {
            url: 'searchparty.html'
        });
    }
});

// Handle extension icon click
chrome.action.onClicked.addListener(() => {
    chrome.tabs.create({
        url: 'searchparty.html'
    });
});




