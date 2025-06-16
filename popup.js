// popup.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.productName) {
        document.getElementById('product-info').textContent = `Product: ${message.productName}`;
        document.getElementById('score').textContent = `Score: ${message.score || "N/A"}`;
        // Add more display logic for alternatives, etc.
    }
});
