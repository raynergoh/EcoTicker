// popup.js
document.addEventListener('DOMContentLoaded', () => {
    // --- Tab Switching Logic ---
    const tabButtons = {
        home: document.getElementById('home-tab-button'),
        rewards: document.getElementById('rewards-tab-button'),
        settings: document.getElementById('settings-tab-button')
    };

    const tabContents = {
        home: document.getElementById('home-tab-content'),
        rewards: document.getElementById('rewards-tab-content'),
        // Add a settings content div in HTML if you want to use this tab
        // settings: document.getElementById('settings-tab-content') 
    };

    function switchTab(tabName) {
        // Deactivate all buttons and hide all content
        for (const btn of Object.values(tabButtons)) {
            btn.classList.remove('active');
        }
        for (const content of Object.values(tabContents)) {
            if (content) content.classList.remove('active');
        }

        // Activate the selected tab and content
        if (tabButtons[tabName]) tabButtons[tabName].classList.add('active');
        if (tabContents[tabName]) tabContents[tabName].classList.add('active');
    }

    tabButtons.home.addEventListener('click', () => switchTab('home'));
    tabButtons.rewards.addEventListener('click', () => switchTab('rewards'));
    // tabButtons.settings.addEventListener('click', () => switchTab('settings'));

    // --- Data Loading Logic ---
    // Load and display points
    chrome.storage.local.get(['points'], ({ points = 0 }) => {
        document.getElementById('points-display').textContent = points;
    });

    // Define and populate rewards in the rewards tab
    const rewards = {
        500: '$10 Tentree Voucher',
        1000: 'Patagonia Tote Bag',
        2000: 'Allbirds Discount (20%)',
        3500: '1-Year Subscription to a Climate Newsletter'
    };

    const rewardsList = document.getElementById('rewards-list');
    rewardsList.innerHTML = ''; // Clear any existing items
    for (const [points, reward] of Object.entries(rewards)) {
        const li = document.createElement('li');
        li.innerHTML = `${reward} <span class="points-cost">${points} pts</span>`;
        rewardsList.appendChild(li);
    }

    // Set the initial active tab
    switchTab('home');
});
