const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { OpenAI } = require('openai');
const NodeCache = require('node-cache');
const axios = require('axios');
const cheerio = require('cheerio');

dotenv.config();

if (!process.env.OPENAI_API_KEY) {
    console.error('ERROR: OPENAI_API_KEY is not set in .env file');
    process.exit(1);
}

const app = express();
const cache = new NodeCache({ stdTTL: process.env.CACHE_TTL || 3600 });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(express.json());
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || origin.startsWith('chrome-extension://') || origin.startsWith('http://localhost')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// --- Web Scraper Function ---
async function scrapeProductText(url) {
    try {
        console.log(`Scraping URL: ${url}`);
        const { data } = await axios.get(url, {
            // Use a realistic user-agent to avoid simple blocks[3]
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
                'Accept-Language': 'en-US,en;q=0.9',
                'Accept-Encoding': 'gzip, deflate, br',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                'Referer': 'https://www.google.com/'
            }
        });
        const $ = cheerio.load(data);
        $('script, style, head, nav, footer, header, form').remove();
        const mainText = $('body').text().replace(/\s\s+/g, ' ').trim();
        
        if (mainText.length < 100) {
            console.warn("Scraped text is very short. The page might be protected or content-light.");
        }
        
        return mainText.substring(0, 5000); // Limit text to avoid overwhelming the API
    } catch (error) {
        // This is a critical error to catch if the site blocks the scraper[9][7]
        console.error(`Scraping failed for ${url}. Status: ${error.response?.status}`);
        throw new Error(`Could not access the product page. The website may be blocking automated requests.`);
    }
}

async function analyzeProduct(productData) {
    // --- STEP 1: Scrape text from the product URL ---
    const productText = await scrapeProductText(productData.url);

    // --- STEP 2: Use scraped text in the prompt ---
    const prompt = `Analyze the sustainability of a product using the following text from its webpage. Product Name: "${productData.name}".
    
    Webpage Text (first 5000 characters): "${productText}"

    Evaluate it based on these criteria: Materials Sourcing, Manufacturing Impact, Product Durability, End-of-Life, and Packaging. For each, provide a score (0-100) and justification. If info is missing, use a score of -1.
    
    Provide a final "overallScore" and a concise "summary". Respond with only a valid JSON object.`;

    try {
        console.log('Calling OpenAI API...');
        const completion = await openai.chat.completions.create({
            model: "gpt-4-turbo",
            response_format: { type: "json_object" },
            messages: [
                { role: "system", content: "You are a sustainability expert. Analyze the provided text and respond with a valid JSON object as requested.[16]" },
                { role: "user", content: prompt }
            ],
            temperature: 0.2,
            max_tokens: 1500
        });
        return JSON.parse(completion.choices[0].message.content);
    } catch (error) {
        // This error now specifically points to an OpenAI failure[10][12]
        console.error('--- OpenAI API Error ---', error);
        throw new Error(`The AI analysis failed. This could be due to an API key issue or a problem with the AI service.`);
    }
}

// --- Main API Route with Granular Error Handling ---
app.post('/api/analyze', async (req, res) => {
    const { productData } = req.body;
    if (!productData) {
        return res.status(400).json({ error: 'No product data provided' });
    }

    try {
        const cacheKey = `product_${productData.url}`;
        const cachedResult = cache.get(cacheKey);
        if (cachedResult) {
            console.log('Returning cached result.');
            return res.json(cachedResult);
        }

        const analysis = await analyzeProduct(productData);
        analysis.overallScore = analysis.overallScore || 0; // Ensure score exists
        cache.set(cacheKey, analysis);
        res.json(analysis);

    } catch (error) {
        // Send a specific status code and message based on the error type
        console.error('--- Final Error in Route ---', error.message);
        if (error.message.includes("Could not access")) {
            // Error from the scraper
            res.status(422).json({ error: 'Scraping Failed', details: error.message });
        } else if (error.message.includes("AI analysis failed")) {
            // Error from OpenAI
            res.status(502).json({ error: 'AI Service Error', details: error.message });
        } else {
            // Any other unexpected error
            res.status(500).json({ error: 'Internal Server Error', details: error.message });
        }
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} with improved error handling.`);
});
