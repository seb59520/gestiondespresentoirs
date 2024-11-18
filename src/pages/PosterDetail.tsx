import React, { useState } from 'react';
import { Star, Package, MapPin, AlertTriangle, Users } from 'lucide-react';
import type { Poster, PosterInstance } from '../types';
import { AssignPosterModal } from '../components/posters/AssignPosterModal';

interface PosterDetailProps {
  poster: Poster;
  onBack: () => void;
}

const ConditionStars: React.FC<{ condition: number }> = ({ condition }) => {
  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={`star-${star}`}
          className={`w-4 h-4 ${
            star <= condition
              ? 'text-yellow-400 fill-current'
              : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );
};

export const PosterDetail: React.FC<PosterDetailProps> = ({ poster, onBack }) => {
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [currentPoster, setCurrentPoster] = useState(poster);
  const domain = JSON.parse(localStorage.getItem('domain') || '{}');
  const displays = domain.displays || [];

  const assignedDisplays = displays.filter(
    display => display.currentPosterInstance?.posterId === poster.id
  );

  const handleAssign = (displayId: string, instance: PosterInstance) => {
    // Mettre à jour le stock du poster
    const updatedPosters = (domain.posters || []).map(p => {
      if (p.id === poster.id) {
        return { ...p, stockQuantity: p.stockQuantity - 1 };
      }
      return p;
    });

    // Mettre à jour l'affiche sur le présentoir
    const updatedDisplays = displays.map(d => {
      if (d.id === displayId) {
        // Si le présentoir avait déjà une affiche, incrémenter le stock de l'ancienne
        if (d.currentPosterInstance) {
          const oldPoster = domain.posters.find(p => p.id === d.currentPosterInstance?.posterId);
          if (oldPoster) {
            updatedPosters.forEach(p => {
              if (p.id === oldPoster.id) {
                p.stockQuantity += 1;
              }
            });
          }
        }
        return { ...d, currentPosterInstance: instance };
      }
      return d;
    });

    // Mettre à jour le domaine
    domain.posters = updatedPosters;
    domain.displays = updatedDisplays;
    localStorage.setItem('domain', JSON.stringify(domain));

    // Mettre à jour l'état local
    setCurrentPoster(prev => ({
      ...prev,
      stockQuantity: prev.stockQuantity - 1,
      instances: [...prev.instances, instance]
    }));

    setShowAssignModal(false);
  };

  const averageCondition = currentPoster.instances.length > 0
    ? Math.round(currentPoster.instances.reduce((sum, instance) => sum + instance.condition, 0) / currentPoster.instances.length)
    : 5;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={onBack}
          className="mb-6 flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Retour à la liste
        </button>

        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0">
                <img
                  src={currentPoster.imageUrl}
                  alt={currentPoster.title}
                  className="w-48 h-64 object-cover rounded-lg"
                />
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{currentPoster.title}</h2>
                    <span className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {currentPoster.theme}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">État moyen</div>
                    <ConditionStars condition={averageCondition} />
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Stock</h3>
                    <div className="mt-2 flex items-center">
                      <Package className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-lg font-medium text-gray-900">
                        {currentPoster.stockQuantity} exemplaires
                      </span>
                    </div>
                    {currentPoster.stockQuantity <= currentPoster.minStockQuantity && (
                      <div className="mt-2 flex items-center text-red-600">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        <span className="text-sm">Stock bas</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Affectations</h3>
                    <div className="mt-2 flex items-center">
                      <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-lg font-medium text-gray-900">
                        {assignedDisplays.length} présentoir(s)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex space-x-4">
                  <button
                    onClick={() => setShowAssignModal(true)}
                    disabled={currentPoster.stockQuantity <= 0}
                    className={`flex-1 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                      currentPoster.stockQuantity > 0
                        ? 'bg-blue-600 hover:bg-blue-700'
                        : 'bg-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Affecter à un présentoir
                  </button>
                </div>
              </div>
            </div>

            {assignedDisplays.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Présentoirs associés
                </h3>
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {assignedDisplays.map(display => {
                    const instance = display.currentPosterInstance!;
                    return (
                      <div key={`display-${display.id}`} className="bg-gray-50 rounded-lg p-4">
                        <div className="font-medium text-gray-900">{display.name}</div>
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                          <Users className="h-4 w-4 mr-2" />
                          {display.responsibleName}
                        </div>
                        <div className="mt-2">
                          <div className="text-sm text-gray-500">État</div>
                          <ConditionStars condition={instance.condition} />
                        </div>
                        {instance.notes && (
                          <div className="mt-2 text-sm text-gray-600">
                            Note: {instance.notes}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showAssignModal && (
        <AssignPosterModal
          poster={currentPoster}
          displays={displays.filter(d => !d.currentPosterInstance || d.currentPosterInstance.posterId !== currentPoster.id)}
          onAssign={handleAssign}
          onClose={() => setShowAssignModal(false)}
        />
      )}
    </div>
  );
};