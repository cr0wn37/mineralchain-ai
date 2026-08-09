// src/hooks/useRiskAlerts.js
import { useState, useEffect, useCallback, useRef } from 'react';
import { mockData } from '../data/mockData';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export function useRiskAlerts(activeBatches = []) {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSyncingRAG, setIsSyncingRAG] = useState(false);

  // Stringify to compare actual content rather than array references
  const batchesJson = JSON.stringify(activeBatches);
  const hasFetched = useRef(false);

  const fetchAIRiskScan = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BACKEND_URL}/api/ai-risk-scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ batches: JSON.parse(batchesJson) })
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && Array.isArray(data.alerts)) {
        setAlerts(data.alerts);
      } else {
        setAlerts(mockData.alerts || []);
      }
    } catch (err) {
      console.warn('⚠️ Express backend offline or rate-limited, falling back to mockData:', err.message);
      setError('Backend Rate-Limited / Offline (Showing Baseline Data)');
      setAlerts(mockData.alerts || []);
    } finally {
      setLoading(false);
    }
  }, [batchesJson]);

  const syncRAGNews = async () => {
    setIsSyncingRAG(true);
    try {
      await fetch(`${BACKEND_URL}/api/sync-rag-news`, { method: 'POST' });
      await fetchAIRiskScan();
    } catch (err) {
      console.error('Failed to sync RSS feeds:', err);
    } finally {
      setIsSyncingRAG(false);
    }
  };

  // Only run ONCE on mount or when batches content actually changes
  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchAIRiskScan();
    }
  }, [fetchAIRiskScan]);

  return {
    alerts,
    loading,
    error,
    isSyncingRAG,
    refetchAlerts: fetchAIRiskScan,
    syncRAGNews
  };
}