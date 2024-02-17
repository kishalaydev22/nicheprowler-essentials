const OpenAI = require("openai");
const apiKey = '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'
if (!apiKey) {
    throw Error("Openai API key not specified");
}

const openai = new OpenAI({ apiKey: apiKey });


const getEmbedding = async (text) => {
    const response = await openai.embeddings.create({
        model: "text-embedding-ada-002",
        input: text,
    });
    const embedding = response.data[0].embedding;
    if (!embedding) {
        throw Error("Error generating embedding");
    }
    return embedding;
}

module.exports = { getEmbedding }