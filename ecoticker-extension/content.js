(function() {
  // Try to extract product details using DOM selectors.
  let productName = document.querySelector('#productTitle')?.innerText?.trim();
  let brand = document.querySelector('#bylineInfo')?.innerText?.trim();
  let material = document.querySelector('.material-info')?.innerText?.trim();

  // Example: You could also extract price, category, etc.

  // Send the data to the popup or background script.
  chrome.runtime.sendMessage({ productName, brand, material });
})();
