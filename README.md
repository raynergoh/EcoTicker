EcoTicker Browser Extension 🌱
EcoTicker is a Chrome extension that empowers users to make more sustainable shopping choices by providing real-time sustainability scores for products and brands while browsing popular e-commerce websites. The extension is currently optimized for Nike but is architected for easy expansion to other major e-commerce platforms such as Amazon, IKEA, Walmart, Target, and Adidas.

Table of Contents
Features

How It Works

Sustainability Metric

Rewards Program

Installation

Project Structure

Development

Customization

Contributing

Troubleshooting & FAQ

License

Acknowledgments

Contact

Version History

Features
🎯 Core Functionality
Real-time product sustainability scoring: Instantly see a product’s sustainability grade while shopping.

EcoPoints reward system: Earn points for sustainable purchases and redeem them for eco-friendly rewards.

Multi-platform support: Built for Nike, with support for Amazon, IKEA, Walmart, Target, and Adidas planned.

📊 Sustainability Analysis
Product-level sustainability scoring: Uses a transparent, research-driven metric to assign scores.

Visual grade representation: Grades displayed as A, B, or C for easy interpretation.

Sustainable alternative suggestions: Recommends greener alternatives using AI and ESG data.

💎 User Interface
Modern popup UI: Features three main sections:

Home: View current product sustainability information.

Rewards: Track EcoPoints and available rewards.

About: Extension information and version details.

In-page banners: Non-intrusive banners display scores directly on product pages.

How It Works
Page Scan: When you visit a supported product page, EcoTicker scans for sustainability keywords and material percentages (e.g., "recycled," "organic").

Score Calculation: Applies a weighted metric based on industry standards and Nike’s sustainability disclosures to assign a grade.

Display: Shows a banner at the top of the page with the score and a brief justification.

Alternative Suggestions: Optionally uses OpenAI’s API to find and display more sustainable alternatives, even if product data is limited.

Popup Dashboard: Clicking the extension icon opens a popup with your EcoPoints, rewards, and additional details.

Sustainability Metric
EcoTicker’s metric is grounded in leading sustainability frameworks (Eco-Score, Higg Index, The Sustainability Consortium) and is tailored for product-level analysis. Each category is weighted for a total of 100%:

Category	Weight (%)	Example Criteria
Materials Sourcing	40	% recycled/organic/certified materials
Manufacturing Impact	20	Renewable energy, low-impact processes
Product Durability & Use	15	Designed for longevity, repairability, multi-use
End-of-Life & Circularity	15	Recyclable, take-back programs, closed-loop efforts
Packaging Sustainability	10	Recycled/minimal packaging, certifications
No info for a category: Score of -1 for that category.

Final grade:

A = 85–100

B = 70–84

C = 55–69

D = 40–54

F = <40

No Info = -1.

Rewards Program
EcoPoints: Earned for sustainable shopping choices.

Redeemable Rewards:

$10 Tentree Voucher (500 points)

Patagonia Tote Bag (1000 points)

Allbirds Discount (20%) (2000 points)

1-Year Climate Newsletter Subscription (3500 points).

Installation
Clone this repository:

bash
git clone https://github.com/yourusername/ecoticker.git
Load in Chrome:

Go to chrome://extensions/

Enable "Developer mode"

Click "Load unpacked" and select the ecoticker-extension directory.

Project Structure
text
ecoticker-extension/
├── manifest.json        # Extension configuration
├── popup.html           # Main extension popup interface
├── popup.js             # Popup functionality
├── popup.css            # Styling for popup
├── content.js           # Content script for web page interaction
├── content.css          # Styling for injected content
├── background.js        # Background service worker
├── esg-data.json        # ESG ratings data
└── icon.png             # Extension icon
content.js: Scans product pages, extracts info, injects banners.

background.js: Handles API calls (e.g., OpenAI), message routing.

popup.*: Popup UI for EcoPoints and rewards.

content.css/popup.css: Separate styles for banners and popup UI.

esg-data.json: Static ESG data for products/brands.

Development
Prerequisites
Chrome Browser

Basic understanding of JavaScript and Chrome Extension APIs

Local Development
Make changes to the source files.

Reload the extension in Chrome.

Test on supported e-commerce sites.

Key Components
Popup Interface: Main user interaction point.

Content Scripts: Analyze and inject sustainability data.

Background Service: Handles points system and storage.

Customization
Metric Tuning: Adjust category weights or scoring logic in content.js to reflect new research or support additional sites.

Add/Remove Features: Enable or disable OpenAI-powered alternative suggestions in background.js.

UI Styling: Modify content.css and popup.css for branding or accessibility.

Contributing
Fork the repository.

Create your feature branch (git checkout -b feature/AmazingFeature).

Commit your changes (git commit -m 'Add some AmazingFeature').

Push to the branch (git push origin feature/AmazingFeature).

Open a Pull Request.

Troubleshooting & FAQ
No Score Displayed: The extension relies on product page info. If none is found, it may show “No Info” or use AI to supplement.

API Key Issues: If using OpenAI, ensure your API key is set securely in your backend.

Styling Problems: Make sure content.css and popup.css are not conflicting.

License
This project is licensed under the MIT License - see the LICENSE file for details.

Acknowledgments
ESG data providers

Sustainable brand partners

Open-source community

Version History
1.2: Current release

Improved UI/UX

Added rewards system

Enhanced sustainability scoring

Contact
Name - Rayner Goh
Project Link: https://github.com/raynergoh/EcoTicker

Made with 💚 by Elders
Project Link: [https://github.com/yourusername/ecoticker](https://github.com/yourusername/ecoticker)

---

Made with 💚 by Elders
