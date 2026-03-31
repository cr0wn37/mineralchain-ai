const Parser = require('rss-parser');
const parser = new Parser();

const RSS_FEEDS = [
  // 1. Google News RSS filtered for Indian Mining & Lithium
  'https://news.google.com/rss/search?q=lithium+copper+mining+india+when:7d&hl=en-IN&gl=IN&ceid=IN:en',
  
  // 2. Google News RSS filtered for Vedanta, NMDC, and GSI disruptions
  'https://news.google.com/rss/search?q=(Vedanta+OR+NMDC+OR+GSI)+mining+disruption+india+when:7d&hl=en-IN&gl=IN&ceid=IN:en',

  // 3. Economic Times Energy (Keep this one as it's working)
  'https://energy.economictimes.indiatimes.com/rss/coal'
];

const MINING_KEYWORDS = [
  'mine', 'mining', 'mineral', 'lithium', 'cobalt', 'graphite',
  'nickel', 'nmdc', 'vedanta', 'accident', 'collapse', 'halt',
  'shutdown', 'flood', 'landslide', 'strike', 'suspension'
];

async function scrapeRSSFeeds() {
  console.log('📰 Fetching Indian Industry RSS Feeds...');
  const Parser = require('rss-parser');
  // Add headers to bypass 403 blocks
  const parser = new Parser({
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Accept': 'application/rss+xml, application/xml, text/xml',
    },
  });
  const alerts = [];

  for (const feedUrl of RSS_FEEDS) {
    try {
      const feed = await parser.parseURL(feedUrl);
      
      const relevant = feed.items.filter(item => {
        const textToSearch = (item.title + ' ' + (item.contentSnippet || '')).toLowerCase();
        return MINING_KEYWORDS.some(k => textToSearch.includes(k.toLowerCase()));
      });

      // Format perfectly for riskScorer.js
      alerts.push(...relevant.map(item => {
        // Fallback Chain for Dates: isoDate -> pubDate -> current time
        const rawDate = item.isoDate || item.pubDate || item.date || new Date().toISOString();
        
        return {
          title: item.title,
          description: item.contentSnippet || item.title || "No description provided.",
          url: item.link,
          source: feed.title || "Indian Industry RSS",
          // Standardize to ISO string for Supabase consistency
          publishedAt: new Date(rawDate).toISOString() 
        };
      }));
    } catch (err) {
      console.error(`❌ Failed to parse RSS feed ${feedUrl}:`, err.message);
    }
  }
  return alerts;
}

module.exports = scrapeRSSFeeds;