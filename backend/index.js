// backend/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const { syncRSSFeedsToVectorDB } = require('./services/ragIngestion');
const { analyzeBatchRisksWithGroq } = require('./scoring/riskScorer');
const getMineralPrices = require('./scrapers/mineralPrices');

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY
);

// backend/index.js

const FALLBACK_BATCHES = [
  { id: "BT-9041", mineral: "Lithium Spodumene", supplier: "SQM / Albemarle", origin: "Atacama, Chile", destination: "Port of Mundra, IN", status: "On High Seas" },
  { id: "BT-5022", mineral: "Cobalt Hydroxide", supplier: "Glencore", origin: "Kolwezi, DRC", destination: "Chennai Port, IN", status: "Inland Transit" },
  { id: "BT-3011", mineral: "Copper Cathode", supplier: "Codelco", origin: "Antofagasta, Chile", destination: "Hazira Port, IN", status: "In Transit" },
  { id: "BT-7088", mineral: "Nickel Sulfate", supplier: "Vales / Tsingshan", origin: "Morowali, Indonesia", destination: "JNPT Mumbai, IN", status: "Customs Clearance" },
  { id: "BT-1045", mineral: "Neodymium Oxide", supplier: "Lynas Rare Earths", origin: "Kwinana, Australia", destination: "Vishakhapatnam, IN", status: "Port Delay" },
  { id: "BT-8821", mineral: "Lithium Carbonate", supplier: "Pilbara Minerals", origin: "Port Hedland, Australia", destination: "Port of Mundra, IN", status: "On High Seas" },
  { id: "BT-4109", mineral: "Cobalt Concentrate", supplier: "CMOC Group", origin: "Tenke Fungurume, DRC", destination: "Kolkata Port, IN", status: "Inland Freight" },
  { id: "BT-6302", mineral: "Copper Anode", supplier: "Hindustan Copper", origin: "Khetri, Rajasthan", destination: "Dahej Port, IN", status: "Dispatched" },
  { id: "BT-2099", mineral: "Graphite Anode", supplier: "Syrah Resources", origin: "Balama, Mozambique", destination: "Chennai Port, IN", status: "In Transit" },
  { id: "BT-5541", mineral: "Rare Earth Concentrate", supplier: "Shenghe Resources", origin: "Sichuan, China", destination: "Kandla Port, IN", status: "Export Audit" }
];

let cachedAlerts = null;
let lastScanTime = 0;
const CACHE_DURATION_MS = 3 * 60 * 1000; // 3 Minutes Cache

// 1. Endpoint to trigger fresh news RAG ingestion
app.post('/api/sync-rag-news', async (req, res) => {
  try {
    await syncRSSFeedsToVectorDB();
    res.json({ success: true, message: 'RSS feeds embedded and saved to vector DB.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Endpoint for Live Mineral Prices
app.get('/api/mineral-prices', async (req, res) => {
  const prices = await getMineralPrices();
  res.json(prices);
});

// 3. MAIN AI ENDPOINT: Run Groq Risk Scan on Active Batches
app.post('/api/ai-risk-scan', async (req, res) => {
  try {
    const now = Date.now();

    // Return cached AI alerts if scanned within the last 3 minutes
    if (cachedAlerts && (now - lastScanTime < CACHE_DURATION_MS) && !req.body.forceRefresh) {
      console.log('⚡ Returning cached Groq AI alerts (Saving API tokens)...');
      return res.json({ success: true, alerts: cachedAlerts, cached: true });
    }

    let activeBatches = req.body.batches;

    if (!activeBatches || activeBatches.length === 0) {
      const { data } = await supabase.from('batches').select('*').limit(10);
      if (data && data.length > 0) activeBatches = data;
    }

    if (!activeBatches || activeBatches.length === 0) {
      activeBatches = FALLBACK_BATCHES;
    }

    // Call Groq Agent
    const alerts = await analyzeBatchRisksWithGroq(activeBatches);
    
    // Cache the result
    if (alerts && alerts.length > 0) {
      cachedAlerts = alerts;
      lastScanTime = now;
    }

    res.json({ success: true, alerts, cached: false });

  } catch (err) {
    console.error('❌ Endpoint Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 MineralChain AI Backend running on port ${PORT}`);
});