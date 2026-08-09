// backend/scoring/riskScorer.js
const { Groq } = require('groq-sdk');
const { createClient } = require('@supabase/supabase-js');
const { generateEmbedding } = require('../services/ragIngestion');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY);

/**
 * RAG Helper: Queries Supabase pgvector for news relevant to active batch routes
 */
async function fetchRelevantRAGContext(activeBatches) {
  console.log('🔍 Agent: Running vector search in Supabase for batch route risks...');
  
  // Construct search queries based on active batch origins, destinations, and minerals
  const searchQueries = activeBatches.map(b => `${b.mineral} ${b.origin} ${b.destination}`).join(" ");
  
  // Convert search query into 384-dim vector
  const queryVector = await generateEmbedding(searchQueries);
  if (!queryVector) return [];

  // Query Supabase match_news function
  const { data: matchedArticles, error } = await supabase.rpc('match_news', {
    query_embedding: queryVector,
    match_threshold: 0.15,
    match_count: 5
  });

  if (error) {
    console.warn('⚠️ Supabase vector search warning:', error.message);
    return [];
  }

  return matchedArticles || [];
}

/**
 * Main Agent Function: Analyzes active batches + RAG news and returns JSON alerts
 */
async function analyzeBatchRisksWithGroq(activeBatches) {
  console.log('\n🤖 Agent: Initializing Autonomous Risk Analysis via Groq (Llama 3)...');

  // 1. Perform RAG Vector Search
  const ragNews = await fetchRelevantRAGContext(activeBatches);
  console.log(`📰 Agent retrieved ${ragNews.length} relevant intelligence articles from vector DB.`);

  // 2. Prepare System & User Prompts for Groq
 // Inside backend/scoring/riskScorer.js

  const systemPrompt = `You are an Enterprise Supply Chain Intelligence Agent for MineralChain AI.
Your task is to analyze active transit batches against real-time news intelligence retrieved from our vector database.

RULES:
1. Generate between 3 to 5 distinct risk alerts covering different minerals and active batches if news context supports it.
2. Vary severity levels appropriately ("High", "Medium", "Low").
3. For each alert, summarize the real-world cause from news context and recommend a concrete mitigation action.
4. List the exact affected batch IDs (e.g. ["BT-9041", "BT-8821"]).

CRITICAL: Return ONLY a valid JSON object formatted exactly like this:
{
  "alerts": [
    {
      "id": "ALT-001",
      "severity": "High",
      "mineral": "Lithium",
      "cause": "Specific concise disruption cause from news context...",
      "action": "Recommended supply chain mitigation step...",
      "affected_batches": ["BT-9041"]
    }
  ]
}
Do not include any extra prose, markdown code blocks, or conversational text outside the JSON.`;
  const userPrompt = `
ACTIVE TRANSIT BATCHES:
${JSON.stringify(activeBatches, null, 2)}

RETRIEVED RAG NEWS CONTEXT:
${JSON.stringify(ragNews.map(n => ({ title: n.title, description: n.description, source: n.source })), null, 2)}
`;

  try {
    // 3. Call Groq API with hyper-fast Llama 3 inference
    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.2,
      response_format: { type: 'json_object' }
    });

    const rawResponse = completion.choices[0]?.message?.content;
    const parsedData = JSON.parse(rawResponse);
    
    console.log('✅ Agentic analysis complete!');
    return parsedData.alerts || [];

  } catch (err) {
    console.error('❌ Groq Agent Error:', err.message);
    // Safe fallback if API key or rate limit occurs
    return [];
  }
}

module.exports = {
  analyzeBatchRisksWithGroq
};