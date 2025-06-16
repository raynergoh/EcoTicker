// content.js

/**
 * Main function that runs when the e-commerce page is loaded.
 */
async function main() {
  // 1. Fetch the ESG data from the extension's local files.
  // chrome.runtime.getURL is required to access extension files from a content script [3].
  const esgData = await fetch(chrome.runtime.getURL('esg-data.json'))
    .then(response => response.json());

  // 2. Find all potential product listings on the page.
  // Note: These selectors are examples and need to be tailored for each site.
  const productElements = document.querySelectorAll(
    '[data-component-type="s-search-result"], .product-item, .w-_JS' 
  );

  // 3. Process each product element found.
  productElements.forEach(productEl => {
    const brandName = findBrand(productEl);
    if (brandName && esgData[brandName]) {
      const esgGrade = esgData[brandName];
      injectBadge(productEl, esgGrade);
    }
  });
}

/**
 * Finds the brand name within a product element. This is the most complex part,
 * as every website has a different HTML structure.
 * @param {HTMLElement} element - The container element for a single product.
 * @returns {string|null} - The found brand name or null.
 */
function findBrand(element) {
  // Try a few common selector patterns for brand names
  const selectors = ['[data-cy="item-brand"]', '.s-line-clamp-1 .a-size-base-plus'];
  for (const selector of selectors) {
    const brandElement = element.querySelector(selector);
    if (brandElement && brandElement.textContent.trim()) {
      return brandElement.textContent.trim();
    }
  }
  // Add more specific logic for sites like IKEA, which might not list external brands.
  if (window.location.hostname.includes("ikea.com")) return "IKEA";
  return null;
}

/**
 * Creates and injects the ESG badge into the specified product element.
 * @param {HTMLElement} targetElement - The element to attach the badge to.
 * @param {string} grade - The ESG grade ('A', 'B', 'C').
 */
function injectBadge(targetElement, grade) {
  // Avoid injecting duplicate badges
  if (targetElement.querySelector('.esg-badge')) return;

  const badge = document.createElement('div');
  badge.className = 'esg-badge';
  badge.innerHTML = `
    <div class="grade ${grade}">${grade}</div>
    <div class="ticker">Eco-Rating</div>
  `;
  
  // Position the badge relative to the target element
  targetElement.style.position = 'relative';
  targetElement.appendChild(badge);
}

// Run the script
main();
