import React from 'react';
import { Wifi, WifiOff, Cloud, CloudOff, Loader, RefreshCw } from 'lucide-react';
import { useFirebaseConnection } from '../hooks/useFirebaseConnection';

export const NetworkStatus: React.FC = () => {
  const { isConnected, isReconnecting, lastError, connect } = useFirebaseConnection();
  const isOnline = navigator.onLine;

  return (
    <>
      <div className="fixed top-0 right-0 m-4 flex items-center space-x-2">
        <div className={`flex items-center px-3 py-1 rounded-full text-sm ${
          isOnline 
            ? 'bg-green-100 text-green-800' 
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {isOnline ? (
            <>
              <Wifi className="w-4 h-4 mr-1" />
              <span>En ligne</span>
            </>
          ) : (
            <>
              <WifiOff className="w-4 h-4 mr-1" />
              <span>Hors ligne</span>
            </>
          )}
        </div>
        
        {isOnline && (
          <div className={`flex items-center px-3 py-1 rounded-full text-sm ${
            isReconnecting
              ? 'bg-blue-100 text-blue-800'
              : isConnected
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {isReconnecting ? (
              <>
                <Loader className="w-4 h-4 mr-1 animate-spin" />
                <span>Reconnexion...</span>
              </>
            ) : isConnected ? (
              <>
                <Cloud className="w-4 h-4 mr-1" />
                <span>Firebase connecté</span>
              </>
            ) : (
              <>
                <CloudOff className="w-4 h-4 mr-1" />
                <span>Firebase déconnecté</span>
              </>
            )}
          </div>
        )}
      </div>

      {(!isConnected || lastError) && (
        <div className="fixed bottom-4 right-4 max-w-md">
          <div className={`rounded-lg shadow-lg p-4 ${
            lastError ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
          }`}>
            <div className="flex items-start">
              {lastError ? (
                <CloudOff className="w-5 h-5 mr-2 mt-0.5" />
              ) : (
                <WifiOff className="w-5 h-5 mr-2 mt-0.5" />
              )}
              <div className="flex-1">
                <p className="font-medium">
                  {lastError
                    ? 'Erreur de connexion à Firebase'
                    : 'Mode hors ligne'}
                </p>
                <p className="text-sm mt-1">
                  {lastError
                    ? lastError.message
                    : 'Les modifications seront synchronisées une fois la connexion rétablie'}
                </p>
                {lastError && (
                  <button
                    onClick={() => connect()}
                    disabled={isReconnecting}
                    className="mt-2 flex items-center px-3 py-1 bg-red-200 hover:bg-red-300 rounded text-sm font-medium"
                  >
                    <RefreshCw className={`w-4 h-4 mr-1 ${isReconnecting ? 'animate-spin' : ''}`} />
                    Réessayer
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};