// Handle initial installation
chrome.runtime.onInstalled.addListener(() => {
  // Store a flag to indicate new tab override
  chrome.storage.local.set({ override: true });
});

// Redirect Chrome's default new tab to searchparty.html
chrome.tabs.onCreated.addListener((tab) => {
  if (tab.url === "chrome://newtab/") {
    chrome.tabs.update(tab.id, {
      url: `chrome-extension://${chrome.runtime.id}/searchparty.html`,
    });
  }
});

// Open searchparty.html when the extension icon is clicked
chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({
    url: `chrome-extension://${chrome.runtime.id}/searchparty.html`,
  });
});
