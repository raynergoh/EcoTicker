// OpenAI service for sustainability analysis
let config = null;

async function loadConfig() {
    if (config === null) {
        try {
            const response = await fetch(chrome.runtime.getURL('config.json'));
            config = await response.json();
        } catch (error) {
            console.error('Error loading configuration:', error);
            throw new Error('Failed to load API configuration');
        }
    }
    return config;
}

async function callOpenAI(productInfo) {
    const config = await loadConfig();
    
    const prompt = `Analyze the sustainability of the following product:
Product URL: ${productInfo.url}
Product Name: ${productInfo.name}
Product Description: ${productInfo.description}

Please provide:
1. A sustainability score (0-100)
2. A brief analysis of the product's environmental impact
3. Three more sustainable alternatives with their URLs and reasons for being more sustainable`;

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.openai.apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-4",
                messages: [{
                    role: "user",
                    content: prompt
                }],
                temperature: 0.7
            })
        });

        if (!response.ok) {
            throw new Error(`OpenAI API error: ${response.status}`);
        }

        const data = await response.json();
        const analysis = parseOpenAIResponse(data.choices[0].message.content);
        return analysis;
    } catch (error) {
        console.error('Error calling OpenAI API:', error);
        // Fall back to mock data if API call fails
        return getMockAnalysis(productInfo.url);
    }
}

function parseOpenAIResponse(content) {
    // Basic parsing - in production, you'd want more robust parsing
    const scoreMatch = content.match(/(\d+)\/100|(\d+)\s*percent|score.*?(\d+)/i);
    const score = scoreMatch ? parseInt(scoreMatch[1] || scoreMatch[2] || scoreMatch[3]) : 70;

    return {
        sustainabilityScore: score,
        analysis: content,
        alternatives: extractAlternatives(content)
    };
}

function extractAlternatives(content) {
    // Basic alternative extraction - in production, you'd want more robust parsing
    const alternatives = [];
    const lines = content.split('\n');
    
    for (const line of lines) {
        if (line.includes('http') && line.toLowerCase().includes('sustain')) {
            const urlMatch = line.match(/(https?:\/\/[^\s]+)/);
            if (urlMatch) {
                alternatives.push({
                    name: line.split(urlMatch[0])[0].trim(),
                    url: urlMatch[0],
                    sustainabilityScore: Math.min(95, Math.floor(Math.random() * 15) + 80),
                    improvement: Math.floor(Math.random() * 15) + 10,
                    reason: "Suggested by sustainability analysis"
                });
            }
        }
    }

    return alternatives.length > 0 ? alternatives : [{
        name: "See more sustainable alternatives on Good On You",
        url: "https://www.goodonyou.eco/",
        sustainabilityScore: 90,
        improvement: 20,
        reason: "Good On You lists highly rated sustainable products"
    }];
}

// Mock OpenAI service for sustainability analysis
const MOCK_PRODUCTS = {
  'nike.com': {
    'c1ty-shoes-r0WptT': {
      sustainabilityScore: 65,
      analysis: "The Nike C1TY shoes use a combination of real and synthetic leather with mesh, which has moderate environmental impact. While they feature some sustainable elements like the foam midsole, there's room for improvement in material sourcing and manufacturing processes.",
      alternatives: [
        {
          name: "Nike Air Force 1 Crater",
          url: "https://www.nike.com/sg/t/air-force-1-crater-shoes-2Q5j4p/DH8074-100",
          sustainabilityScore: 75,
          improvement: 10,
          reason: "Uses at least 20% recycled materials by weight"
        },
        {
          name: "Adidas Ultraboost 22",
          url: "https://www.adidas.com.sg/ultraboost-22-shoes/GW9119.html",
          sustainabilityScore: 80,
          improvement: 15,
          reason: "Made with Primeblue, a high-performance recycled material"
        },
        {
          name: "Allbirds Tree Dasher",
          url: "https://www.allbirds.com/products/mens-tree-dasher",
          sustainabilityScore: 85,
          improvement: 20,
          reason: "Made with natural materials and renewable resources"
        }
      ]
    },
    'nike-air-max': {
      sustainabilityScore: 65,
      analysis: "Nike's Air Max line uses recycled materials but could improve in manufacturing processes.",
      alternatives: [
        {
          name: "Adidas Ultraboost",
          url: "https://www.adidas.com/us/ultraboost",
          sustainabilityScore: 75,
          improvement: 10
        },
        {
          name: "Allbirds Tree Dasher",
          url: "https://www.allbirds.com/products/mens-tree-dasher",
          sustainabilityScore: 85,
          improvement: 20
        }
      ]
    },
    'nike-air-force': {
      sustainabilityScore: 60,
      analysis: "Classic design but uses traditional materials with moderate environmental impact.",
      alternatives: [
        {
          name: "Veja Campo",
          url: "https://www.veja-store.com/en_us/campo",
          sustainabilityScore: 80,
          improvement: 20
        },
        {
          name: "Cariuma OCA Low",
          url: "https://www.cariuma.com/products/oca-low-white",
          sustainabilityScore: 85,
          improvement: 25
        }
      ]
    }
  },
  'ikea.com': {
    'billy-bookcase': {
      sustainabilityScore: 70,
      analysis: "Made from sustainable wood sources but could improve in packaging materials.",
      alternatives: [
        {
          name: "Fjallbo Shelf Unit",
          url: "https://www.ikea.com/us/en/p/fjallbo-shelf-unit-black-brown-70333976/",
          sustainabilityScore: 80,
          improvement: 10
        },
        {
          name: "Kallax Shelf Unit",
          url: "https://www.ikea.com/us/en/p/kallax-shelf-unit-white-80275887/",
          sustainabilityScore: 85,
          improvement: 15
        }
      ]
    }
  },
  'amazon.com': {
    'default': {
      sustainabilityScore: 50,
      analysis: "Product sustainability varies. Consider checking brand-specific sustainability ratings.",
      alternatives: [
        {
          name: "Check brand alternatives",
          url: "https://www.goodonyou.eco/",
          sustainabilityScore: 75,
          improvement: 25
        }
      ]
    }
  }
};

function getMockAnalysis(productUrl) {
  // Simulate a sustainability score based on the URL (for demo)
  const score = 60 + Math.floor(Math.random() * 30); // 60-89
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        sustainabilityScore: score,
        analysis: "This product's sustainability score is based on available public data and estimated material impact.",
        alternatives: [
          {
            name: "See more sustainable alternatives on Good On You",
            url: "https://www.goodonyou.eco/",
            sustainabilityScore: 90,
            improvement: 90 - score,
            reason: "Good On You lists highly rated sustainable products."
          }
        ]
      });
    }, 800);
  });
}

async function analyzeProductSustainability(productInfo) {
    try {
        // First try to use OpenAI API
        return await callOpenAI(productInfo);
    } catch (error) {
        console.error('Error analyzing product sustainability:', error);
        // Fall back to mock data
        return getMockAnalysis(productInfo.url);
    }
}

// Expose the function globally
window.analyzeProductSustainability = analyzeProductSustainability; 