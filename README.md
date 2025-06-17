EcoTicker 🌱 — Sustainable Shopping Companion
EcoTicker is a Chrome extension that empowers you to shop more sustainably by providing real-time sustainability scores and actionable insights for products and brands as you browse popular e-commerce sites. While currently optimized for Nike, EcoTicker is built to support expansion to other major platforms like Amazon, IKEA, Walmart, Target, and Adidas.

🚀 Features
Instant Sustainability Scores: See a clear A–F grade for each product as you shop, based on a transparent, research-driven metric.

EcoPoints Rewards: Earn points for sustainable purchases and redeem them for eco-friendly rewards.

Sustainable Alternatives: Get suggestions for greener products using AI and ESG data.

Modern UI: Enjoy a clean, intuitive popup and stylish in-page banners.

Multi-Platform Ready: Designed for Nike, with easy extensibility to more sites.

🛠️ How EcoTicker Works
Scan: When you visit a product page, EcoTicker scans for sustainability keywords and material percentages (e.g., “recycled,” “organic”).

Score: It applies a weighted metric, based on industry standards, to assign a grade.

Display: A banner appears at the top of the page with the score and a quick summary.

Suggest: Optionally, EcoTicker uses OpenAI’s API to recommend more sustainable alternatives—even if the product page lacks details.

Reward: Earn EcoPoints for sustainable shopping, which you can track and redeem in the popup.

📊 Sustainability Metric
EcoTicker’s scoring system is inspired by leading frameworks like Eco-Score, Higg Index, and The Sustainability Consortium. Each category is weighted for a total of 100%:

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

🏆 Rewards Program
Earn EcoPoints for sustainable actions and redeem them for rewards:

Reward	Points Needed
$10 Tentree Voucher	500
Patagonia Tote Bag	1000
Allbirds Discount (20%)	2000
1-Year Climate Newsletter Subscription	3500
🎨 User Experience
Popup: Three main tabs—Home (current product info), Rewards (track points, redeem), About (extension details).

Banner: Non-intrusive, visually appealing sustainability score at the top of product pages.

Responsive Design: Looks great on all supported platforms.

⚡ Installation
Clone the Repository

bash
git clone https://github.com/yourusername/ecoticker.git
Load in Chrome

Go to chrome://extensions/

Enable "Developer mode"

Click "Load unpacked" and select the ecoticker-extension directory

📁 Project Structure
text
ecoticker-extension/
├── manifest.json        # Extension config
├── popup.html           # Popup UI
├── popup.js             # Popup logic
├── popup.css            # Popup styles
├── content.js           # Injects banners, extracts data
├── content.css          # Banner styles
├── background.js        # Handles API calls, messaging
├── esg-data.json        # ESG ratings data
└── icon.png             # Extension icon
🛠️ Development
Prerequisites: Chrome Browser, basic JS & Chrome Extension API knowledge.

Workflow: Edit source files, reload extension, test on supported sites.

Key Components: Popup UI, content scripts (scoring/analysis), background service (storage, API).

✨ Customization
Metric Tuning: Adjust category weights/scoring logic in content.js.

Platform Expansion: Add more sites by updating selectors and logic.

UI Styling: Edit content.css and popup.css for branding/accessibility.

🤝 Contributing
Fork the repository.

Create a feature branch (git checkout -b feature/AmazingFeature).

Commit your changes (git commit -m 'Add some AmazingFeature').

Push to the branch (git push origin feature/AmazingFeature).

Open a Pull Request.

🧩 Troubleshooting & FAQ
No Score Displayed: Product page info may be missing; AI can supplement if enabled.

API Key Issues: For OpenAI, ensure your key is set securely in your backend.

Styling Problems: Confirm content.css and popup.css are not conflicting.

📜 License
MIT License

🙏 Acknowledgments
ESG data providers

Sustainable brand partners

Open-source community

🕒 Version History
1.2: Improved UI/UX, rewards system, enhanced sustainability scoring.

📬 Contact
Your Name — @yourusername
Project Link: https://github.com/yourusername/ecoticker

Made with 💚 by the EcoTicker team
