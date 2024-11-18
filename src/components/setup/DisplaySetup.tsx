import React from 'react';
import { Plus, X, User } from 'lucide-react';
import type { Display, Poster, Publication } from '../../types';

interface DisplaySetupProps {
  displays: Partial<Display>[];
  onDisplaysChange: (displays: Partial<Display>[]) => void;
  posters: Poster[];
  publications: Publication[];
}

export const DisplaySetup: React.FC<DisplaySetupProps> = ({
  displays,
  onDisplaysChange,
  posters,
  publications
}) => {
  const addDisplay = () => {
    onDisplaysChange([...displays, {
      name: '',
      status: 'available',
      responsibleName: '',
      currentStock: 0,
      lastMaintenance: new Date().toISOString().split('T')[0],
      nextMaintenance: new Date().toISOString().split('T')[0],
      publications: []
    }]);
  };

  const removeDisplay = (index: number) => {
    const newDisplays = [...displays];
    newDisplays.splice(index, 1);
    onDisplaysChange(newDisplays);
  };

  const updateDisplay = (index: number, updates: Partial<Display>) => {
    const newDisplays = [...displays];
    newDisplays[index] = { ...newDisplays[index], ...updates };
    onDisplaysChange(newDisplays);
  };

  const togglePublication = (displayIndex: number, publication: Publication) => {
    const display = displays[displayIndex];
    const currentPublications = display.publications || [];
    const isSelected = currentPublications.some(p => p.id === publication.id);

    let newPublications;
    if (isSelected) {
      newPublications = currentPublications.filter(p => p.id !== publication.id);
    } else {
      newPublications = [...currentPublications, publication];
    }

    updateDisplay(displayIndex, { publications: newPublications });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-medium text-gray-900">Présentoirs</h2>
          <p className="mt-1 text-sm text-gray-500">
            Configurez vos présentoirs et associez-leur des publications
          </p>
        </div>
        <button
          type="button"
          onClick={addDisplay}
          className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un présentoir
        </button>
      </div>

      <div className="space-y-6">
        {displays.map((display, index) => (
          <div key={`display-${index}`} className="relative bg-gray-50 rounded-lg p-6">
            <button
              onClick={() => removeDisplay(index)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nom du présentoir
                  </label>
                  <input
                    type="text"
                    value={display.name}
                    onChange={(e) => updateDisplay(index, { name: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Responsable
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={display.responsibleName}
                      onChange={(e) => updateDisplay(index, { responsibleName: e.target.value })}
                      className="block w-full pl-10 rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Nom du responsable"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Publications associées
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {publications.map((publication) => {
                    const isSelected = display.publications?.some(p => p.id === publication.id);
                    return (
                      <div
                        key={`display-${index}-pub-${publication.id}`}
                        onClick={() => togglePublication(index, publication)}
                        className={`flex items-center p-4 rounded-lg cursor-pointer border-2 ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex-shrink-0">
                          <img
                            src={publication.imageUrl}
                            alt={publication.title}
                            className="h-16 w-12 object-cover rounded"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {publication.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            Stock: {publication.quantity}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {posters.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Affiche associée
                  </label>
                  <select
                    value={display.currentPosterInstance?.posterId || ''}
                    onChange={(e) => {
                      const posterId = e.target.value;
                      if (posterId) {
                        updateDisplay(index, {
                          currentPosterInstance: {
                            id: `${posterId}-${Date.now()}`,
                            posterId,
                            condition: 5,
                            lastUpdate: new Date().toISOString()
                          }
                        });
                      } else {
                        updateDisplay(index, { currentPosterInstance: undefined });
                      }
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Sélectionner une affiche</option>
                    {posters.map((poster) => (
                      <option key={`display-${index}-poster-${poster.id}`} value={poster.id}>
                        {poster.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        ))}

        {displays.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Aucun présentoir ajouté</p>
            <button
              type="button"
              onClick={addDisplay}
              className="mt-4 inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un présentoir
            </button>
          </div>
        )}
      </div>
    </div>
  );
};