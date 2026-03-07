import { Pinecone } from '@pinecone-database/pinecone';

// Initialize the Pinecone client securely.
// In production or when deploying, ensure PINECONE_API_KEY is set.
export const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY || 'dummy-key-for-build',
});
