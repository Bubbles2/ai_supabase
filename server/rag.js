const { SupabaseVectorStore } = require("@langchain/community/vectorstores/supabase");
const { createClient } = require("@supabase/supabase-js");
const { OpenAIEmbeddings, ChatOpenAI } = require("@langchain/openai");
const { ChatPromptTemplate } = require("@langchain/core/prompts");
const { StringOutputParser } = require("@langchain/core/output_parsers");

// Global store
let vectorStore = null;

// Simple text splitter to avoid import issues
const splitText = (text, chunkSize = 1000, overlap = 200) => {
    const chunks = [];
    let startIndex = 0;
    while (startIndex < text.length) {
        const end = Math.min(startIndex + chunkSize, text.length);
        chunks.push(text.slice(startIndex, end));
        startIndex += (chunkSize - overlap);
    }
    return chunks.map(c => ({ pageContent: c, metadata: {} }));
};

// Initialize Vector Store with Supabase
const initializeVectorStore = async (text) => {
    const splitDocs = splitText(text);
    const embeddings = new OpenAIEmbeddings();

    const client = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_PRIVATE_KEY
    );

    // Store documents in Supabase
    vectorStore = await SupabaseVectorStore.fromDocuments(
        splitDocs,
        embeddings,
        {
            client,
            tableName: "documents",
            queryName: "match_documents",
        }
    );
};

const chat = async (question) => {
    let store = vectorStore;

    // If vector store is not initialized in memory, try to connect to Supabase
    if (!store) {
        const client = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_PRIVATE_KEY
        );
        const embeddings = new OpenAIEmbeddings();
        
        store = new SupabaseVectorStore(embeddings, {
            client,
            tableName: "documents",
            queryName: "match_documents",
        });
    }

    const model = new ChatOpenAI({
        modelName: "gpt-3.5-turbo",
        temperature: 0.7,
    });

    const retriever = store.asRetriever();

    // Manual retrieval
    const contextDocs = await retriever.invoke(question);
    const contextText = contextDocs.map(doc => doc.pageContent).join("\n\n");

    const prompt = ChatPromptTemplate.fromTemplate(`
    Answer the user's question in a friendly, helpful tone. Use the provided context to answer. 
    If the answer is not in the context, say you don't know based on the document.

    Context:
    {context}

    Question: {question}
  `);

    const chain = prompt.pipe(model).pipe(new StringOutputParser());

    const response = await chain.invoke({
        question,
        context: contextText,
    });

    return response;
};

module.exports = { initializeVectorStore, chat };
