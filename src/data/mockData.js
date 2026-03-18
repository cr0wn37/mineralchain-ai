export const mockData = {
  // 10 Batches for the Active Batches Table
  batches: [
    { id: "BT-4091", mineral: "Lithium", supplier: "Gujarat Mineral Dev Corp", quantity: "500kg", eta: "2026-03-28", status: "Delayed", esg_grade: "B+", purity: "99.5%" },
    { id: "BT-5022", mineral: "Cobalt", supplier: "Vedanta Resources", quantity: "200kg", eta: "2026-04-05", status: "At-Risk", esg_grade: "C", purity: "98.2%" },
    { id: "BT-6033", mineral: "Graphite", supplier: "NMDC Limited", quantity: "1200kg", eta: "2026-03-20", status: "On-Track", esg_grade: "A", purity: "99.9%" },
    { id: "BT-7044", mineral: "Nickel", supplier: "Hindalco Industries", quantity: "800kg", eta: "2026-03-22", status: "On-Track", esg_grade: "B", purity: "99.1%" },
    { id: "BT-8055", mineral: "Rare Earths", supplier: "Indian Rare Earths Ltd", quantity: "50kg", eta: "2026-04-12", status: "At-Risk", esg_grade: "A-", purity: "99.99%" },
    { id: "BT-9066", mineral: "Lithium", supplier: "Pilbara Minerals (AUS)", quantity: "450kg", eta: "2026-03-25", status: "Delayed", esg_grade: "B", purity: "99.3%" },
    { id: "BT-1077", mineral: "Cobalt", supplier: "Hindustan Zinc", quantity: "300kg", eta: "2026-04-02", status: "On-Track", esg_grade: "B+", purity: "98.5%" },
    { id: "BT-2088", mineral: "Graphite", supplier: "Epsilon Advanced", quantity: "600kg", eta: "2026-03-18", status: "On-Track", esg_grade: "A", purity: "99.8%" },
    { id: "BT-3099", mineral: "Nickel", supplier: "JSW Steel", quantity: "1000kg", eta: "2026-04-10", status: "At-Risk", esg_grade: "C+", purity: "99.0%" },
    { id: "BT-4011", mineral: "Lithium", supplier: "Tata Chemicals", quantity: "700kg", eta: "2026-03-30", status: "On-Track", esg_grade: "A-", purity: "99.6%" }
  ],
  // 8 Alerts for the Risk Feed
  alerts: [
    { id: "ALT-001", severity: "High", mineral: "Cobalt", cause: "Unrest in Congo delaying Chennai port arrivals", action: "Find alternative supplier", affected_batches: ["BT-5022"] },
    { id: "ALT-002", severity: "Medium", mineral: "Lithium", cause: "Port congestion at Mundra, Gujarat", action: "Redirect to Hazira Port", affected_batches: ["BT-4091", "BT-9066"] },
    { id: "ALT-003", severity: "High", mineral: "Nickel", cause: "Indonesia export ban threatening Pune EV assembly", action: "Increase domestic safety stock", affected_batches: ["BT-3099"] },
    { id: "ALT-004", severity: "Low", mineral: "Graphite", cause: "Heavy rains in Mozambique affecting transport", action: "Monitor ETA closely", affected_batches: ["BT-6033"] },
    { id: "ALT-005", severity: "Medium", mineral: "Rare Earths", cause: "Supply chain bottleneck in Malaysia processing", action: "Contact secondary refiner", affected_batches: ["BT-8055"] },
    { id: "ALT-006", severity: "High", mineral: "Lithium", cause: "Labor strike at Antofagasta (Chile) plant", action: "Source from domestic recycler", affected_batches: ["BT-9066"] },
    { id: "ALT-007", severity: "Medium", mineral: "Cobalt", cause: "New ESG audit requirement for EU export", action: "Request purity certificates", affected_batches: ["BT-1077"] },
    { id: "ALT-008", severity: "Low", mineral: "Nickel", cause: "INR currency fluctuation affecting spot price", action: "Review hedging strategy", affected_batches: ["BT-7044"] }
  ],
  // 12 Suppliers for the Directory
  suppliers: [
    { id: "SUP-101", name: "NMDC India", state: "Chhattisgarh", mineral: "Lithium/Iron", esg_rating: "A", delivery_time: "5 days", capacity: "High" },
    { id: "SUP-102", name: "Vedanta Ltd", state: "Rajasthan", mineral: "Zinc/Cobalt", esg_rating: "B+", delivery_time: "7 days", capacity: "Medium" },
    { id: "SUP-103", name: "GSI Exploration", state: "Jammu & Kashmir", mineral: "Lithium", esg_rating: "A-", delivery_time: "14 days", capacity: "Emerging" },
    { id: "SUP-104", name: "Epsilon Advanced", state: "Karnataka", mineral: "Graphite", esg_rating: "A", delivery_time: "3 days", capacity: "High" },
    { id: "SUP-105", name: "Hindustan Copper", state: "Madhya Pradesh", mineral: "Nickel/Copper", esg_rating: "B", delivery_time: "6 days", capacity: "Medium" },
    { id: "SUP-106", name: "MECL India", state: "Odisha", mineral: "Rare Earths", esg_rating: "B+", delivery_time: "10 days", capacity: "Low" },
    { id: "SUP-107", name: "Tata Steel Mining", state: "Odisha", mineral: "Nickel", esg_rating: "A", delivery_time: "4 days", capacity: "High" },
    { id: "SUP-108", name: "Ashapura Minechem", state: "Gujarat", mineral: "Bentonite/Lithium", esg_rating: "B", delivery_time: "8 days", capacity: "Medium" },
    { id: "SUP-109", name: "Lohum Cleantech", state: "Uttar Pradesh", mineral: "Recycled Lithium", esg_rating: "A+", delivery_time: "2 days", capacity: "Medium" },
    { id: "SUP-110", name: "Attero Recycling", state: "Haryana", mineral: "Recycled Cobalt", esg_rating: "A+", delivery_time: "3 days", capacity: "Medium" },
    { id: "SUP-111", name: "MOIL Ltd", state: "Maharashtra", mineral: "Manganese", esg_rating: "B+", delivery_time: "5 days", capacity: "High" },
    { id: "SUP-112", name: "Khanij Bidesh India", state: "International/India", mineral: "Strategic Assets", esg_rating: "A", delivery_time: "20 days", capacity: "Strategic" }
  ]
};