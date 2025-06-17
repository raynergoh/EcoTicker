# EcoTicker Browser Extension 🌱

EcoTicker is a Chrome extension that helps users make more sustainable shopping choices by providing real-time sustainability scores for products and brands while browsing popular e-commerce websites.

## Features

### 🎯 Core Functionality
- Real-time product sustainability scoring
- EcoPoints reward system for sustainable purchases
- Support for major e-commerce platforms:
  - Amazon
  - Nike
  - IKEA
  - Walmart
  - Target
  - Adidas

### 📊 Sustainability Analysis
- Product-level sustainability scoring
- Visual grade representation (A, B, C)
- Sustainable alternative product suggestions

### 💎 User Interface
- Clean, modern popup interface with three main sections:
  1. **Home**: View current product sustainability information
  2. **Rewards**: Track EcoPoints and available rewards
  3. **About**: Extension information and version details

### 🏆 Rewards Program
- Earn EcoPoints for sustainable shopping choices
- Redeem points for eco-friendly rewards:
  - $10 Tentree Voucher (500 points)
  - Patagonia Tote Bag (1000 points)
  - Allbirds Discount (20%) (2000 points)
  - 1-Year Climate Newsletter Subscription (3500 points)

## Installation

1. Clone this repository:
```bash
git clone https://github.com/yourusername/ecoticker.git
```

2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the `ecoticker-extension` directory

## Project Structure

```
ecoticker-extension/
├── manifest.json        # Extension configuration
├── popup.html          # Main extension popup interface
├── popup.js           # Popup functionality
├── popup.css         # Styling for popup
├── content.js       # Content script for web page interaction
├── content.css    # Styling for injected content
├── background.js  # Background service worker
├── esg-data.json # ESG ratings data
└── icon.png     # Extension icon
```

## Development

### Prerequisites
- Chrome Browser
- Basic understanding of JavaScript and Chrome Extension APIs

### Local Development
1. Make changes to the source files
2. Reload the extension in Chrome
3. Test on supported e-commerce sites

### Key Components
- **Popup Interface**: Main user interaction point
- **Content Scripts**: Analyze and inject sustainability data
- **Background Service**: Handles points system and storage

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- ESG data providers
- Sustainable brand partners
- Open-source community

## Version History

- 1.2: Current release
  - Improved UI/UX
  - Added rewards system
  - Enhanced sustainability scoring

## Contact

Your Name - [@yourusername](https://twitter.com/yourusername)
Project Link: [https://github.com/yourusername/ecoticker](https://github.com/yourusername/ecoticker)

---

Made with 💚 by Elders
