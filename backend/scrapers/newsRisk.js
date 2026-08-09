const Apify = require('apify-client');

const client = new Apify.ApifyClient({ token: process.env.APIFY_TOKEN });

const RISK_QUERIES = [
  // 1. Focus solely on Lithium (The "White Gold")
  "Lithium mining (disruption OR delay OR shortage OR accident) (India OR J&K OR Salal) 2026",
  
  // 2. Focus solely on Copper (The "Nervous System")
  "Copper supply (strike OR shortage OR price spike) (LME OR Chile OR India) 2026",

  // 3. Indian Policy (General but impactful)
  "India critical mineral (import ban OR export restriction OR mining policy) 2026"
];
fd
async function scrapeRiskNews() {
  const results = [];
  for (const query of RISK_QUERIES) {
    console.log(`[Apify] Running Master Query: "${query.slice(0, 40)}..."`);
    const run = await client.actor("apify/rag-web-browser").call({
      query,
      maxResults: 2, // Keep it lean to save credits
      proxyConfiguration: { useApifyProxy: true } // Helps bypass blocks
    });
    
    const { items } = await client.dataset(run.defaultDatasetId).listItems();
    if (!items) continue;

    results.push(...items.map(item => ({
      query,
      title: item.searchResult?.title || "Supply Update",
      url: item.searchResult?.url || "#",
      description: item.searchResult?.description || "Market intelligence update.",
      content: item.markdown?.slice(0, 500), // first 500 chars
      scrapedAt: new Date().toISOString()
    })));
  }
  return results;
}

// NEW: Indian Specific Scraper
async function scrapeIndianNews() {
  console.log(`[Apify] Fetching dedicated Indian mining news...`);
  const run = await client.actor(
    "complex_intricate_networks/news-article-scraper-100-global-sources-api"
  ).call({
    keywordFilter: "mining accident, mine collapse, mineral supply, NMDC, lithium",
    countries: ["India"], // Corrected input key based on Actor schema
    maxArticles: 20
  });
  
  const { items } = await client.dataset(run.defaultDatasetId).listItems();
  
  // Map these items to the same format as scrapeRiskNews so the Scorer can read them
  return items.map(item => ({
    query: "India Dedicated Feed",
    title: item.title,
    url: item.url,
    description: item.summary,
    scrapedAt: new Date().toISOString()
  }));
}

// UPDATED EXPORT: Export both as an object
module.exports = {
  scrapeRiskNews,
  scrapeIndianNews
};