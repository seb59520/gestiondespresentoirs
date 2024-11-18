import React, { useState } from 'react';
import { ArrowLeft, Plus, Search } from 'lucide-react';
import { AddPublicationModal } from '../components/publications/AddPublicationModal';
import type { Publication } from '../types';

interface PublicationsLibraryProps {
  onBack: () => void;
}

export const PublicationsLibrary: React.FC<PublicationsLibraryProps> = ({ onBack }) => {
  const domain = JSON.parse(localStorage.getItem('domain') || '{}');
  const [publications, setPublications] = useState<Publication[]>(domain.publications || []);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPublications = publications.filter(pub => 
    pub.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddPublication = (newPublication: Publication) => {
    const updatedPublications = [...publications, newPublication];
    setPublications(updatedPublications);

    // Mettre à jour le domaine
    const updatedDomain = {
      ...domain,
      publications: updatedPublications
    };
    localStorage.setItem('domain', JSON.stringify(updatedDomain));
  };

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
          <h1 className="text-2xl font-bold text-gray-900">Bibliothèque de Publications</h1>
        </div>

        <div className="mb-6 flex justify-between items-center">
          <div className="relative flex-1 max-w-lg">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Rechercher une publication..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="ml-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle Publication
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredPublications.map((publication) => (
            <div
              key={publication.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <img
                src={publication.imageUrl}
                alt={publication.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900">{publication.title}</h3>
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    Stock: {publication.quantity}
                  </span>
                  {publication.quantity <= publication.minQuantity && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Stock bas
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {publications.length === 0 && !searchQuery && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Aucune publication dans la bibliothèque</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter une publication
            </button>
          </div>
        )}

        {showAddModal && (
          <AddPublicationModal
            onClose={() => setShowAddModal(false)}
            onAdd={handleAddPublication}
          />
        )}
      </div>
    </div>
  );
};