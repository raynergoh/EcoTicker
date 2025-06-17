// Sustainability Panel Component
if (typeof analyzeProductSustainability === 'undefined') {
    var analyzeProductSustainability = window.analyzeProductSustainability;
}

class SustainabilityPanel {
    constructor() {
        this.panel = null;
        this.isVisible = false;
    }

    createPanel() {
        this.panel = document.createElement('div');
        this.panel.className = 'ecoticker-sustainability-panel';
        this.panel.innerHTML = `
            <div class="panel-header">
                <h3>Sustainability Analysis</h3>
                <button class="close-button">×</button>
            </div>
            <div class="panel-content">
                <div class="loading">Analyzing product sustainability...</div>
                <div class="analysis-results" style="display: none;">
                    <div class="score-section">
                        <h4>Sustainability Score</h4>
                        <div class="score-display"></div>
                    </div>
                    <div class="analysis-section">
                        <h4>Analysis</h4>
                        <p class="analysis-text"></p>
                    </div>
                    <div class="alternatives-section">
                        <h4>Better Alternatives</h4>
                        <div class="alternatives-list"></div>
                    </div>
                </div>
            </div>
        `;

        // Add event listeners
        this.panel.querySelector('.close-button').addEventListener('click', () => this.hide());
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .ecoticker-sustainability-panel {
                position: fixed;
                top: 20px;
                right: 20px;
                width: 350px;
                background: white;
                border-radius: 12px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                z-index: 10000;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            }
            .panel-header {
                padding: 16px;
                border-bottom: 1px solid #eee;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .panel-header h3 {
                margin: 0;
                font-size: 18px;
                color: #333;
            }
            .close-button {
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: #666;
            }
            .panel-content {
                padding: 16px;
            }
            .loading {
                text-align: center;
                color: #666;
                padding: 20px;
            }
            .score-section {
                text-align: center;
                margin-bottom: 20px;
            }
            .score-display {
                font-size: 48px;
                font-weight: bold;
                color: #28B463;
            }
            .analysis-section, .alternatives-section {
                margin-bottom: 20px;
            }
            .analysis-text {
                color: #666;
                line-height: 1.5;
                margin: 0;
            }
            .alternatives-list {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            .alternative-item {
                padding: 12px;
                border: 1px solid #eee;
                border-radius: 8px;
                background: #f9f9f9;
            }
            .alternative-item h5 {
                margin: 0 0 8px 0;
                color: #333;
                font-size: 16px;
            }
            .alternative-item p {
                margin: 4px 0;
                color: #666;
                font-size: 14px;
            }
            .alternative-item a {
                color: #28B463;
                text-decoration: none;
                font-weight: 500;
                display: inline-block;
                margin-top: 8px;
            }
            .improvement {
                color: #28B463;
                font-weight: bold;
            }
            .reason {
                font-style: italic;
                color: #666;
                font-size: 13px;
                margin-top: 4px;
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(this.panel);
    }

    async analyzeProduct(productUrl) {
        if (!this.panel) {
            this.createPanel();
        }

        this.show();
        const loadingEl = this.panel.querySelector('.loading');
        const resultsEl = this.panel.querySelector('.analysis-results');
        
        try {
            const analysis = await analyzeProductSustainability(productUrl);
            
            // Update UI with results
            this.panel.querySelector('.score-display').textContent = analysis.sustainabilityScore;
            this.panel.querySelector('.analysis-text').textContent = analysis.analysis;
            
            const alternativesList = this.panel.querySelector('.alternatives-list');
            alternativesList.innerHTML = analysis.alternatives.map(alt => `
                <div class="alternative-item">
                    <h5>${alt.name}</h5>
                    <p>Score: ${alt.sustainabilityScore}</p>
                    <p class="improvement">+${alt.improvement} points better</p>
                    ${alt.reason ? `<p class="reason">${alt.reason}</p>` : ''}
                    <a href="${alt.url}" target="_blank">View Product</a>
                </div>
            `).join('');

            loadingEl.style.display = 'none';
            resultsEl.style.display = 'block';
        } catch (error) {
            loadingEl.textContent = 'Error analyzing product. Please try again.';
        }
    }

    show() {
        if (this.panel) {
            this.panel.style.display = 'block';
            this.isVisible = true;
        }
    }

    hide() {
        if (this.panel) {
            this.panel.style.display = 'none';
            this.isVisible = false;
        }
    }
}

// Create and expose the panel globally
window.sustainabilityPanel = new SustainabilityPanel(); 