# EcoTicker 🌱 — Sustainable Shopping Companion


EcoTicker, a 2-day hackathon for LifeHack 2025, is a Chrome extension that empowers you to shop more sustainably by providing real-time sustainability scores and actionable insights for products and brands as you browse popular e-commerce sites. While currently optimized for Nike, EcoTicker is built for easy expansion to platforms (Currently Nike).

---
## Status

- Completed the front-end aspect and have a rough working model and metrics for the calculating of sustainability score with some backend implementation. 
- Yet to implement the backend for the points system as well as a recommend alternative function.

---

## 🚀 Features

- **Instant Sustainability Scores:** See a clear score for each product as you shop, based on a transparent, research-driven metric.
- **EcoPoints Rewards:** Earn points for sustainable purchases and redeem them for eco-friendly rewards.
- **Modern UI:** Enjoy a clean, intuitive popup and stylish in-page banners.

To implement:
- **Multi-Platform Ready:** Designed for Nike, with easy extensibility to more sites.
- **Sustainable Alternatives:** Get suggestions for greener products using AI and ESG data. (Have not implement, In progress)
---

## 🛠️ How EcoTicker Works

When you visit a product page and press the "Analyze Sustainability" button in the extension, the following process occurs:

- The backend uses **axios** to fetch the product page HTML.
- It uses **cheerio** to parse the HTML and extract the main text content (removing scripts, nav, etc.).
- The backend builds a prompt for OpenAI using the scraped text, product name, and your evaluation metric.
- It sends the prompt to OpenAI (using your API key from `.env`).
- The backend expects a JSON response with an overall score and summary.
- The result is returned to the popup.
- The extension displays a score and a quick summary to the user.
- *(Yet to implement)*: Recommend more sustainable alternatives.
- *(Yet to implement backend)*: Reward System, earning EcoPoints for sustainable shopping which is tracked and can be redeemed in the popup.

---

## 📊 Sustainability Metric

EcoTicker's scoring system is inspired by leading frameworks like Eco-Score, Higg Index, and The Sustainability Consortium. Each category is weighted for a total of 100%:

| Category                  | Weight (%) | Example Criteria                                  |
|---------------------------|------------|---------------------------------------------------|
| Materials Sourcing        | 40         | % recycled/organic/certified materials            |
| Manufacturing Impact      | 20         | Renewable energy, low-impact processes            |
| Product Durability & Use  | 15         | Designed for longevity, repairability, multi-use  |
| End-of-Life & Circularity | 15         | Recyclable, take-back programs, closed-loop efforts|
| Packaging Sustainability  | 10         | Recycled/minimal packaging, certifications        |

- **No info for a category:** Score of -1 for that category.
- **Final grade:**  
  - A = 85–100  
  - B = 70–84  
  - C = 55–69  
  - D = 40–54  
  - F = 5-40  
  - No Info = <5

---

## 🏆 Rewards Program

Earn EcoPoints for sustainable actions and redeem them for rewards:

| Reward                                   | Points Needed |
|-------------------------------------------|--------------|
| $10 Tentree Voucher                      | 500          |
| Patagonia Tote Bag                       | 1000         |
| Allbirds Discount (20%)                  | 2000         |
| 1-Year Climate Newsletter Subscription   | 3500         |

---

## 🎨 User Experience

- **Popup:** Three main tabs—Home (current product info), Rewards (track points, redeem), About (extension details).
- **Banner:** Non-intrusive, visually appealing sustainability score at the top of product pages.
- **Responsive Design:** Looks great on all supported platforms.

---

## ⚡ Installation

# EcoTicker Extension & Backend Setup Guide

## 1. Clone the Repository
```sh
git clone <your-repo-url>
cd EcoTicker
```

## 2. Install Backend Dependencies
```sh
cd server
npm install
```

## 3. Set Up OpenAI API Key
1. In the `server` directory, create a file named `.env`.
2. Add your OpenAI API key to the file:
   ```
   PORT=3000
   OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   CACHE_TTL=3600
   ```
   *(Replace with your actual OpenAI API key.)*

## 4. Start the Backend Server
```sh
node server.js
```
- The server should run on `http://localhost:3000` by default.

## 5. Install Chrome Extension
1. Open Chrome and go to `chrome://extensions/`.
2. Enable **Developer mode** (top right).
3. Click **Load unpacked**.
4. Select the `ecoticker-extension` folder inside your project directory.

## 6. Using the Extension
- Navigate to a supported product page (e.g., Nike).
- Click the EcoTicker extension icon.
- Click **Analyze Sustainability**.
- Wait for the score and summary to appear.

## 7. Troubleshooting
- **If you see "Lack of Information" or errors:**
  - Make sure your backend server is running.
  - Ensure your `.env` file exists and contains a valid OpenAI API key.
  - Check the terminal for backend errors.
  - Make sure you have run `npm install` in the `server` directory.
  - Ensure the product page is accessible and not region-locked.

## 8. For Collaborators
- Each user must create their own `.env` file with their own OpenAI API key.
- Each user must run `npm install` in the `server` directory after cloning or pulling updates.

## 9. (Optional) Updating Dependencies
If you ever update `package.json`, run:
```sh
npm install
```
again in the `server` directory.

**That's it! Your EcoTicker extension and backend should now be fully functional.**


---

## 🛠️ Development

- **Prerequisites:** Chrome Browser, basic JS & Chrome Extension API knowledge.
- **Workflow:** Edit source files, reload extension, test on supported sites.
- **Key Components:** Popup UI, content scripts (scoring/analysis), background service (storage, API).

---

## ✨ Customization

- **Metric Tuning:** Adjust category weights/scoring logic in `content.js`.
- **Platform Expansion:** Add more sites by updating selectors and logic.
- **UI Styling:** Edit `content.css` and `popup.css` for branding/accessibility.

---


## 🧩 Troubleshooting & FAQ

- **No Score Displayed:** Product page info may be missing; AI can supplement if enabled.
- **API Key Issues:** For OpenAI, ensure your key is set securely in your backend.
- **Styling Problems:** Confirm `content.css` and `popup.css` are not conflicting.

---




## 🕒 Version History

- **1.2:** Improved UI/UX, rewards system, enhanced sustainability scoring.

---

## 📬 Contact

Rayner Goh (raynergoh03@gmail.com)
Yeo Chen Xian (chenxian0603@gmail.com)
Josh Loh
Project Link: [https://github.com/raynergoh/ecoticker](https://github.com/raynergoh/ecoticker)

---

*Made with 💚 by the EcoTicker team*

