**🚀 MineralChain AI**
Real-Time Risk Intelligence, Batch Traceability & ESG Compliance Platform for Critical Minerals.

MineralChain AI is an enterprise SaaS platform designed to monitor, track, and secure critical mineral supply chains (Lithium, Cobalt, Copper, Nickel, Neodymium, Graphite, REEs) against global disruptions.

**✨ Key Features**

1)🤖 AI Risk Intelligence (Agentic RAG): Scans real-time global RSS news using Groq Llama 3 to predict transit delays, estimate financial impacts (in Lakhs/USD), generate simulated WhatsApp alerts, and enable 1-click alternative supplier rerouting.
2)📦 Batch Traceability: Full chain-of-custody tracking from mine origin (Atacama, Kolwezi) to domestic ports (Mundra, Chennai), complete with live telemetry and digital origin certificates.
3)🏢 Supplier Directory: Vetted global supplier database featuring dynamic risk filtering, ESG reliability scores, and alternative backup recommendations.
4)🗺️ Interactive Asset Map: Visualizes global maritime sourcing corridors and domestic refining/processing operations in real time.
5)🌿 ESG & Regulatory Compliance: Scope 1–3 carbon footprint tracking, OECD conflict-free due diligence auditing, and regional environmental risk scoring.
6)📈 Live Spot Price Index: Live spot prices for 7 critical minerals powered by Metalprice API with automatic fallback protection.

**🧠 AI Architecture & Concepts**
MineralChain AI runs a $0-cost, privacy-compliant Agentic RAG pipeline:

[ RSS News Feeds ] ──► [ Local Transformer (384D) ] ──► [ Supabase pgvector ]

[ Active Batches ] ────────────────────────────────────────────────► [ Cosine Search ]

[ React Dashboard ] ◄── [ Structured JSON ] ◄── [ Groq Llama 3 ]

•Retrieval-Augmented Generation (RAG): Prevents hallucinations by injecting real-time vector search results into LLM prompts.
•384D Vector Embeddings: Uses Xenova/all-MiniLM-L6-v2 to enable semantic matching (e.g., matching "dockworker strike" with "port delay").
•Local Inference: Runs open-source BERT transformers directly inside Node.js via ONNX Runtime at $0 API cost.
•Vector Search (pgvector): Uses PostgreSQL Cosine Similarity (match_news) to retrieve the top 5 relevant news items.
•Structured Output Agent: Forces Llama 3 to return validated JSON schemas (json_object) with low temperature ($0.2$).
•Rate-Limit Resiliency: 3-minute backend TTL memory caching prevents API rate limits and handles offline fallbacks gracefully.

**🛠️ Tech Stack**

Frontend: React, Vite, Tailwind CSS, Lucide Icons, React Router

Backend: Node.js, Express, CORS

AI & Database: Groq SDK (llama-3.1-8b-instant), @xenova/transformers, Supabase (pgvector)

**📡 API Reference**

POST /api/ai-risk-scan — Runs vector similarity search and triggers Groq Llama 3 risk analysis.

POST /api/sync-rag-news — Fetches global RSS news, generates local embeddings, and pushes to Supabase.