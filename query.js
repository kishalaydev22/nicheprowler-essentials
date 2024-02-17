const { Pinecone } = require('@pinecone-database/pinecone');
const { getEmbedding } = require('./embeddings.js')
const pinecone = new Pinecone({
    environment: 'gcp-starter',
    apiKey: '15b0b4ba-caee-4727-bc3c-b3045993301a'
});
const index = pinecone.index('ideas');

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
    const data = queryResponse.matches.map((match) => {
        console.log(match.metadata)
    })

}

getPineconeQuery("Email marketing", 6)















