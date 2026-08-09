const Parser = require('rss-parser');

const RSS_FEEDS = [
  // 1. India Domestic Mining & Port Disruptions
  'https://news.google.com/rss/search?q=(lithium+OR+cobalt+OR+copper+OR+NMDC+OR+Vedanta)+mining+(disruption+OR+delay+OR+strike+OR+monsoon)+India&hl=en-IN&gl=IN&ceid=IN:en',
  
  // 2. Chile & South America Lithium Corridor
  'https://news.google.com/rss/search?q=(lithium+OR+SQM+OR+Albemarle)+mining+(strike+OR+delay+OR+protest+OR+water)+Chile&hl=en-US&gl=US&ceid=US:en',
  
  // 3. DRC & Central Africa Cobalt Corridor
  'https://news.google.com/rss/search?q=(cobalt+OR+Glencore+OR+CMOC)+mining+(delay+OR+rail+OR+export+OR+unrest)+DRC+Congo&hl=en-US&gl=US&ceid=US:en',
  
  // 4. Maritime & Port Chokepoints (Mundra, Malacca, Hazira)
  'https://news.google.com/rss/search?q=(port+OR+shipping+OR+vessel)+congestion+(Mundra+OR+Malacca+OR+Chennai+OR+Hazira)&hl=en-US&gl=US&ceid=US:en',
  
  // 5. China Processing & Policy Restrictions
  'https://news.google.com/rss/search?q=critical+minerals+(export+restriction+OR+quota+OR+power+cut)+China&hl=en-US&gl=US&ceid=US:en'
];

const FILTER_KEYWORDS = [
  // Minerals
  'lithium', 'cobalt', 'graphite', 'nickel', 'rare earth', 'copper', 'spodumene',
  // Disruption Triggers
  'strike', 'delay', 'congestion', 'export', 'ban', 'shortage', 'protest', 
  'weather', 'cyclone', 'monsoon', 'rail', 'port', 'halt', 'shutdown', 'quota', 'unrest'
];

async function scrapeRSSFeeds() {
  console.log('📰 Fetching Global & Indian Critical Mineral RSS Feeds (Free Tier)...');
  
  const parser = new Parser({
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'application/rss+xml, application/xml, text/xml',
    },
    timeout: 8000,
  });

  const rawArticles = [];

  for (const feedUrl of RSS_FEEDS) {
    try {
      const feed = await parser.parseURL(feedUrl);
      
      const matchedItems = feed.items.filter(item => {
        const textToSearch = `${item.title || ''} ${item.contentSnippet || ''}`.toLowerCase();
        return FILTER_KEYWORDS.some(keyword => textToSearch.includes(keyword));
      });

      rawArticles.push(...matchedItems.map(item => {
        const rawDate = item.isoDate || item.pubDate || new Date().toISOString();
        
        return {
          title: item.title ? item.title.trim() : "Supply Chain Update",
          description: item.contentSnippet ? item.contentSnippet.trim() : item.title,
          url: item.link || "#",
          source: feed.title || "Global Logistics RSS",
          publishedAt: new Date(rawDate).toISOString()
        };
      }));
    } catch (err) {
      console.error(`⚠️ Notice: Skipped feed query (${err.message})`);
    }
  }

  // Deduplicate articles by title
  const uniqueArticles = Array.from(
    new Map(rawArticles.map(article => [article.title, article])).values()
  );

  console.log(`✅ Extracted ${uniqueArticles.length} unique supply chain intelligence items.`);
  return uniqueArticles;
}

module.exports = scrapeRSSFeeds;