require('dotenv').config();
const { analyzeBatchRisksWithGroq } = require('./scoring/riskScorer');

// Sample active batches from your enterprise mockData
const sampleBatches = [
  { id: "BT-9041", mineral: "Lithium Spodumene", supplier: "Pilbara Minerals", origin: "Port Hedland, AU", destination: "Port of Mundra, IN", status: "On High Seas" },
  { id: "BT-5022", mineral: "Cobalt Hydroxide", supplier: "Glencore", origin: "Kolwezi, DRC", destination: "Chennai Port, IN", status: "Inland Delay" }
];

async function testGroqAgent() {
  console.log('--- 🧪 TESTING STEP 4: GROQ LLAMA 3 RISK AGENT ---');
  const alerts = await analyzeBatchRisksWithGroq(sampleBatches);
  console.log('\n🚨 AI-GENERATED RISK ALERTS:');
  console.log(JSON.stringify(alerts, null, 2));
}

testGroqAgent();