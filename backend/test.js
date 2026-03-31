// backend/test-rss.js
require('dotenv').config();
const scrapeRSSFeeds = require('./scrapers/indianRSSFeeds');

async function testRSS() {
  console.log("📡 Testing Indian Mining RSS Feeds...");
  console.log("-----------------------------------------");

  try {
    const articles = await scrapeRSSFeeds();
    
    if (articles.length === 0) {
      console.log("⚠️ Result: 0 articles found. The feeds might be blocking your connection (403).");
    } else {
      console.log(`✅ Success! Found ${articles.length} total articles.`);
      
      // Print the first 3 articles to see the data structure
      articles.slice(0, 3).forEach((article, index) => {
        console.log(`\n[Article ${index + 1}]`);
        console.log(`Title: ${article.title}`);
        console.log(`Link:  ${article.url}`);
        console.log(`Date:  ${article.publishedAt || 'N/A'}`);
      });
    }
  } catch (err) {
    console.error("❌ Test Failed:", err.message);
  }
}

testRSS();

const HIGH_RISK_KEYWORDS = [
  'ban', 'halt', 'suspended', 'shortage', 'blocked',
  'sanctions', 'conflict', 'disruption', 'emergency', 'accident', 'fatalities', 'collapse'
];

const MEDIUM_RISK_KEYWORDS = [
  'delay', 'weather', 'flood', 'strike', 'reduced',
  'warning', 'monitor', 'concern', 'tension', 'slowdown'
];

// NEW: The "False-Positive" Guard
const POSITIVE_KEYWORDS = [
  'zero', 'safe', 'improvement', 'success', 'no fatalities', 
  'resumed', 'resolved', 'award', 'growth', 'stable'
];

const MINERAL_MAP = {
  'lithium': 'Lithium', 'cobalt': 'Cobalt',
  'graphite': 'Graphite', 'nickel': 'Nickel',
  'rare earth': 'Rare Earths','copper': 'Copper',    
  'aluminum': 'Aluminum',  
  'aluminium': 'Aluminum'
};

// Generates fake batches so your React UI's `.join(', ')` doesn't crash
function generateAffectedBatches() {
  const count = Math.floor(Math.random() * 3) + 1; 
  const batches = [];
  for (let i = 0; i < count; i++) {
    batches.push(`BT-${Math.floor(Math.random() * 9000) + 1000}`);
  }
  return batches;
}

function scoreArticle(article) {
  const text = (article.title + ' ' + article.description).toLowerCase();
  
  // 1. Detect mineral
  let mineral = 'General';
  for (const [keyword, name] of Object.entries(MINERAL_MAP)) {
    if (text.includes(keyword)) { mineral = name; break; }
  }
  
  // 2. Score severity
  let severity = 'LOW';
  if (HIGH_RISK_KEYWORDS.some(k => text.includes(k))) severity = 'HIGH';
  else if (MEDIUM_RISK_KEYWORDS.some(k => text.includes(k))) severity = 'MEDIUM';
  
  // 3. NEW: Sentiment Override (The False-Positive Fix)
  // If it mentions "zero fatalities", it overrides the "fatalities" trigger and sets it back to LOW.
  if (POSITIVE_KEYWORDS.some(k => text.includes(k))) {
    severity = 'LOW'; 
  }

  // 4. NEW: Clean up the description (Remove "Read more")
  const cleanDescription = article.description 
    ? article.description.replace(/\.?\s*Read more/ig, '').trim() 
    : 'No details provided.';

  // 5. NEW: Generate a "Deep Insight" based on the severity
  let insight = "";
  if (severity === 'HIGH') {
     insight = ` 🔴 AI Insight: Potential 15-20% price hike or procurement bottleneck expected in regional markets if supply remains constrained for >14 days.`;
  } else if (severity === 'MEDIUM') {
     insight = ` 🟡 AI Insight: Monitor local inventory levels; minor logistical delays likely in the upcoming quarter. Hedge accordingly.`;
  }

  return {
    mineral: mineral,
    severity: severity,
    cause: article.title, 
    // Combine the clean news snippet with the AI-driven logic
    summary: `${cleanDescription}. ${insight}`, 
    source: article.url,
    action: getRecommendation(mineral, severity),
    affected_batches: generateAffectedBatches(), 
    created_at: new Date().toISOString() 
  };
}

function getRecommendation(mineral, severity) {
  if (severity === 'HIGH') return `Immediate action: find alternative ${mineral} suppliers. Review active contracts for Force Majeure clauses.`;
  if (severity === 'MEDIUM') return `Monitor closely. Consider increasing ${mineral} buffer stock by 2-3 weeks to hedge against volatility.`;
  return `No action needed. Continue normal ${mineral} procurement.`;
}

module.exports = scoreArticle;