// Import necessary modules
const { Pinecone } = require('@pinecone-database/pinecone');
const OpenAI = require("openai");
const fs = require('fs');
const path = require('path');
const niches = require('./data2/data2.js');
const { getEmbedding } = require('./embeddings.js')
// Initialize Pinecone
const pinecone = new Pinecone({
    environment: 'gcp-starter',
    apiKey: '15b0b4ba-caee-4727-bc3c-b3045993301a'
});
const index = pinecone.index('ideas');

// Initialize OpenAI
const openai = new OpenAI({
    apiKey: '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'
});

// Article prompt template
const promptContent = `

<H1>Top Profitable microSaaS Ideas in the [Niche] Niche for $1k-$5k Monthly Revenue.</H1>\n\n
<H2>Introduction:<H2>\n
<P>[Brief description about the [Niche] market, with the potential to earn between $1,000 to $5,000 in monthly recurring revenue (MRR).]<P>\n\n
<H2>Understanding [Niche] Market Trends:<H2>\n
<P>[Brief description about the current trends and opportunities within the [Niche] market. Conducting market research to identify untapped niches and pain points that can be addressed through SaaS solutions.]<P>\n\n
<H2>Criteria for Selecting microSaaS Ideas:<H2>\n
<P>[Brief description on microSaaS ideas focused on factors such as market demand, competition analysis, scalability, and revenue potential. Each idea aims to solve a specific problem or fulfill a need within the [Niche] market.]<P>\n\n

<H2>Top microSaaS Ideas for [Niche] Niche:<H2>\n
<H3>1. [MicroSaaS Idea 1]: [/H3>\n
<P>[Brief description of the SaaS product/service and how it addresses a specific need within the [Niche]. Provide an example SaaS website [including link] or case study showcasing a successful implementation on that Idea.]<P>\n

<H3>2. [MicroSaaS Idea 2]: [/H3>\n
<P>[Repeat the above format for each subsequent idea, providing unique examples and descriptions.]<<P>\n
...\\n
<H2>Tips for Building and Launching Your microSaaS:<H2>\n
<P>[Brief description on Building a successful microSaaS business requires careful planning and execution. Here are some actionable tips for aspiring microSaaS entrepreneurs in [Niche], including strategies for idea validation, MVP development, and customer acquisition.For more resources and tools to validate your microSaaS idea, visit <a href="https://nicheprowler.com">nicheprowler.com</a>.]</P>\n\n

<H2>Conclusion:<H2>\n
<P>[Brief description on conclusion, the top 10 microSaaS ideas presented in this article offer promising opportunities for entrepreneurs looking to enter the [Niche] market. By addressing specific pain points and delivering value to customers, these microSaaS businesses have the potential to generate significant recurring revenue.]<P>\n\n

`;

// Function to get Pinecone query
const getPineconeQuery = async (query, topK) => {
    if (query.trim().length === 0) {
        return [{}];
    }
    const embedding = await getEmbedding(query);
    const queryResponse = await index.namespace('ideas').query({
        topK,
        vector: embedding,
        includeMetadata: true
    });
    return queryResponse.matches.map((match) => match.metadata);
}

// Function to generate article for a niche and its ideas
const generateArticleForNiche = async (niche) => {
    const ideas = await getPineconeQuery(niche, 6);
    const ideaNamesSet = new Set(ideas.map(idea => idea.idea)); // Use a Set to store unique idea names
    const ideaNames = [...ideaNamesSet];

    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            {
                "role": "system",
                "content": `You will Be provided with a Micro SaaS niche and Ideas, and you have to generate an SEO optimized article within 1500 words in this format : ${promptContent}`
            },
            {
                "role": "user",
                "content": `Niche: ${niche}, Ideas: ${JSON.stringify(ideaNames)}`
            }
        ],
        temperature: 0.5,
        max_tokens: 3500,
        top_p: 1,
    });

    const articleContent = response.choices[0].message.content;
    const fileName = `${niche.replace(/\s+/g, '_').toLowerCase()}_article.txt`; // Generate file name based on niche
    const resultsFolder = path.join(__dirname, 'results2'); // Path to results folder
    const filePath = path.join(resultsFolder, fileName); // Create full file path

    // Create results folder if it doesn't exist
    if (!fs.existsSync(resultsFolder)) {
        fs.mkdirSync(resultsFolder);
    }

    // Write the article content to a text file
    fs.writeFileSync(filePath, articleContent);

    console.log(`Article for Niche '${niche}' saved to: ${filePath}`);
}

// Generate articles for each niche
const generateArticlesForNicheIdeas = async () => {
    for (const niche of niches) {
        await generateArticleForNiche(niche);
        await new Promise(resolve => setTimeout(resolve, 100000));
    }
}

// Call the function to generate articles
generateArticlesForNicheIdeas();
