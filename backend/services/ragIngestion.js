// backend/services/ragIngestion.js
const { pipeline } = require('@xenova/transformers');
const { createClient } = require('@supabase/supabase-js');
const scrapeRSSFeeds = require('../scrapers/indianRSSFeeds');

// Initialize Supabase Client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

let featureExtractor = null;

// Lazy-load the local embedding model once into memory
async function getExtractor() {
  if (!featureExtractor) {
    console.log('🤖 Loading local embedding model (Xenova/all-MiniLM-L6-v2)...');
    featureExtractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  }
  return featureExtractor;
}

// Helper to convert plain text into a 384-float vector array
async function generateEmbedding(text) {
  try {
    const extractor = await getExtractor();
    const output = await extractor(text, { pooling: 'mean', normalize: true });
    return Array.from(output.data);
  } catch (err) {
    console.error('❌ Embedding generation error:', err.message);
    return null;
  }
}

// Main function to run RSS scraper, convert articles to vectors, and push to Supabase
async function syncRSSFeedsToVectorDB() {
  console.log('\n🔄 Starting RAG Ingestion Pipeline...');

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Supabase credentials missing from .env (SUPABASE_URL / SUPABASE_KEY)');
    return;
  }

  // 1. Fetch fresh supply chain news
  const articles = await scrapeRSSFeeds();
  if (!articles || articles.length === 0) {
    console.log('⚠️ No new articles fetched.');
    return;
  }

  console.log(`🧠 Generating vector embeddings for ${articles.length} articles...`);
  
  let successCount = 0;

  for (const article of articles) {
    const textToEmbed = `${article.title}. ${article.description}`;
    const embeddingVector = await generateEmbedding(textToEmbed);

    if (!embeddingVector) continue;

    // 2. Insert into Supabase news_embeddings table
    const { error } = await supabase.from('news_embeddings').insert({
      title: article.title,
      description: article.description,
      url: article.url,
      source: article.source,
      published_at: article.publishedAt,
      embedding: embeddingVector
    });

    if (error) {
      // Ignore minor duplicate or constraint errors
      if (!error.message.includes('duplicate')) {
        console.warn(`⚠️ Supabase Insert Notice: ${error.message}`);
      }
    } else {
      successCount++;
    }
  }

  console.log(`✅ RAG Ingestion Complete! ${successCount} articles embedded and saved to Supabase.\n`);
}

module.exports = {
  syncRSSFeedsToVectorDB,
  generateEmbedding
};