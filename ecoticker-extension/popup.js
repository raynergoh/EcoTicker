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

    // Show website/brand sustainability score
    if (window.chrome && chrome.tabs) {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            const tab = tabs[0];
            if (tab && tab.url) {
                // Extract domain/brand
                let brand = null;
                const url = new URL(tab.url);
                if (url.hostname.includes('nike')) brand = 'Nike';
                else if (url.hostname.includes('ikea')) brand = 'IKEA';
                else if (url.hostname.includes('amazon')) brand = 'Amazon';
                else if (url.hostname.includes('h&m')) brand = 'H&M';
                else if (url.hostname.includes('zara')) brand = 'Zara';
                else if (url.hostname.includes('patagonia')) brand = 'Patagonia';
                else if (url.hostname.includes('tentree')) brand = 'Tentree';
                else if (url.hostname.includes('allbirds')) brand = 'Allbirds';

                if (brand) {
                    fetch(chrome.runtime.getURL('esg-data.json'))
                        .then(r => r.json())
                        .then(data => {
                            const score = data[brand];
                            document.getElementById('brand-score-value').textContent = score ? score : '-';
                        });
                }
            }
        });
    }

    // Sustainability analysis logic
    const analyzeBtn = document.getElementById('analyze-btn');
    const analysisContainer = document.getElementById('sustainability-analysis-container');
    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', () => {
            if (window.chrome && chrome.tabs) {
                chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                    const tab = tabs[0];
                    if (tab && tab.url) {
                        if (window.analyzeProductSustainability) {
                            document.getElementById('sustainability-score').textContent = 'Loading...';
                            document.getElementById('sustainability-analysis').textContent = '';
                            document.getElementById('sustainability-alternative').textContent = '';
                            analysisContainer.style.display = 'block';
                            window.analyzeProductSustainability(tab.url).then(result => {
                                document.getElementById('sustainability-score').textContent = `Sustainability Score: ${result.sustainabilityScore}/100`;
                                document.getElementById('sustainability-analysis').textContent = result.analysis;
                                if (result.alternatives && result.alternatives.length > 0) {
                                    const alt = result.alternatives[0];
                                    document.getElementById('sustainability-alternative').innerHTML = `<a href="${alt.url}" target="_blank">${alt.name}</a> (Score: ${alt.sustainabilityScore})<br><span style='font-size:12px;color:#28B463;'>${alt.reason}</span>`;
                                }
                            }).catch(() => {
                                document.getElementById('sustainability-score').textContent = 'Could not analyze product.';
                            });
                        }
                    }
                });
            }
        });
    }
});
