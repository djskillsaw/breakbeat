import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchAllCharts, hasApiKey } from '../services/lastfm';
import { useLocalStorage } from './useLocalStorage';

const DEFAULT_INTERVAL = 300000; // 5 minutes

export function useChartData() {
  const [liveCharts, setLiveCharts] = useState({});
  const [lastUpdated, setLastUpdated] = useLocalStorage('bb-lastUpdated', null);
  const [previousRanks, setPreviousRanks] = useLocalStorage('bb-previousRanks', {});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [autoRefresh, setAutoRefresh] = useLocalStorage('bb-autoRefresh', true);
  const [interval, setInterval_] = useLocalStorage('bb-refreshInterval', DEFAULT_INTERVAL);
  const timerRef = useRef(null);

  const refresh = useCallback(async () => {
    if (!hasApiKey()) {
      setError('No Last.fm API key configured');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const charts = await fetchAllCharts(10);

      // Snapshot current ranks before updating
      const currentRanks = {};
      for (const [genre, tracks] of Object.entries(liveCharts)) {
        for (const track of tracks) {
          currentRanks[track.id] = track.rank;
        }
      }
      if (Object.keys(currentRanks).length > 0) {
        setPreviousRanks(currentRanks);
      }

      setLiveCharts(charts);
      setLastUpdated(new Date().toISOString());
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [liveCharts, setPreviousRanks, setLastUpdated]);

  // Initial fetch
  useEffect(() => {
    if (hasApiKey()) {
      refresh();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-polling
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (autoRefresh && hasApiKey()) {
      timerRef.current = setInterval(refresh, interval);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [autoRefresh, interval, refresh]);

  return {
    liveCharts,
    lastUpdated,
    previousRanks,
    isLoading,
    error,
    autoRefresh,
    refreshInterval: interval,
    refresh,
    setAutoRefresh,
    setRefreshInterval: setInterval_,
    hasKey: hasApiKey(),
  };
}
