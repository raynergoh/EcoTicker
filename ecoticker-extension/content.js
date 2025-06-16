// content.js

/**
 * Configuration for different e-commerce sites.
 * This makes the extension adaptable and easy to expand.
 */
const SITE_CONFIGS = {
  'nike.com': {
    type: 'single_brand',
    brand: 'Nike',
    injectionPoint: 'body', // The element where the banner will be injected
    injectionMethod: 'prepend' // 'prepend' adds the banner at the very top
  },
  'ikea.com': {
    type: 'single_brand',
    brand: 'IKEA',
    injectionPoint: 'body',
    injectionMethod: 'prepend'
  },
  'amazon.com': {
    type: 'marketplace',
    productSelector: '[data-component-type="s-search-result"]',
    brandSelector: '.s-line-clamp-1 .a-size-base-plus'
  }
};

/**
 * Main function that runs when the page loads.
 */
async function runEcoTicker() {
  const esgData = await fetch(chrome.runtime.getURL('esg-data.json'))
    .then(response => response.json());

  const currentHostname = window.location.hostname;
  const siteConfig = Object.keys(SITE_CONFIGS).find(domain => currentHostname.includes(domain));

  if (siteConfig) {
    const config = SITE_CONFIGS[siteConfig];
    if (config.type === 'single_brand') {
      handleSingleBrandSite(esgData, config);
    } else {
      handleMarketplaceSite(esgData, config);
    }
  }
}

/**
 * Injects a single banner for sites like nike.com.
 */
function handleSingleBrandSite(esgData, config) {
  const esgGrade = esgData[config.brand];
  if (esgGrade && !document.querySelector('.ecoticker-site-banner')) {
    const banner = document.createElement('div');
    banner.className = 'ecoticker-site-banner';
    banner.innerHTML = `
      <div class="banner-content">
        🌱 <strong>${config.brand}</strong> has an EcoTicker ESG Rating of <span class="grade ${esgGrade}">${esgGrade}</span>
      </div>
    `;
    document.querySelector(config.injectionPoint)?.prepend(banner);
  }
}

/**
 * Scans for product cards and injects individual badges on marketplaces.
 */
function handleMarketplaceSite(esgData, config) {
  const observer = new MutationObserver(() => {
    scanForProducts(esgData, config);
  });
  scanForProducts(esgData, config); // Initial scan
  observer.observe(document.body, { childList: true, subtree: true });
}

function scanForProducts(esgData, config) {
  document.querySelectorAll(config.productSelector).forEach(productEl => {
    if (productEl.querySelector('.esg-badge')) return; // Skip if badge exists

    const brandEl = productEl.querySelector(config.brandSelector);
    if (brandEl) {
      const brandName = brandEl.textContent.trim();
      if (esgData[brandName]) {
        injectProductBadge(productEl, esgData[brandName]);
      }
    }
  });
}

/**
 * Creates and injects the small product badge.
 */
function injectProductBadge(targetElement, grade) {
  const badge = document.createElement('div');
  badge.className = 'esg-badge';
  badge.innerHTML = `<div class="grade ${grade}">${grade}</div><div class="ticker">Eco-Rating</div>`;
  targetElement.style.position = 'relative';
  targetElement.appendChild(badge);
}

runEcoTicker();
