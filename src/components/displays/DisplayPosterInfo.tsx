import React from 'react';
import { Star } from 'lucide-react';
import type { PosterInstance } from '../../types';

interface DisplayPosterInfoProps {
  posterInstance?: PosterInstance;
}

export const DisplayPosterInfo: React.FC<DisplayPosterInfoProps> = ({ posterInstance }) => {
  if (!posterInstance) {
    return <div className="text-gray-500">Aucune affiche</div>;
  }

  const domain = JSON.parse(localStorage.getItem('domain') || '{}');
  const poster = domain.posters?.find(p => p.id === posterInstance.posterId);

  return (
    <div className="space-y-3">
      <div className="flex items-start space-x-3">
        {poster?.imageUrl && (
          <img
            src={poster.imageUrl}
            alt={poster.title}
            className="h-16 w-12 object-cover rounded"
          />
        )}
        <div>
          <div className="font-medium text-gray-900">{poster?.title}</div>
          <div className="flex items-center mt-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={`star-${star}`}
                className={`w-4 h-4 ${
                  star <= posterInstance.condition
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {posterInstance.notes && (
        <div className="text-sm text-gray-600">
          Note: {posterInstance.notes}
        </div>
      )}
      <div className="text-sm text-gray-500">
        Mise à jour: {new Date(posterInstance.lastUpdate).toLocaleDateString()}
      </div>
    </div>
  );
};