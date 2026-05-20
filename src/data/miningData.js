// src/data/miningData.js

export const miningSites = [
  {
    id: "MIN-001",
    name: "Bailadila Iron Ore Mine (Dep-14)",
    operator: "NMDC Ltd",
    typeBadge: "PSU",
    mineral: "Iron Ore",
    status: "Active", 
    utilisation: 92, // High utilization makes the map circle larger
    coordinates: [18.6146, 81.2335], // Chhattisgarh
    production: {
      capacity: "12.0 MTPA",
      runOfMine: "32,000 Tonnes/Day",
      quality: "High Grade (+65% Fe)",
      currentSupply: "4,500 MT Available"
    },
    logistics: {
      nearest_railhead: "Kirandul, 8km",
      rail_coordinates: [18.6300, 81.2400],
      travel_time_rail: "45 mins", // <-- NEW
      nearest_port: "Vizag Port, 480km",
      port_coordinates: [17.6900, 83.2900],
      travel_time_port: "10 hrs", // <-- NEW
      estDelivery: "2-4 Days (via KK Line)"
    },
    compliance: {
      esg_score: "A",
      riskLevel: "LOW",
      riskFactor: "Stable operations, dedicated rail corridor active."
    }
  },
  {
    id: "MIN-002",
    name: "Salal-Haimana Lithium Block",
    operator: "Govt of India (GSI)",
    typeBadge: "Auction",
    mineral: "Lithium",
    status: "Exploration", 
    utilisation: 15, // Small circle
    coordinates: [33.0800, 74.8300], // J&K
    production: {
      capacity: "5.9M Tonnes (Inferred)",
      runOfMine: "0 Tonnes/Day",
      quality: "High Grade (~400 ppm Li)",
      currentSupply: "0 MT"
    },
    logistics: {
      nearest_railhead: "Katra Railway Station, 35km",
      rail_coordinates: [32.9800, 74.9300],
      travel_time_rail: "1 hr, 30 mins",
      nearest_port: "Kandla Port, 1100km",
      port_coordinates: [23.0300, 70.2100],
      travel_time_port: "26 hrs",
      estDelivery: "36-48 Months (Pre-extraction)"
    },
    compliance: {
      esg_score: "Pending",
      riskLevel: "HIGH",
      riskFactor: "Geopolitical & Ecological sensitivity in Himalayan region."
    }
  },
  {
    id: "MIN-003",
    name: "Malanjkhand Copper Project",
    operator: "Hindustan Copper Ltd",
    typeBadge: "PSU",
    mineral: "Copper",
    status: "Active",
    utilisation: 85,
    coordinates: [22.0000, 80.7100], // Madhya Pradesh
    production: {
      capacity: "2.5 MTPA",
      runOfMine: "6,500 Tonnes/Day",
      quality: "Grade 1.2% Cu",
      currentSupply: "450 MT Available"
    },
    logistics: {
      nearest_railhead: "Balaghat Junction, 90km",
      rail_coordinates: [21.8100, 80.1800],
      travel_time_rail: "2 hrs",
      nearest_port: "Mumbai Port, 950km",
      port_coordinates: [18.9400, 72.8300],
      travel_time_port: "16 hrs",
      estDelivery: "7-10 Days"
    },
    compliance: {
      esg_score: "B+",
      riskLevel: "MEDIUM",
      riskFactor: "Transitioning from open-cast to underground mining."
    }
  },
  {
    id: "MIN-004",
    name: "Panchpatmali Bauxite Mine",
    operator: "NALCO",
    typeBadge: "PSU",
    mineral: "Aluminum",
    status: "Active",
    utilisation: 98,
    coordinates: [18.8100, 83.0100], // Odisha
    production: {
      capacity: "6.8 MTPA",
      runOfMine: "18,600 Tonnes/Day",
      quality: "High Grade (45% Al2O3)",
      currentSupply: "1,200 MT Available"
    },
   logistics: {
      nearest_railhead: "Damanjodi, 15km",
      rail_coordinates: [18.8100, 82.8900],
      // NEW: Array of port options to feed into the Optimizer
      port_options: [
        {
          name: "Visakhapatnam Port",
          coordinates: [17.6900, 83.2900],
          nextShipmentHours: 24 // Close, but ship leaves tomorrow
        },
        {
          name: "Paradip Port",
          coordinates: [20.2600, 86.6700],
          nextShipmentHours: 4 // Further away, but ship leaves today!
        }
      ]
    },
    compliance: {
      esg_score: "A-",
      riskLevel: "LOW",
      riskFactor: "Heavy rainfall in Q3 occasionally affects open-cast extraction."
    }
  },
  {
    id: "MIN-005",
    name: "Khetri Copper Complex",
    operator: "Hindustan Copper Ltd",
    typeBadge: "PSU",
    mineral: "Copper",
    status: "Suspended",
    utilisation: 0,
    coordinates: [28.0000, 75.8000], // Rajasthan
    production: {
      capacity: "1.0 MTPA",
      runOfMine: "0 Tonnes/Day",
      quality: "Grade 0.9% Cu",
      currentSupply: "0 MT Available"
    },
    logistics: {
      nearest_railhead: "Nizampur, 10km",
      rail_coordinates: [27.9500, 75.9000],
      nearest_port: "Kandla Port, 750km",
      port_coordinates: [23.0300, 70.2100],
      estDelivery: "Suspended"
    },
    compliance: {
      esg_score: "C",
      riskLevel: "HIGH",
      riskFactor: "Operational halt due to severe water scarcity and pending environmental clearances."
    }
  },
  {
    id: "MIN-006",
    name: "Noamundi Iron Mine",
    operator: "Tata Steel Ltd",
    typeBadge: "Private",
    mineral: "Iron Ore",
    status: "Active", 
    utilisation: 95, 
    coordinates: [22.1500, 85.5300], // Jharkhand
    production: {
      capacity: "10.0 MTPA",
      runOfMine: "27,000 Tonnes/Day",
      quality: "High Grade (62% Fe)",
      currentSupply: "5,000 MT Available"
    },
    logistics: {
      nearest_railhead: "Noamundi Station, 5km",
      rail_coordinates: [22.1500, 85.5500],
      travel_time_rail: "24 mins",
      nearest_port: "Haldia Port, 350km",
      port_coordinates: [22.0200, 88.0600],
      travel_time_port: "7 hrs,30 mins",
      estDelivery: "1-2 Days (Captive Rail)"
    },
    compliance: {
      esg_score: "A+",
      riskLevel: "LOW",
      riskFactor: "Highly automated, low-risk captive mining operations."
    }
  },
  {
    id: "MIN-007",
    name: "Sivaganga Graphite Mine",
    operator: "Tamil Nadu Minerals Ltd (TAMIN)",
    typeBadge: "PSU",
    mineral: "Graphite",
    status: "Active",
    utilisation: 75,
    coordinates: [9.8433, 78.4809], // Tamil Nadu
    production: {
      capacity: "60,000 TPA",
      runOfMine: "150 Tonnes/Day",
      quality: "14% Fixed Carbon",
      currentSupply: "200 MT Available"
    },
    logistics: {
      nearest_railhead: "Sivaganga, 12km",
      rail_coordinates: [9.8400, 78.4900],
      travel_time_rail: "24 mins",
      nearest_port: "Tuticorin Port, 160km",
      port_coordinates: [8.7600, 78.1300],
      travel_time_port: "3 hrs,15 mins",
      estDelivery: "2-3 Days"
    },
    compliance: {
      esg_score: "B",
      riskLevel: "MEDIUM",
      riskFactor: "Occasional monsoon flooding risk in open-cast pits."
    }
  },
  {
    id: "MIN-008",
    name: "Baphlimali Bauxite Mine",
    operator: "Utkal Alumina (Hindalco)",
    typeBadge: "Private",
    mineral: "Aluminum",
    status: "Active",
    utilisation: 88,
    coordinates: [19.2300, 83.0200], // Rayagada, Odisha
    production: {
      capacity: "8.5 MTPA",
      runOfMine: "23,000 Tonnes/Day",
      quality: "Metallurgical Grade",
      currentSupply: "1,500 MT Available"
    },
    logistics: {
      nearest_railhead: "Tikiri, 20km",
      rail_coordinates: [19.2000, 83.1000],
      travel_time_rail: "1 hr, 20 mins",
      nearest_port: "Visakhapatnam Port, 200km",
      port_coordinates: [17.6900, 83.2900],
      travel_time_port: "7 hrs,35 mins",
      estDelivery: "3-4 Days"
    },
    compliance: {
      esg_score: "A",
      riskLevel: "LOW",
      riskFactor: "Stable operations with strong local community initiatives."
    }
  },
  {
    id: "MIN-009",
    name: "Sukinda Nickel Block",
    operator: "Odisha Mining Corp (OMC)",
    typeBadge: "PSU",
    mineral: "Nickel",
    status: "Exploration",
    utilisation: 20, // Low utilization for exploration
    coordinates: [21.0300, 85.8300], // Jajpur, Odisha
    production: {
      capacity: "TBD (Assessment Phase)",
      runOfMine: "0 Tonnes/Day",
      quality: "0.8% - 1.2% Ni Laterite",
      currentSupply: "0 MT"
    },
    logistics: {
      nearest_railhead: "Jajpur Keonjhar Road, 45km",
      rail_coordinates: [20.9500, 86.1300],
      travel_time_rail: "1 hr, 30 mins",
      nearest_port: "Paradip Port, 140km",
      port_coordinates: [20.2600, 86.6700],
      travel_time_port: "4 hrs,30 mins",
      estDelivery: "Pending Extraction Phase"
    },
    compliance: {
      esg_score: "Pending",
      riskLevel: "MEDIUM",
      riskFactor: "Awaiting advanced hydrometallurgical processing technology approval."
    }
  },
  {
    id: "MIN-010",
    name: "Surda Copper Mine",
    operator: "Hindustan Copper Ltd",
    typeBadge: "PSU",
    mineral: "Copper",
    status: "Suspended",
    utilisation: 0, // Suspended = 0 utilization (smallest dot)
    coordinates: [22.6100, 86.4300], // Ghatsila, Jharkhand
    production: {
      capacity: "0.4 MTPA",
      runOfMine: "0 Tonnes/Day",
      quality: "0.9% Cu",
      currentSupply: "0 MT Available"
    },
    logistics: {
      nearest_railhead: "Ghatsila, 10km",
      rail_coordinates: [22.5800, 86.4800],
      nearest_port: "Haldia Port, 220km",
      port_coordinates: [22.0200, 88.0600],
      estDelivery: "Suspended"
    },
    compliance: {
      esg_score: "C-",
      riskLevel: "HIGH",
      riskFactor: "Mining lease renewal pending; underground operations currently halted."
    }
  },
  {
    id: "INT-MIN-001",
    name: "KABIL Lithium Project (Cortadera-I Block)",
    operator: "Khanij Bidesh India Limited (KABIL)",
    typeBadge: "Strategic G2G",
    mineral: "Lithium",
    status: "Exploration", // Just received Environmental Clearance in April 2026!
    utilisation: 0, // Not in active production yet
    coordinates: [-26.8000, -67.5000], // Catamarca Province, Argentina
    production: {
      capacity: "15,703 Hectares (Total Block Size)",
      runOfMine: "Brine Exploration Stage",
      quality: "High-Density Lithium Brine",
      currentSupply: "0 MT (Targeting 2029 Extraction)"
    },
    logistics: {
      nearest_railhead: "Catamarca Freight Hub",
      // Trans-Andean route to Chilean Port for Pacific shipping to India
      nearest_port: "Port of Antofagasta (Chile) to Mundra Port (India)",
      port_coordinates: [-23.6500, -70.4000], // Port of Antofagasta lat/long
      estDelivery: "25-30 Days (Ocean Transit)",
      hs_code: "HS 28369100 (Lithium Carbonate)",
      trade_flow: "100% India Off-take Priority"
    },
    compliance: {
      esg_score: "A",
      riskLevel: "LOW",
      riskFactor: "Environmental clearance approved April 2026; deep exploration drilling underway."
    }
  }
];