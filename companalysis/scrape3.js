const puppeteer = require('puppeteer');
const OpenAI = require("openai");// Assuming you have the OpenAI SDK installed and configured

// Your OpenAI API key
// Initialize OpenAI
const openai = new OpenAI({
    apiKey: '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'
});
async function extractTextContent(url) {
    // Launch headless Chrome browser
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Navigate to the specified URL
    await page.goto(url);

    // Extract text content
    const textContent = await page.evaluate(() => {
        // This function runs in the context of the browser
        // and can access the DOM
        return document.body.innerText;
    });

    // Close the browser
    await browser.close();

    return textContent;
}

async function generateCompetitorAnalysis(textContents) {


    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    "role": "system",
                    "content": `you are an Analysis expert, I will provide you Landing Page copies of different SaaS websites and you will a competitor analysis different data matrices including [Service Name, Industry, Main Value Proposition, Description, Key Features, Use Cases, Competitive Advantage, Priding, Positioning, Audience, CTA, Tone of Voice, Brand Positioning, Differentiation, Trust Factor, Social Proof]]`
                },
                {
                    "role": "user",
                    "content": `Landing Page copies:  ${textContents.join('\n\n')}`
                }
            ],
            temperature: 0.5,
            max_tokens: 3500,
            top_p: 1,
        });

        return response.choices[0].message.content;
    } catch (error) {
        console.error('Error generating analysis:', error);
        return null;
    }
}

// List of URLs to extract text content from
const urls = [
    'https://notion.so/',
    'https://airtable.com/',
    'https://obsidian.md/'
];

// Concurrently extract text content from all URLs
Promise.all(urls.map(async (url) => extractTextContent(url)))
    .then(textContents => {
        // Generate competitor analysis using combined text content
        return generateCompetitorAnalysis(textContents);
    })
    .then(analysis => {
        // Print the generated competitor analysis
        console.log('Competitor Analysis:');
        console.log(analysis);
    })
    .catch(error => {
        console.error('Error:', error);
    });
