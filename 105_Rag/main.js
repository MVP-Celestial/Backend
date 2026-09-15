import { PDFParse } from "pdf-parse";
import fs from "fs";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { MistralAIEmbeddings, ChatMistralAI } from "@langchain/mistralai";
import { Pinecone } from "@pinecone-database/pinecone";
import dotenv from "dotenv";
dotenv.config();

const pc = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
});

const index = pc.Index("cohort-2-rag");


let dataBuffer = fs.readFileSync("./QT.pdf");

const parser = new PDFParse({
    data: dataBuffer,
});

const data = await parser.getText();

const embeddings = new MistralAIEmbeddings({
    apiKey: process.env.MISTRAL_API_KEY,
    model: "mistral-embed",
});

const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 100,
});

const chunks = await splitter.splitText(data.text);

console.log(`Total chunks to embed: ${chunks.length}`);

const docs = [];
const batchSize = 20;

for (let i = 0; i < chunks.length; i += batchSize) {
    const batch = chunks.slice(i, i + batchSize);
    const batchEmbeddings = await embeddings.embedDocuments(batch);

    for (let j = 0; j < batch.length; j++) {
        docs.push({
            text: batch[j],
            embedding: batchEmbeddings[j],
        });
    }

    console.log(`Embedded ${Math.min(i + batchSize, chunks.length)}/${chunks.length}`);
}

console.log("docs.length before upsert:", docs.length);

if (docs.length === 0) {
    throw new Error("No docs to upsert — embedding step produced nothing.");
}

await index.upsert({
    records: docs.map((doc, i) => ({
        id: `doc-${i}`,
        values: doc.embedding,
        metadata: {
            text: doc.text,
        },
    })),
});

console.log("Upsert complete:", docs.length, "vectors");


const queryEmbedding = await embeddings.embedQuery("What is Mindset and Philosophy ?");

console.log("Query Embedding: ", queryEmbedding);

const results = await index.query({
    vector: queryEmbedding,
    topK: 2,
    includeMetadata: true,
});

console.log(JSON.stringify(results));

const context = results.matches.map((m) => m.metadata.text).join("\n\n");

const chatModel = new ChatMistralAI({
    apiKey: process.env.MISTRAL_API_KEY,
    model: "mistral-small-latest",
});

const prompt = `Answer the question using ONLY the context below. If the answer isn't in the context, say you don't know.

Context:
${context}

Question: What is Mindset and Philosophy ?

Answer:`;

const response = await chatModel.invoke(prompt);

console.log("Answer: ", response.content);
