// content.js
const SITE_CONFIGS = {
  'nike.com': {
    type: 'single_brand',
    brand: 'Nike',
    // CHANGE: Added a URL for the brand's logo
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg',
    injectionPoint: 'body'
  },
  'ikea.com': {
    type: 'single_brand',
    brand: 'IKEA',
    // You would add IKEA's logo URL here
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Ikea_logo.svg',
    injectionPoint: 'body'
  },
  'amazon.com': {
    type: 'marketplace',
    productSelector: '[data-component-type="s-search-result"]',
    brandSelector: '.s-line-clamp-1 .a-size-base-plus'
  }
};

async function runEcoTicker() {
  const esgData = await fetch(chrome.runtime.getURL('esg-data.json'))
    .then(response => response.json());
  const currentHostname = window.location.hostname;
  const siteConfig = Object.keys(SITE_CONFIGS).find(domain => currentHostname.includes(domain));
  if (siteConfig) {
    const config = SITE_CONFIGS[siteConfig];
    if (config.type === 'single_brand') handleSingleBrandSite(esgData, config);
    else handleMarketplaceSite(esgData, config);
  }
}

// CHANGE: The innerHTML of the banner is completely rebuilt for the new design.
function handleSingleBrandSite(esgData, config) {
  const esgGrade = esgData[config.brand];
  if (esgGrade && !document.querySelector('.ecoticker-site-banner')) {
    const banner = document.createElement('div');
    banner.className = 'ecoticker-site-banner';
    banner.innerHTML = `
      <div class="banner-content">
        <div class="brand-info">
          <img src="${config.logoUrl}" class="brand-logo" alt="${config.brand} Logo">
          <span>${config.brand}</span>
        </div>
        <div class="esg-rating-badge grade-${esgGrade}">
          <span class="rating-text">ESG RATING</span>
          <span class="rating-grade">${esgGrade}</span>
        </div>
      </div>
    `;
    document.querySelector(config.injectionPoint)?.prepend(banner);
  }
}

// Marketplace functions remain the same
function handleMarketplaceSite(esgData, config) { /* ... no changes here ... */ }
function scanForProducts(esgData, config) { /* ... no changes here ... */ }
function injectProductBadge(targetElement, grade) { /* ... no changes here ... */ }

runEcoTicker();
