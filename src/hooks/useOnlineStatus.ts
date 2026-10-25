import { useEffect, useState, useCallback } from 'react';

export function useOnlineStatus() {
  const [browserOnline, setBrowserOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [isSimulatedOffline, setIsSimulatedOffline] = useState<boolean>(false);

  useEffect(() => {
    const handleOnline = () => setBrowserOnline(true);
    const handleOffline = () => setBrowserOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const toggleSimulateOffline = useCallback(() => {
    setIsSimulatedOffline(prev => !prev);
  }, []);

  const setSimulated = useCallback((val: boolean) => {
    setIsSimulatedOffline(val);
  }, []);

  // Effective online status: false if browser is offline OR if manually simulated offline
  const isOnline = browserOnline && !isSimulatedOffline;

  return {
    isOnline,
    browserOnline,
    isSimulatedOffline,
    toggleSimulateOffline,
    setSimulated,
  };
}
