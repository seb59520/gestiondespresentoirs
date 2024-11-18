import React from 'react';
import type { Display } from '../../types';

interface DisplayStatusBadgeProps {
  status: Display['status'];
  isPermanent?: boolean;
}

export const DisplayStatusBadge: React.FC<DisplayStatusBadgeProps> = ({ status, isPermanent }) => {
  return (
    <div className="flex items-center space-x-2">
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
        status === 'available' 
          ? 'bg-green-100 text-green-800'
          : status === 'reserved'
          ? 'bg-yellow-100 text-yellow-800'
          : 'bg-red-100 text-red-800'
      }`}>
        {status === 'available' ? 'Disponible' : 
         status === 'reserved' ? 'Réservé' : 'En maintenance'}
      </span>
      {status === 'reserved' && isPermanent && (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
          Prêt Permanent
        </span>
      )}
    </div>
  );
};