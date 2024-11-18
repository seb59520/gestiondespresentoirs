import React, { useState } from 'react';
import { ArrowLeft, Plus, Star, AlertTriangle } from 'lucide-react';
import type { Poster, PosterInstance } from '../types';
import { PosterDetail } from './PosterDetail';
import { AssignPosterModal } from '../components/posters/AssignPosterModal';
import { CreatePosterModal } from '../components/posters/CreatePosterModal';

interface PosterManagementProps {
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

export const PosterManagement: React.FC<PosterManagementProps> = ({ onBack }) => {
  const [posters, setPosters] = useState<Poster[]>([]);
  const [selectedPoster, setSelectedPoster] = useState<Poster | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Charger les affiches depuis le localStorage
  React.useEffect(() => {
    const domain = JSON.parse(localStorage.getItem('domain') || '{}');
    setPosters(domain.posters || []);
  }, []);

  const handleCreatePoster = (newPoster: Poster) => {
    const updatedPosters = [...posters, newPoster];
    setPosters(updatedPosters);
    setShowCreateModal(false);

    // Mettre à jour le localStorage
    const domain = JSON.parse(localStorage.getItem('domain') || '{}');
    domain.posters = updatedPosters;
    localStorage.setItem('domain', JSON.stringify(domain));
  };

  const handleAssignPoster = (displayId: string, newInstance: PosterInstance) => {
    if (!selectedPoster) return;

    // Récupérer le domaine
    const domain = JSON.parse(localStorage.getItem('domain') || '{}');
    const displays = domain.displays || [];

    // Récupérer le présentoir
    const display = displays.find(d => d.id === displayId);
    if (!display) return;

    // Si le présentoir a déjà une affiche, incrémenter le stock de l'ancienne affiche
    if (display.currentPosterInstance) {
      const oldPoster = posters.find(p => p.id === display.currentPosterInstance?.posterId);
      if (oldPoster) {
        const updatedPosters = posters.map(p => {
          if (p.id === oldPoster.id) {
            return { ...p, stockQuantity: p.stockQuantity + 1 };
          }
          return p;
        });
        setPosters(updatedPosters);
        domain.posters = updatedPosters;
      }
    }

    // Décrémenter le stock de la nouvelle affiche
    const updatedPosters = posters.map(poster => {
      if (poster.id === selectedPoster.id) {
        return {
          ...poster,
          stockQuantity: poster.stockQuantity - 1,
          instances: [...poster.instances, newInstance]
        };
      }
      return poster;
    });
    setPosters(updatedPosters);

    // Mettre à jour le présentoir
    const updatedDisplays = displays.map(d => {
      if (d.id === displayId) {
        return { ...d, currentPosterInstance: newInstance };
      }
      return d;
    });

    // Mettre à jour le localStorage
    domain.posters = updatedPosters;
    domain.displays = updatedDisplays;
    localStorage.setItem('domain', JSON.stringify(domain));

    setShowAssignModal(false);
    setSelectedPoster(null);
  };

  if (selectedPoster) {
    return (
      <PosterDetail
        poster={selectedPoster}
        onBack={() => setSelectedPoster(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Retour au tableau de bord
          </button>
          <div className="flex space-x-4">
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle Affiche
            </button>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-6">Gestion des Affiches</h1>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posters.map((poster) => {
            const averageCondition = poster.instances.length > 0
              ? Math.round(poster.instances.reduce((sum, instance) => sum + instance.condition, 0) / poster.instances.length)
              : 5;

            return (
              <div
                key={`poster-${poster.id}`}
                onClick={() => setSelectedPoster(poster)}
                className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="aspect-w-3 aspect-h-4">
                  <img
                    src={poster.imageUrl}
                    alt={poster.title}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900">{poster.title}</h3>
                  
                  <div className="mt-2 flex items-center">
                    <span className="text-sm text-gray-500 mr-2">État moyen:</span>
                    <ConditionStars condition={averageCondition} />
                  </div>

                  <div className="mt-4 flex justify-between items-center">
                    <div>
                      <span className="text-sm text-gray-500">Stock:</span>
                      <span className="ml-1 font-medium text-gray-900">
                        {poster.stockQuantity}
                      </span>
                    </div>
                    {poster.stockQuantity <= poster.minStockQuantity && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Stock bas
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showCreateModal && (
        <CreatePosterModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreatePoster}
        />
      )}

      {showAssignModal && selectedPoster && (
        <AssignPosterModal
          poster={selectedPoster}
          displays={(JSON.parse(localStorage.getItem('domain') || '{}').displays || [])
            .filter(d => !d.currentPosterInstance || d.currentPosterInstance.posterId !== selectedPoster.id)}
          onAssign={handleAssignPoster}
          onClose={() => {
            setShowAssignModal(false);
            setSelectedPoster(null);
          }}
        />
      )}
    </div>
  );
};