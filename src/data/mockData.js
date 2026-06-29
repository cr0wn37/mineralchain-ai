export const mockData = {
  // 10 Batches for the Active Batches Table
  batches: [
    {
      id: '#Li-9041',
      mineral: 'Lithium Spodumene Concentrate',
      supplier: 'Pilbara Minerals (Western Australia)',
      eta: 'Oct 24, 2026',
      status: 'On High Seas',
      origin: 'Port Hedland, AU',
      destination: 'Port of Mundra, IN', // ADANI EASTER EGG
      esg: { cert: 'Cert #WA-9920-CF', carbon: '1.2 kg CO2e / kg' }
    },
    {
      id: '#Co-5022',
      mineral: 'Cobalt Hydroxide',
      supplier: 'Glencore — Kamoto Copper',
      eta: 'Delayed',
      status: 'Inland Delay',
      origin: 'Kolwezi, DRC',
      destination: 'Chennai Port, IN',
      esg: { cert: 'Cert #DRC-4910-CF', carbon: '3.4 kg CO2e / kg' }
    },
    
    { 
      id: "BT-2088", 
      mineral: "Battery Anode Graphite", 
      supplier: "Epsilon Advanced Materials", // This is a real, massive Indian battery materials company!
      quantity: "600kg", 
      eta: "2026-03-18", 
      status: "On-Track",
      origin: "Karnataka, IN",
      destination: "Pune Gigafactory",
      esg: { cert: "ISO-14001 Verified", carbon: "0.8 kg CO2e / kg" }
    },
    { 
      id: "BT-8055", 
      mineral: "Rare Earth Oxides", 
      supplier: "Indian Rare Earths Ltd (IREL)", 
      quantity: "50kg", 
      eta: "2026-04-12", 
      status: "At-Risk",
      origin: "Odisha, IN",
      destination: "Gujarat Hub",
      esg: { cert: "Gov Auth #IND-RE-01", carbon: "2.1 kg CO2e / kg" }
    },
    { 
      id: "BT-4011", 
      mineral: "Lithium Carbonate", 
      supplier: "SQM (Salar de Atacama)", 
      quantity: "700kg", 
      eta: "2026-03-30", 
      status: "On-Track",
      origin: "Antofagasta, CL",
      destination: "Port of Mundra, IN",
      esg: { cert: "IRMA Standard 75", carbon: "1.9 kg CO2e / kg" }
    }
  ],
  alerts: [
    { 
      id: "ALT-001", 
      severity: "High", 
      mineral: "Cobalt", 
      cause: "Security escort mandates escalated in Haut-Katanga province, causing severe rail backlog to export ports.", 
      action: "Activate GeoTrace audit for alternative DRC corridors.", 
      affected_batches: ["BT-5022"] 
    },
    { 
      id: "ALT-002", 
      severity: "Medium", 
      mineral: "Lithium", 
      cause: "Berth congestion at Port of Mundra Bulk Terminal due to cyclonic weather patterns.", 
      action: "Calculate demurrage costs; evaluate Hazira Port diversion.", 
      affected_batches: ["BT-9041", "BT-4011"] 
    },
    { 
      id: "ALT-003", 
      severity: "High", 
      mineral: "Rare Earths", 
      cause: "Chinese Ministry of Commerce unannounced export quota adjustments. Global downstream pricing volatility imminent.", 
      action: "Secure secondary domestic refining contracts.", 
      affected_batches: ["BT-8055"] 
    },
    { 
      id: "ALT-004", 
      severity: "Low", 
      mineral: "Graphite", 
      cause: "Inland freight speed limits enforced in Karnataka due to monsoon infrastructure damage.", 
      action: "Monitor daily GPS telematics; minor friction expected.", 
      affected_batches: ["BT-2088"] 
    },
    { 
      id: "ALT-005", 
      severity: "High", 
      mineral: "Lithium", 
      cause: "Labor union (Sindicato No. 1) at Salar de Atacama initiating 48-hour strike over royalty disputes.", 
      action: "Increase domestic safety stock drawdowns by 15%.", 
      affected_batches: ["BT-4011"] 
    },
    { 
      id: "ALT-006", 
      severity: "Medium", 
      mineral: "Cobalt", 
      cause: "EU Battery Regulation compliance audit triggered for incoming Central African shipments.", 
      action: "Upload Tier-1 provenance certificates to blockchain ledger.", 
      affected_batches: ["BT-5022"] 
    }
  ],
  // 12 Suppliers for the Directory
 suppliers: [
    // --- THE GLOBAL LITHIUM HEAVYWEIGHTS ---
    { id: "SUP-101", name: "Pilbara Minerals", location: "Western Australia", mineral: "Lithium Spodumene", esg_rating: "A", delivery_time: "14 days", capacity: "680kT/yr" },
    { id: "SUP-102", name: "SQM (Salar de Atacama)", location: "Antofagasta, Chile", mineral: "Lithium Carbonate", esg_rating: "B+", delivery_time: "35 days", capacity: "180kT/yr" },
    { id: "SUP-103", name: "Albemarle (Greenbushes)", location: "Western Australia", mineral: "Lithium Spodumene", esg_rating: "A", delivery_time: "15 days", capacity: "Massive" },
    
    // --- THE CONGOLESE COBALT NODES (For the ESG & Chokepoint Angle) ---
    { id: "SUP-201", name: "Glencore (Kamoto Copper)", location: "Kolwezi, DRC", mineral: "Cobalt Hydroxide", esg_rating: "B", delivery_time: "28 days", capacity: "28.5kT/yr" },
    { id: "SUP-202", name: "CMOC Group (Tenke)", location: "Haut-Katanga, DRC", mineral: "Cobalt / Copper", esg_rating: "B-", delivery_time: "30 days", capacity: "106.8kT/yr" },
    
    // --- THE DOWNSTREAM BOTTLENECKS (Chinese Refining) ---
    { id: "SUP-301", name: "Huayou Cobalt Park", location: "Quzhou, China", mineral: "Refined Cobalt", esg_rating: "C+", delivery_time: "12 days", capacity: "45kT/yr" },
    
    // --- RARE EARTHS (Global Alternates to China) ---
    { id: "SUP-401", name: "Lynas Rare Earths", location: "Kuantan, Malaysia", mineral: "Separated REO", esg_rating: "A-", delivery_time: "10 days", capacity: "25kT/yr" },
    { id: "SUP-402", name: "MP Materials", location: "California, USA", mineral: "NdPr Magnets", esg_rating: "A", delivery_time: "24 days", capacity: "Emerging" },

    // --- INDIAN DOMESTIC CHAMPIONS (Crucial for the Adani Pitch) ---
    { id: "SUP-501", name: "Epsilon Advanced Materials", location: "Karnataka, India", mineral: "Battery Anode Graphite", esg_rating: "A", delivery_time: "3 days", capacity: "30kT/yr" },
    { id: "SUP-502", name: "Lohum Cleantech", location: "Uttar Pradesh, India", mineral: "Recycled Li / Co / Ni", esg_rating: "A+", delivery_time: "2 days", capacity: "Circular Ecosystem" },
    { id: "SUP-503", name: "Attero Recycling", location: "Uttarakhand, India", mineral: "Recycled Battery Metals", esg_rating: "A+", delivery_time: "3 days", capacity: "Circular Ecosystem" },
    { id: "SUP-504", name: "Khanij Bidesh India (KABIL)", location: "Overseas Assets (LatAm/AUS)", mineral: "Strategic Sovereign Assets", esg_rating: "A", delivery_time: "40+ days", capacity: "Sovereign Strategy" }
  ]
};