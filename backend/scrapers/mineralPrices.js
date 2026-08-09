// backend/scrapers/mineralPrices.js
// Powered by Metalprice API (https://metalpriceapi.com)

const TROY_OUNCE_TO_TONNE = 32150.7466; // 1 metric tonne = 32,150.7466 troy ounces

async function getMineralPrices() {
  console.log('📈 Fetching live critical mineral prices from Metalprice API...');
  
  const apiKey = process.env.METALPRICE_API_KEY || process.env.METALS_DEV_KEY;
  if (!apiKey) {
    console.warn('⚠️ No METALPRICE_API_KEY found in .env, returning baseline market spot prices.');
    return getFallbackPrices();
  }

  // Official Metalprice API symbol codes
  const currencies = ['XLI', 'XCO', 'XCU', 'NI', 'ALU', 'XND', 'ZNC'].join(',');

  try {
    const res = await fetch(
      `https://api.metalpriceapi.com/v1/latest?api_key=${apiKey}&base=USD&currencies=${currencies}`
    );

    if (!res.ok) throw new Error(`Metalprice API HTTP Status ${res.status}`);
    const data = await res.json();

    if (!data.success) {
      const reason = data.error?.info || data.error?.type || 'API key restriction or invalid symbol';
      console.warn(`⚠️ Metalprice API Notice (${reason}). Falling back to baseline market spot prices.`);
      return getFallbackPrices();
    }

    const rates = data.rates || {};

    // Helper to calculate price per metric tonne in USD from raw rate
    const parsePricePerTonne = (symbol, fallbackSpot) => {
      const rawRate = rates[`USD${symbol}`] || rates[symbol];
      if (!rawRate || rawRate === 0) return fallbackSpot;

      const priceInUSDPerOunce = rawRate < 1 ? rawRate : (1 / rawRate);
      return parseFloat((priceInUSDPerOunce * TROY_OUNCE_TO_TONNE).toFixed(2));
    };

    return {
      lithium: { 
        price: parsePricePerTonne('XLI', 13500), 
        unit: 'USD/tonne', 
        symbol: 'SPOT-XLI' 
      },
      cobalt: { 
        price: parsePricePerTonne('XCO', 28500), 
        unit: 'USD/tonne', 
        symbol: 'SPOT-XCO' 
      },
      copper: { 
        price: parsePricePerTonne('XCU', 9200), 
        unit: 'USD/tonne', 
        symbol: 'LME-XCU' 
      },
      nickel: { 
        price: parsePricePerTonne('NI', 16800), 
        unit: 'USD/tonne', 
        symbol: 'LME-NI' 
      },
      aluminum: { 
        price: parsePricePerTonne('ALU', 2450), 
        unit: 'USD/tonne', 
        symbol: 'LME-ALU' 
      },
      neodymium: { 
        price: parsePricePerTonne('XND', 72000), 
        unit: 'USD/tonne', 
        symbol: 'REO-XND' 
      },
      zinc: { 
        price: parsePricePerTonne('ZNC', 2800), 
        unit: 'USD/tonne', 
        symbol: 'LME-ZNC' 
      },
      updatedAt: new Date(data.timestamp ? data.timestamp * 1000 : Date.now()).toISOString()
    };

  } catch (err) {
    console.error('❌ Failed to fetch live mineral prices:', err.message);
    return getFallbackPrices();
  }
}

function getFallbackPrices() {
  return {
    lithium: { price: 13500, unit: 'USD/tonne', symbol: 'SPOT-LI' },
    cobalt: { price: 28500, unit: 'USD/tonne', symbol: 'SPOT-CO' },
    copper: { price: 9200, unit: 'USD/tonne', symbol: 'LME-CU' },
    nickel: { price: 16800, unit: 'USD/tonne', symbol: 'LME-NI' },
    aluminum: { price: 2450, unit: 'USD/tonne', symbol: 'LME-ALU' },
    neodymium: { price: 72000, unit: 'USD/tonne', symbol: 'REO-ND' },
    zinc: { price: 2800, unit: 'USD/tonne', symbol: 'LME-ZNC' },
    updatedAt: new Date().toISOString()
  };
}

module.exports = getMineralPrices;