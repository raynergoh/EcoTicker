// background.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'ADD_POINTS') {
    chrome.storage.local.get(['points'], ({ points = 0 }) => {
      const newTotal = points + message.points;
      chrome.storage.local.set({ points: newTotal });
    });
  }
});
