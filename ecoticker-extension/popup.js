// popup.js
document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get(['points'], ({ points = 0 }) => {
    document.getElementById('points-display').textContent = 
      `🌱 Your EcoPoints: ${points}`;
  });

  const rewards = {
    500: '$10 Tentree Voucher',
    1000: 'Patagonia Tote Bag',
    2000: 'Allbirds Discount (20%)'
  };

  const list = document.getElementById('rewards-list');
  Object.entries(rewards).forEach(([points, reward]) => {
    const li = document.createElement('li');
    li.textContent = `${points} pts: ${reward}`;
    list.appendChild(li);
  });
});
