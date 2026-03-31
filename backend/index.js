console.log("📍 Node is reading index.js...");

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Import your scrapers
const { scrapeRiskNews, scrapeIndianNews } = require('./scrapers/newsRisk');
const { getWeatherAlerts, scrapeDGMSAlerts } = require('./scrapers/weatherRisk');
const scrapeRSSFeeds = require('./scrapers/indianRSSFeeds');
const fetchMineralPrices = require('./scrapers/mineralPrices'); // <-- ADD THIS
const scoreArticle = require('./scoring/riskScorer');

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL, 
  process.env.SUPABASE_KEY,
  {
    auth: {
      persistSession: false
    },
    global: {
      fetch: (...args) => fetch(...args), // Forces use of Node's native fetch
    },
  }
);

async function runDailyRiskUpdate() {
  console.log(`\n[${new Date().toISOString()}] 🚀 STARTING FULL RISK PIPELINE...`);
  
  try {
    // 1. Fetch all raw text articles concurrently
    // --- STEP 1: Sequential Fetching (Saves Memory/Credits) ---
    
    console.log("🔍 Scraping Global News...");
    const globalNews = await scrapeRiskNews().catch(err => { 
        console.error('Global News err:', err.message); return []; 
    });

    console.log("🇮🇳 Scraping Indian News...");
    const indianNews = await scrapeIndianNews().catch(err => { 
        console.error('Indian News err:', err.message); return []; 
    });

    console.log("👷 Scraping DGMS...");
    const dgmsAlerts = await scrapeDGMSAlerts().catch(err => { 
        console.error('DGMS err:', err.message); return []; 
    });

    console.log("📡 Scraping RSS...");
    const rssFeeds = await scrapeRSSFeeds().catch(err => { 
        console.error('RSS err:', err.message); return []; 
    });
    console.log(`✅ Found ${rssFeeds.length} articles from RSS feeds.`);

    console.log("📈 Fetching Prices...");
    const priceData = await fetchMineralPrices().catch(err => { 
        console.error('Prices err:', err.message); return null; 
    });


    // Combine all raw text sources
    const allTextArticles = [...globalNews, ...indianNews, ...dgmsAlerts, ...rssFeeds];
    
    // 2. Score them all and filter out 'LOW'
    const scoredNewsAlerts = allTextArticles
      .map(scoreArticle)
      .filter(a => a.severity !== 'LOW');

    console.log(`✅ Scored ${scoredNewsAlerts.length} High/Medium text-based alerts.`);

    // 3. Fetch pre-formatted alerts (Weather)
    const weatherAlerts = await getWeatherAlerts().catch(err => { 
      console.error('Weather err:', err.message); return []; 
    });
    console.log(`✅ Fetched ${weatherAlerts.length} active weather alerts.`);

    // --- STEP 3.5: Handle Price Data Alert ---
    let marketAlerts = [];
    if (priceData) {
      marketAlerts.push({
        mineral: 'Market Overview',
        severity: 'LOW', 
        cause: 'Daily LME & Global Spot Price Refresh',
        // Notice the added .price below!
       // Inside your market alert generation in index.js
        summary: `Latest Rates (USD/Tonne): Lithium: $${priceData.lithium?.price}, Copper: $${priceData.copper?.price}, Aluminium: $${priceData.aluminium?.price}, Nickel: $${priceData.nickel?.price}.`,
        action: 'Informational: Review procurement margins and contract indexing against these spot rates.',
        affected_batches: ['All Global Shipments'],
        created_at: new Date().toISOString()
      });
      console.log('✅ Generated Market Price summary alert.');
    }

    // 4. Combine Everything
    const finalAlertsToSave = [...scoredNewsAlerts, ...weatherAlerts, ...marketAlerts];
    
    // 5. Save to Supabase
    if (finalAlertsToSave.length > 0) {
      console.log(`📡 Attempting to push ${finalAlertsToSave.length} alerts to Supabase...`);
      
      try {
        const { data, error } = await supabase
          .from('risk_alerts')
          .insert(finalAlertsToSave)
          .select(); // Adding .select() helps some Node versions confirm the "handshake"

        if (error) {
          // This will tell us if a column name is wrong (e.g., 'cause' vs 'title')
          console.error('❌ Supabase DB Error:', error.message);
          console.error('Details:', error.details || 'Check column names and data types.');
        } else {
          console.log(`🎉 SUCCESS: ${data.length} alerts are now LIVE in the database.`);
        }
      } catch (insertErr) {
        // This catches the 'fetch failed' network error specifically
        console.error('🌐 Network/Fetch Error:', insertErr.message);
        console.log('💡 TIP: Try running with: node --dns-result-order=ipv4first index.js');
      }
    } else {
      console.log('📭 No high/medium risks detected today.');
    }

  } catch (globalErr) {
    // This catches crashes in the Scrapers themselves
    console.error('💥 SCRAPER PIPELINE FAILURE:', globalErr.message);
  }
}

runDailyRiskUpdate();
setInterval(runDailyRiskUpdate, 24 * 60 * 60 * 1000);