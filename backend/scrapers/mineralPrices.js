// backend/scrapers/mineralPrices.js
// Using metals.dev — free plan, no credit card needed
// Sign up at: https://metals.dev

async function getMineralPrices() {
  console.log('📈 Fetching live mineral prices...');
  try {
    // metals.dev free tier endpoint
    const res = await fetch(
      `https://api.metals.dev/v1/latest?api_key=${process.env.METALS_DEV_KEY}&currency=USD&unit=toz`
    );

    if (!res.ok) throw new Error(`Metals.Dev returned ${res.status}`);
    const data = await res.json();

    if (data.status !== 'success') {
      throw new Error(data.message || 'API error');
    }

    const metals = data.metals;

    // Convert LME prices from per troy ounce to per tonne
    const toTonne = (val) => val ? parseFloat((val * 32150).toFixed(2)) : null;

    return {
      // LME metals — available on free plan
      copper:    { price: toTonne(metals?.copper),    unit: 'USD/tonne', symbol: 'LME-CU' },
      aluminium: { price: toTonne(metals?.aluminum),  unit: 'USD/tonne', symbol: 'LME-ALU' },
      nickel:    { price: toTonne(metals?.nickel),    unit: 'USD/tonne', symbol: 'LME-NI' },

      // Lithium — Static/Baseline for prototype (Spot prices move slowly)
      lithium:   { price: 13500,                      unit: 'USD/tonne', symbol: 'SPOT-LI' },

      updatedAt: new Date().toISOString()
    };

  } catch (err) {
    console.error('❌ Failed to fetch mineral prices:', err.message);
    return null;
  }
}

module.exports = getMineralPrices;