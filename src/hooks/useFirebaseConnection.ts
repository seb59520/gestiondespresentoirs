import { useState, useEffect, useCallback } from 'react';
import { db } from '../utils/firebase';
import { enableNetwork, disableNetwork } from 'firebase/firestore';
import retry from 'retry';

export const useFirebaseConnection = () => {
  const [isConnected, setIsConnected] = useState(true);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [lastError, setLastError] = useState<Error | null>(null);

  const connect = useCallback(async () => {
    if (isReconnecting) return;
    
    setIsReconnecting(true);
    const operation = retry.operation({
      retries: 5,
      factor: 2,
      minTimeout: 1000,
      maxTimeout: 10000,
    });

    return new Promise((resolve, reject) => {
      operation.attempt(async (currentAttempt) => {
        try {
          console.log(`Attempting to connect to Firestore (attempt ${currentAttempt})...`);
          await enableNetwork(db);
          setIsConnected(true);
          setLastError(null);
          resolve(true);
        } catch (error) {
          console.error(`Connection attempt ${currentAttempt} failed:`, error);
          setLastError(error as Error);
          
          if (operation.retry(error as Error)) {
            return;
          }
          
          reject(operation.mainError());
        } finally {
          setIsReconnecting(false);
        }
      });
    });
  }, [isReconnecting]);

  const disconnect = useCallback(async () => {
    try {
      await disableNetwork(db);
      setIsConnected(false);
    } catch (error) {
      console.error('Failed to disconnect from Firestore:', error);
      setLastError(error as Error);
    }
  }, []);

  useEffect(() => {
    const handleOnline = () => {
      connect();
    };

    const handleOffline = () => {
      disconnect();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial connection
    if (navigator.onLine && !isConnected) {
      connect();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [connect, disconnect, isConnected]);

  return {
    isConnected,
    isReconnecting,
    lastError,
    connect,
    disconnect
  };
};