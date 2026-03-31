const Apify = require('apify-client');
const client = new Apify.ApifyClient({ token: process.env.APIFY_TOKEN });

const MINING_REGIONS = [
  { name: 'J&K Salal (Lithium)', lat: 33.08, lon: 74.82, mineral: 'Lithium' },
  { name: 'Odisha Keonjhar (Graphite)', lat: 21.62, lon: 85.58, mineral: 'Graphite' },
  { name: 'Goa (Nickel/Manganese)', lat: 15.49, lon: 73.82, mineral: 'Nickel' }
];

function generateAffectedBatches() {
  const count = Math.floor(Math.random() * 2) + 1; 
  const batches = [];
  for (let i = 0; i < count; i++) {
    batches.push(`BT-${Math.floor(Math.random() * 9000) + 1000}`);
  }
  return batches;
}

async function getWeatherAlerts() {
  console.log('🌤️ Fetching weather forecasts for Indian mining regions...');
  const alerts = [];
  for (const region of MINING_REGIONS) {
    try {
      const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${region.lat}&lon=${region.lon}&appid=${process.env.OPENWEATHER_KEY}&units=metric`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Weather API returned ${res.status}`);
      const data = await res.json();
      
      const extreme = data.list?.find(item => 
        item.weather[0].main === 'Snow' ||
        item.weather[0].main === 'Thunderstorm' ||
        item.rain?.['3h'] > 20
      );
      
      if (extreme) {
        alerts.push({
          mineral: region.mineral,
          severity: 'MEDIUM',
          cause: `Extreme Weather — ${region.name}`,
          summary: `${extreme.weather[0].description} forecast on ${new Date(extreme.dt * 1000).toDateString()}. Mining operations may be delayed 5–10 days.`,
          action: `Increase ${region.mineral} buffer stock. Alert supplier to expedite pending shipments.`,
          affected_batches: generateAffectedBatches(),
          created_at: new Date().toISOString() 
        });
      }
    } catch (err) {
      console.error(`❌ Failed to fetch weather for ${region.name}:`, err.message);
    }
  }
  return alerts;
}

// NEW: DGMS Scraper
async function scrapeDGMSAlerts() {
  console.log('👷 Fetching DGMS Mine Safety Alerts...');
  try {
    const run = await client.actor("apify/rag-web-browser").call({
      query: "site:dgms.gov.in mine accident notice 2026",
      maxResults: 2
    });
    const { items } = await client.dataset(run.defaultDatasetId).listItems();
    
    // Format perfectly for riskScorer.js
    return items.map(item => ({
      title: item.searchResult?.title || "DGMS Safety Notice",
      url: item.searchResult?.url || "https://dgms.gov.in",
      description: item.searchResult?.description || item.markdown?.slice(0, 500) || "Mine safety alert issued.",
      scrapedAt: new Date().toISOString()
    }));
  } catch (err) {
    console.error('❌ DGMS Scraper Failed:', err.message);
    return [];
  }
}

// Export both functions
module.exports = {
  getWeatherAlerts,
  scrapeDGMSAlerts
};