import React from 'react';
import { AlertTriangle } from 'lucide-react';
import type { Publication } from '../../types';

interface DisplayStockInfoProps {
  publications: Publication[];
}

export const DisplayStockInfo: React.FC<DisplayStockInfoProps> = ({ publications }) => {
  if (publications.length === 0) {
    return <div className="text-gray-500">Aucune publication en stock</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {publications.map((publication) => (
        <div key={publication.id} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50">
          <div className="w-12 h-16 flex-shrink-0 overflow-hidden rounded">
            <img
              src={publication.imageUrl}
              alt={publication.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="font-medium text-gray-900">{publication.title}</div>
            <div className="text-sm text-gray-500">
              Quantité: {publication.quantity}
            </div>
            {publication.quantity <= publication.minQuantity && (
              <div className="flex items-center text-red-600 text-sm mt-1">
                <AlertTriangle className="h-4 w-4 mr-1" />
                Stock bas
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};