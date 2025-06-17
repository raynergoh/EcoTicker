// Nike Product Analyzer Service
class NikeProductAnalyzer {
    constructor() {
        this.API_ENDPOINT = 'http://localhost:3000/api/analyze';
    }

    async extractProductData() {
        try {
            // Extract product name
            const nameElement = document.querySelector('h1');
            const name = nameElement ? nameElement.textContent.trim() : '';

            // Extract product description
            const descriptionElement = document.querySelector('[data-test="product-description"]');
            const description = descriptionElement ? descriptionElement.textContent.trim() : '';

            // Extract materials information
            const materialsSection = Array.from(document.querySelectorAll('div')).find(
                div => div.textContent.includes('Materials') || div.textContent.includes('Fabric & Care')
            );
            const materials = materialsSection ? materialsSection.textContent.trim() : '';

            // Extract sustainability features
            const sustainabilitySection = Array.from(document.querySelectorAll('div')).find(
                div => div.textContent.includes('Sustainable Materials') || 
                       div.textContent.includes('Environmental Impact')
            );
            const sustainabilityInfo = sustainabilitySection ? sustainabilitySection.textContent.trim() : '';

            // Get product URL
            const url = window.location.href;

            return {
                name,
                description,
                materials,
                manufacturing: sustainabilityInfo, // Nike often includes manufacturing info in sustainability section
                durability: description, // Look for durability info in general description
                endOfLife: '', // Nike rarely provides end-of-life information on product pages
                packaging: '', // Packaging info usually not available on product pages
                url
            };
        } catch (error) {
            console.error('Error extracting product data:', error);
            throw new Error('Failed to extract product data');
        }
    }

    async analyzeSustainability() {
        try {
            const productData = await this.extractProductData();
            
            const response = await fetch(this.API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ productData })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const analysis = await response.json();
            return this.formatAnalysis(analysis);
        } catch (error) {
            console.error('Error analyzing sustainability:', error);
            throw error;
        }
    }

    formatAnalysis(analysis) {
        // Convert score to letter grade
        const getLetterGrade = (score) => {
            if (score === -1) return 'N/A';
            if (score >= 80) return 'A';
            if (score >= 60) return 'B';
            if (score >= 40) return 'C';
            if (score >= 20) return 'D';
            return 'F';
        };

        const overallGrade = getLetterGrade(analysis.overallScore);

        return {
            grade: overallGrade,
            score: analysis.overallScore,
            details: {
                materialsSourcing: {
                    score: analysis.materialsSourcing.score,
                    grade: getLetterGrade(analysis.materialsSourcing.score),
                    justification: analysis.materialsSourcing.justification
                },
                manufacturingImpact: {
                    score: analysis.manufacturingImpact.score,
                    grade: getLetterGrade(analysis.manufacturingImpact.score),
                    justification: analysis.manufacturingImpact.justification
                },
                productDurability: {
                    score: analysis.productDurability.score,
                    grade: getLetterGrade(analysis.productDurability.score),
                    justification: analysis.productDurability.justification
                },
                endOfLife: {
                    score: analysis.endOfLife.score,
                    grade: getLetterGrade(analysis.endOfLife.score),
                    justification: analysis.endOfLife.justification
                },
                packaging: {
                    score: analysis.packaging.score,
                    grade: getLetterGrade(analysis.packaging.score),
                    justification: analysis.packaging.justification
                }
            },
            summary: analysis.summary
        };
    }
}

window.nikeAnalyzer = new NikeProductAnalyzer(); 