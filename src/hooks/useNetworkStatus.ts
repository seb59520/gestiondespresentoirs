import { useState, useEffect } from 'react';
import { goOnline, goOffline } from '../utils/firestore';

export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [firestoreConnected, setFirestoreConnected] = useState(true);
  const [isReconnecting, setIsReconnecting] = useState(false);

  useEffect(() => {
    let reconnectTimeout: NodeJS.Timeout;

    const handleOnline = async () => {
      setIsOnline(true);
      setIsReconnecting(true);
      try {
        await goOnline();
        setFirestoreConnected(true);
      } catch (error) {
        console.error('Error reconnecting to Firestore:', error);
        setFirestoreConnected(false);
      } finally {
        setIsReconnecting(false);
      }
    };

    const handleOffline = async () => {
      setIsOnline(false);
      try {
        await goOffline();
        setFirestoreConnected(false);
      } catch (error) {
        console.error('Error handling offline state:', error);
      }
    };

    const handleFirestoreConnection = (event: CustomEvent) => {
      setFirestoreConnected(event.detail.isConnected);
    };

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('firestoreConnectionChange', handleFirestoreConnection as EventListener);

    // Implement automatic reconnection
    const attemptReconnect = async () => {
      if (isOnline && !firestoreConnected && !isReconnecting) {
        setIsReconnecting(true);
        try {
          await goOnline();
          setFirestoreConnected(true);
        } catch (error) {
          console.error('Reconnection attempt failed:', error);
          // Schedule next retry
          reconnectTimeout = setTimeout(attemptReconnect, 5000);
        } finally {
          setIsReconnecting(false);
        }
      }
    };

    // Start reconnection attempts if needed
    if (isOnline && !firestoreConnected) {
      attemptReconnect();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('firestoreConnectionChange', handleFirestoreConnection as EventListener);
      clearTimeout(reconnectTimeout);
    };
  }, [isOnline, firestoreConnected, isReconnecting]);

  return { 
    isOnline, 
    firestoreConnected,
    isReconnecting 
  };
};