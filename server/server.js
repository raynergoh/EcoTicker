const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { OpenAI } = require('openai');
const NodeCache = require('node-cache');

// Load environment variables
dotenv.config();

// Check if required environment variables are set
if (!process.env.OPENAI_API_KEY) {
    console.error('ERROR: OPENAI_API_KEY is not set in .env file');
    process.exit(1);
}

const app = express();
const cache = new NodeCache({ stdTTL: process.env.CACHE_TTL || 3600 });

// Initialize OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Middleware
app.use(express.json());
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Debug middleware to log requests
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    if (req.method === 'POST') {
        console.log('Request body:', JSON.stringify(req.body, null, 2));
    }
    next();
});

// Sustainability scoring system
const SCORING_FRAMEWORK = {
    materialsSourcing: { weight: 0.40, name: "Materials Sourcing" },
    manufacturingImpact: { weight: 0.20, name: "Manufacturing Impact" },
    productDurability: { weight: 0.15, name: "Product Durability & Use" },
    endOfLife: { weight: 0.15, name: "End-of-Life & Circularity" },
    packaging: { weight: 0.10, name: "Packaging Sustainability" }
};

async function analyzeProduct(productData) {
    if (!productData || !productData.url) {
        throw new Error('Invalid product data: URL is required');
    }

    console.log('Analyzing product:', productData.url);

    const prompt = `Analyze the following product's sustainability based on these categories:
    
    1. Materials Sourcing (40%): ${productData.materials || 'No information provided'}
    2. Manufacturing Impact (20%): ${productData.manufacturing || 'No information provided'}
    3. Product Durability & Use (15%): ${productData.durability || 'No information provided'}
    4. End-of-Life & Circularity (15%): ${productData.endOfLife || 'No information provided'}
    5. Packaging Sustainability (10%): ${productData.packaging || 'No information provided'}

    Additional Product Information:
    - Name: ${productData.name}
    - Description: ${productData.description}
    - Product Page URL: ${productData.url}

    For each category:
    1. Provide a score from 0-100
    2. Brief justification for the score
    3. Consider the brand's general sustainability practices where product-specific information is missing
    4. Use -1 if absolutely no information is available

    Format the response as a JSON object with this structure:
    {
        "materialsSourcing": { "score": number, "justification": "string" },
        "manufacturingImpact": { "score": number, "justification": "string" },
        "productDurability": { "score": number, "justification": "string" },
        "endOfLife": { "score": number, "justification": "string" },
        "packaging": { "score": number, "justification": "string" },
        "overallScore": number,
        "summary": "string"
    }`;

    try {
        console.log('Calling OpenAI API...');
        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                { 
                    role: "system", 
                    content: "You are a sustainability expert analyzing product sustainability based on provided metrics. Be thorough and objective in your analysis."
                },
                { 
                    role: "user", 
                    content: prompt 
                }
            ],
            temperature: 0.3,
            max_tokens: 1000
        });

        console.log('OpenAI API response received');
        return JSON.parse(completion.choices[0].message.content);
    } catch (error) {
        console.error('OpenAI API error:', error);
        throw new Error(`OpenAI API error: ${error.message}`);
    }
}

// Routes
app.post('/api/analyze', async (req, res) => {
    try {
        const { productData } = req.body;
        
        if (!productData) {
            throw new Error('No product data provided');
        }

        // Check cache first
        const cacheKey = `product_${productData.url}`;
        const cachedResult = cache.get(cacheKey);
        
        if (cachedResult) {
            console.log('Returning cached result for:', productData.url);
            return res.json(cachedResult);
        }

        console.log('Starting analysis for:', productData.url);
        const analysis = await analyzeProduct(productData);
        
        // Calculate overall score
        let totalScore = 0;
        let validCategories = 0;
        
        for (const [category, details] of Object.entries(SCORING_FRAMEWORK)) {
            if (analysis[category].score !== -1) {
                totalScore += analysis[category].score * details.weight;
                validCategories++;
            }
        }

        analysis.overallScore = validCategories > 0 
            ? Math.round(totalScore * (5 / validCategories)) / 5 
            : -1;

        // Cache the result
        cache.set(cacheKey, analysis);
        
        console.log('Analysis complete. Sending response.');
        res.json(analysis);
    } catch (error) {
        console.error('Analysis error:', error);
        res.status(500).json({ 
            error: 'Failed to analyze product',
            details: error.message 
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'healthy' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`CORS allowed origins: ${process.env.ALLOWED_ORIGINS || '*'}`);
}); 