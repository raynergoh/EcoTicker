// popup.js
document.addEventListener('DOMContentLoaded', () => {
    // --- Tab Switching Logic ---
    const tabButtons = {
        home: document.querySelector('#home-tab-button'),
        rewards: document.querySelector('#rewards-tab-button'),
        about: document.querySelector('#about-tab-button')
    };

    const tabContents = {
        home: document.getElementById('home-tab-content'),
        rewards: document.getElementById('rewards-tab-content'),
        about: document.getElementById('about-tab-content')
    };

    function switchTab(tabName) {
        // Deactivate all buttons and hide all content
        for (const btn of Object.values(tabButtons)) {
            btn.classList.remove('active');
        }
        for (const content of Object.values(tabContents)) {
            content.classList.remove('active');
        }
        // Activate selected
        tabButtons[tabName].classList.add('active');
        tabContents[tabName].classList.add('active');
    }

    // Add event listeners
    for (const [tabName, btn] of Object.entries(tabButtons)) {
        btn.addEventListener('click', () => switchTab(tabName));
    }

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
    rewardsList.innerHTML = '';
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
                            const brandScoreElem = document.getElementById('brand-score-value');
                            if (brandScoreElem) {
                                brandScoreElem.textContent = score ? score : '-';
                            }
                        });
                }
            }
        });
    }

    // Replace sustainability score display with Analyze Sustainability button
    const analyzeButton = document.getElementById('analyze-button');
    const scoreDisplay = document.getElementById('score-display');

    analyzeButton.addEventListener('click', async () => {
        if (analyzeButton.classList.contains('loading')) {
            return;
        }

        analyzeButton.classList.add('loading');
        analyzeButton.innerHTML = `
            <span class="icon">⭕</span>
            <span>Analyzing...</span>
        `;
        scoreDisplay.style.display = 'none';

        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            const productData = {
                url: tab.url,
                name: tab.title
            };

            // Call the backend API
            const response = await fetch('http://localhost:3000/api/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ productData })
            });

            if (!response.ok) {
                throw new Error('Failed to analyze product');
            }

            const analysis = await response.json();
            const score = analysis.overallScore;
            const scoreClass = score >= 80 ? 'excellent' : 
                                 score >= 60 ? 'good' : 
                                 score >= 40 ? 'fair' : 'poor';

            scoreDisplay.className = `score-display score-${scoreClass}`;
            scoreDisplay.style.display = 'block';
            scoreDisplay.querySelector('.score-value').textContent = `${score}/100`;
            scoreDisplay.querySelector('.score-summary').textContent = analysis.summary;

            analyzeButton.classList.remove('loading');
            analyzeButton.innerHTML = `
                <span class="icon">🔄</span>
                <span>Analyze Again</span>
            `;

        } catch (error) {
            console.error('Error analyzing product:', error);
            analyzeButton.classList.remove('loading');
            analyzeButton.innerHTML = `
                <span class="icon">❌</span>
                <span>Try Again</span>
            `;
        }
    });
});
