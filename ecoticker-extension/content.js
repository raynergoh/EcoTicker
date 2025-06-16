// content.js - Injects ESG badges
document.addEventListener('DOMContentLoaded', async () => {
  const esgData = await fetch(chrome.runtime.getURL('esg-data.json'))
    .then(response => response.json());
  
  const productElements = document.querySelectorAll('.product, .item, .listing');
  
  productElements.forEach(product => {
    const brand = product.querySelector('.brand')?.textContent.trim();
    if (!brand) return;

    const esgGrade = esgData[brand] || 'N/A';
    const badge = createEsgBadge(esgGrade);
    product.appendChild(badge);
    
    if(esgGrade !== 'N/A') {
      addPurchaseTracking(product, esgGrade);
    }
  });
});

function createEsgBadge(grade) {
  const badge = document.createElement('div');
  badge.className = 'esg-badge';
  badge.innerHTML = `
    <div class="grade ${grade}">${grade}</div>
    <div class="ticker">EcoTicker Rating</div>
  `;
  return badge;
}

function addPurchaseTracking(product, grade) {
  const buyButton = product.querySelector('button, .add-to-cart');
  if (!buyButton) return;

  buyButton.addEventListener('click', () => {
    const points = { 'A': 100, 'B': 50, 'C': 25 }[grade];
    chrome.runtime.sendMessage({ type: 'ADD_POINTS', points });
  });
}
