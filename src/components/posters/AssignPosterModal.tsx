import React, { useState } from 'react';
import { Star, AlertTriangle } from 'lucide-react';
import type { Display, Poster, PosterInstance } from '../../types';

interface AssignPosterModalProps {
  poster: Poster;
  displays: Display[];
  onAssign: (displayId: string, instance: PosterInstance) => void;
  onClose: () => void;
}

const ConditionStars: React.FC<{ condition: number; onClick: (value: number) => void }> = ({ condition, onClick }) => {
  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={`star-${star}`}
          className={`w-4 h-4 cursor-pointer ${
            star <= condition
              ? 'text-yellow-400 fill-current'
              : 'text-gray-300'
          }`}
          onClick={() => onClick(star)}
        />
      ))}
    </div>
  );
};

export const AssignPosterModal: React.FC<AssignPosterModalProps> = ({
  poster,
  displays,
  onAssign,
  onClose,
}) => {
  const [selectedDisplay, setSelectedDisplay] = useState<string | null>(null);
  const [condition, setCondition] = useState<number>(5);
  const [notes, setNotes] = useState('');

  const handleAssign = () => {
    if (!selectedDisplay) return;

    // Vérifier si nous avons assez de stock
    if (poster.stockQuantity <= 0) {
      alert("Stock insuffisant pour cette affiche");
      return;
    }

    const newInstance: PosterInstance = {
      id: `${poster.id}-${Date.now()}`,
      posterId: poster.id,
      condition,
      displayId: selectedDisplay,
      notes,
      lastUpdate: new Date().toISOString(),
      domainId: poster.domainId
    };

    onAssign(selectedDisplay, newInstance);
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Affecter l'affiche "{poster.title}"
        </h3>

        {poster.stockQuantity <= 0 ? (
          <div className="mb-4 p-4 bg-red-50 rounded-md">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
              <p className="text-red-700">
                Stock insuffisant. Impossible d'affecter cette affiche.
              </p>
            </div>
          </div>
        ) : (
          <div className="mb-4 p-4 bg-blue-50 rounded-md">
            <p className="text-blue-700">
              Stock disponible: {poster.stockQuantity} exemplaire(s)
            </p>
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              État de l'exemplaire
            </label>
            <ConditionStars condition={condition} onClick={setCondition} />
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
              Notes sur l'état (optionnel)
            </label>
            <textarea
              id="notes"
              rows={3}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Observations sur l'état de l'exemplaire..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sélectionner un présentoir
            </label>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {displays.map(display => (
                <div
                  key={`display-${display.id}`}
                  onClick={() => setSelectedDisplay(display.id)}
                  className={`p-4 rounded-md cursor-pointer ${
                    selectedDisplay === display.id
                      ? 'bg-blue-50 border-2 border-blue-500'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="font-medium text-gray-900">{display.name}</div>
                  <div className="text-sm text-gray-500">
                    Responsable: {display.responsibleName}
                  </div>
                  {display.currentPosterInstance && (
                    <div className="mt-2 text-sm text-yellow-600">
                      Note: Le remplacement de l'affiche actuelle entraînera son retour en stock
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleAssign}
              disabled={!selectedDisplay || poster.stockQuantity <= 0}
              className={`flex-1 px-4 py-2 rounded-md ${
                selectedDisplay && poster.stockQuantity > 0
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Confirmer l'affectation
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};