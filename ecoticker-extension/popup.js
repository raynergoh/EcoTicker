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
            // If score is less than 5, show 'Lack of Information' in a styled box
            const scoreValueElem = scoreDisplay.querySelector('.score-value');
            if (score < 5) {
                scoreValueElem.innerHTML = `<span style="display:inline-block;padding:4px 12px;font-size:22px;border:1.5px solid #bbb;border-radius:8px;background:#fafbfc;color:#888;">Lack of Information</span>`;
            } else {
                scoreValueElem.textContent = `${score}/100`;
            }
            scoreDisplay.querySelector('.score-summary').textContent = analysis.summary;

            // Add or update information bar
            let infoBar = document.getElementById('info-bar');
            if (!infoBar) {
                infoBar = document.createElement('div');
                infoBar.id = 'info-bar';
                infoBar.style.margin = '8px 0';
                infoBar.style.height = '8px';
                infoBar.style.borderRadius = '4px';
                infoBar.style.background = '#eee';
                infoBar.style.position = 'relative';
                scoreDisplay.appendChild(infoBar);
                // Add labels
                let leftLabel = document.createElement('span');
                leftLabel.textContent = 'No information';
                leftLabel.style.position = 'absolute';
                leftLabel.style.left = '0';
                leftLabel.style.top = '12px';
                leftLabel.style.fontSize = '10px';
                leftLabel.style.color = '#888';
                infoBar.appendChild(leftLabel);
                let rightLabel = document.createElement('span');
                rightLabel.textContent = 'Full information';
                rightLabel.style.position = 'absolute';
                rightLabel.style.right = '0';
                rightLabel.style.top = '12px';
                rightLabel.style.fontSize = '10px';
                rightLabel.style.color = '#888';
                infoBar.appendChild(rightLabel);
            } else {
                infoBar.innerHTML = '';
            }
            // Calculate info completeness (if available, else use score as proxy)
            let infoPercent = 0;
            if (score === -1) {
                infoPercent = 0;
            } else if (typeof analysis.infoCompleteness === 'number') {
                infoPercent = Math.max(0, Math.min(100, analysis.infoCompleteness));
            } else {
                infoPercent = Math.max(0, Math.min(100, score));
            }
            let fill = document.createElement('div');
            fill.style.height = '100%';
            fill.style.width = infoPercent + '%';
            fill.style.background = '#28B463';
            fill.style.borderRadius = '4px';
            infoBar.appendChild(fill);
            // Add labels again (after fill)
            let leftLabel = document.createElement('span');
            leftLabel.textContent = 'No information';
            leftLabel.style.position = 'absolute';
            leftLabel.style.left = '0';
            leftLabel.style.top = '12px';
            leftLabel.style.fontSize = '10px';
            leftLabel.style.color = '#888';
            infoBar.appendChild(leftLabel);
            let rightLabel = document.createElement('span');
            rightLabel.textContent = 'Full information';
            rightLabel.style.position = 'absolute';
            rightLabel.style.right = '0';
            rightLabel.style.top = '12px';
            rightLabel.style.fontSize = '10px';
            rightLabel.style.color = '#888';
            infoBar.appendChild(rightLabel);

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
