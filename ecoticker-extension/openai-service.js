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

async function analyzeProductSustainability(productUrl) {
  try {
    const analysis = await getMockAnalysis(productUrl);
    return analysis;
  } catch (error) {
    console.error('Error analyzing product sustainability:', error);
    throw error;
  }
}

// Expose the function globally
window.analyzeProductSustainability = analyzeProductSustainability; 