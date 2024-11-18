import React from 'react';
import { Plus, X } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import type { Poster } from '../../types';

interface PosterSetupProps {
  posters: Partial<Poster>[];
  onPostersChange: (posters: Partial<Poster>[]) => void;
}

export const PosterSetup: React.FC<PosterSetupProps> = ({ posters, onPostersChange }) => {
  const addPoster = () => {
    onPostersChange([...posters, {
      title: '',
      stockQuantity: 0,
      minStockQuantity: 0,
      instances: []
    }]);
  };

  const removePoster = (index: number) => {
    const newPosters = [...posters];
    newPosters.splice(index, 1);
    onPostersChange(newPosters);
  };

  const updatePoster = (index: number, updates: Partial<Poster>) => {
    const newPosters = [...posters];
    newPosters[index] = { ...newPosters[index], ...updates };
    onPostersChange(newPosters);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-medium text-gray-900">Modèles d'affiches</h2>
          <p className="mt-1 text-sm text-gray-500">
            Commencez par créer vos modèles d'affiches et définir leur stock initial
          </p>
        </div>
        <button
          type="button"
          onClick={addPoster}
          className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Ajouter une affiche
        </button>
      </div>

      <div className="space-y-6">
        {posters.map((poster, index) => (
          <div key={index} className="relative bg-gray-50 rounded-lg p-6">
            <button
              onClick={() => removePoster(index)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Image de l'affiche
                </label>
                <PosterImageUpload
                  onImageUpload={(imageUrl) => updatePoster(index, { imageUrl })}
                  currentImage={poster.imageUrl}
                />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Titre
                  </label>
                  <input
                    type="text"
                    value={poster.title}
                    onChange={(e) => updatePoster(index, { title: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Stock initial
                  </label>
                  <input
                    type="number"
                    value={poster.stockQuantity}
                    onChange={(e) => updatePoster(index, { stockQuantity: parseInt(e.target.value) })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Stock minimum
                  </label>
                  <input
                    type="number"
                    value={poster.minStockQuantity}
                    onChange={(e) => updatePoster(index, { minStockQuantity: parseInt(e.target.value) })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                    min="0"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        {posters.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Aucune affiche ajoutée</p>
            <button
              type="button"
              onClick={addPoster}
              className="mt-4 inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter une affiche
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

interface PosterImageUploadProps {
  onImageUpload: (imageUrl: string) => void;
  currentImage?: string;
}

const PosterImageUpload: React.FC<PosterImageUploadProps> = ({ onImageUpload, currentImage }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    onDrop: (acceptedFiles) => {
      // En production, ceci enverrait le fichier à un serveur
      // Pour la démo, on crée une URL locale
      const file = acceptedFiles[0];
      const imageUrl = URL.createObjectURL(file);
      onImageUpload(imageUrl);
    }
  });

  return (
    <div className="mt-1">
      {currentImage ? (
        <div className="relative">
          <img
            src={currentImage}
            alt="Aperçu"
            className="h-48 w-36 object-cover rounded-lg"
          />
          <button
            onClick={() => onImageUpload('')}
            className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md ${
            isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
          }`}
        >
          <div className="space-y-1 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="flex text-sm text-gray-600">
              <input {...getInputProps()} />
              <p className="pl-1">Glissez une image ou cliquez pour sélectionner</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};