import React, { useState } from 'react';
import { X, Upload } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import type { Publication } from '../../types';

interface AddPublicationModalProps {
  onClose: () => void;
  onAdd: (publication: Publication) => void;
}

export const AddPublicationModal: React.FC<AddPublicationModalProps> = ({ onClose, onAdd }) => {
  const [title, setTitle] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [minQuantity, setMinQuantity] = useState(0);
  const [imageUrl, setImageUrl] = useState('');

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      setImageUrl(URL.createObjectURL(file));
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newPublication: Publication = {
      id: `pub-${Date.now()}`,
      title,
      quantity,
      minQuantity,
      imageUrl,
      domainId: JSON.parse(localStorage.getItem('domain') || '{}').id
    };

    onAdd(newPublication);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Ajouter une publication
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Image de couverture
            </label>
            <div className="mt-1">
              {imageUrl ? (
                <div className="relative">
                  <img
                    src={imageUrl}
                    alt="Aperçu"
                    className="h-48 w-36 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setImageUrl('')}
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
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <input {...getInputProps()} />
                      <p className="pl-1">Glissez une image ou cliquez pour sélectionner</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Titre
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Quantité initiale
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
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
              value={minQuantity}
              onChange={(e) => setMinQuantity(parseInt(e.target.value) || 0)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
              min="0"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              disabled={!imageUrl || !title}
            >
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};