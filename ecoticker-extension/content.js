// content.js
// No analyze button injection, only ESG banner logic

const SITE_CONFIGS = {
  'nike.com': {
    type: 'single_brand',
    brand: 'Nike',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg',
    injectionPoint: 'body',
    productSelector: '.product-card'
  },
  'ikea.com': {
    type: 'single_brand',
    brand: 'IKEA',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Ikea_logo.svg',
    injectionPoint: 'body',
    productSelector: '.product-pip'
  },
  'amazon.com': {
    type: 'marketplace',
    productSelector: '[data-component-type="s-search-result"]',
    brandSelector: '.s-line-clamp-1 .a-size-base-plus'
  }
};

async function runEcoTicker() {
  try {
    const response = await fetch(chrome.runtime.getURL('esg-data.json'));
    if (!response.ok) {
      throw new Error('Failed to fetch ESG data');
    }
    const esgData = await response.json();
    
    const currentHostname = window.location.hostname;
    const siteConfig = Object.keys(SITE_CONFIGS).find(domain => currentHostname.includes(domain));
    
    if (siteConfig) {
      const config = SITE_CONFIGS[siteConfig];
      if (!config || typeof config !== 'object') {
        console.error('Invalid site configuration');
        return;
      }

      if (config.type === 'single_brand') {
        handleSingleBrandSite(esgData, config);
      } else if (config.type === 'marketplace') {
        handleMarketplaceSite(esgData, config);
      }
    }
  } catch (error) {
    console.error('Error running EcoTicker:', error);
  }
}

function handleSingleBrandSite(esgData, config) {
  if (!esgData || !config) return;

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
    
    const injectionPoint = document.querySelector(config.injectionPoint);
    if (injectionPoint) {
      injectionPoint.prepend(banner);
    }
  }
}

function handleMarketplaceSite(esgData, config) {
  if (!esgData || !config) return;

  const products = document.querySelectorAll(config.productSelector);
  products.forEach(product => {
    const brandElement = product.querySelector(config.brandSelector);
    if (brandElement) {
      const brand = brandElement.textContent.trim();
      const grade = esgData[brand];
      if (grade) {
        injectProductBadge(product, grade);
      }
    }
  });
}

function injectProductBadge(targetElement, grade) {
  if (!targetElement || !grade) return;

  const badge = document.createElement('div');
  badge.className = `ecoticker-badge grade-${grade}`;
  badge.innerHTML = `
    <span class="badge-text">ESG</span>
    <span class="badge-grade">${grade}</span>
  `;
  targetElement.appendChild(badge);
}

// Initialize the extension
let observer = null;

function initializeEcoTicker() {
  if (observer) {
    observer.disconnect();
  }
  runEcoTicker();
  observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length) {
        runEcoTicker();
      }
    });
  });
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

initializeEcoTicker();
window.addEventListener('unload', () => {
  if (observer) {
    observer.disconnect();
  }
});
