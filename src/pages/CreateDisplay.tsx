import React, { useState } from 'react';
import { ArrowLeft, QrCode, Upload } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import type { Display } from '../types';
import { DisplayQRCode } from '../components/displays/DisplayQRCode';

interface CreateDisplayProps {
  onBack: () => void;
}

export const CreateDisplay: React.FC<CreateDisplayProps> = ({ onBack }) => {
  const [name, setName] = useState('');
  const [responsibleName, setResponsibleName] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [showQRCode, setShowQRCode] = useState(false);
  const [newDisplay, setNewDisplay] = useState<Display | null>(null);

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

    const domain = JSON.parse(localStorage.getItem('domain') || '{}');

    const display: Display = {
      id: `display-${Date.now()}`,
      name,
      status: 'available',
      responsibleName,
      currentStock: 0,
      lastMaintenance: new Date().toISOString(),
      nextMaintenance: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      domainId: domain.id,
      location,
      description,
      imageUrl,
      publications: []
    };

    // Mettre à jour le domaine avec le nouveau présentoir
    domain.displays = [...(domain.displays || []), display];
    localStorage.setItem('domain', JSON.stringify(domain));

    setNewDisplay(display);
    setShowQRCode(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Retour à la liste
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Nouveau Présentoir</h1>
        </div>

        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Photo du présentoir
                </label>
                <div className="mt-1">
                  {imageUrl ? (
                    <div className="relative">
                      <img
                        src={imageUrl}
                        alt="Aperçu"
                        className="h-48 w-full object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => setImageUrl('')}
                        className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm"
                      >
                        ×
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
                          <p className="pl-1">Glissez une photo ou cliquez pour sélectionner</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nom du présentoir
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Responsable
                  </label>
                  <input
                    type="text"
                    value={responsibleName}
                    onChange={(e) => setResponsibleName(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Emplacement
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Description détaillée du présentoir..."
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onBack}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Créer le présentoir
              </button>
            </div>
          </form>
        </div>

        {showQRCode && newDisplay && (
          <div className="mt-6 bg-white shadow-sm rounded-lg overflow-hidden p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">QR Code du présentoir</h2>
              <div className="flex items-center text-sm text-gray-500">
                <QrCode className="w-4 h-4 mr-1" />
                Scanner pour accéder à la page publique
              </div>
            </div>
            <DisplayQRCode displayId={newDisplay.id} displayName={newDisplay.name} />
          </div>
        )}
      </div>
    </div>
  );
};