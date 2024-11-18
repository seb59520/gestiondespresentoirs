import React, { useState } from 'react';
import { AlertTriangle, Plus } from 'lucide-react';
import type { Publication } from '../../types';
import { AddPublicationModal } from '../publications/AddPublicationModal';

interface DisplayPublicationsProps {
  publications: Publication[];
  onAddPublication: (publication: Publication) => void;
}

export const DisplayPublications: React.FC<DisplayPublicationsProps> = ({ 
  publications,
  onAddPublication
}) => {
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Publications associées</h3>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Ajouter une publication
        </button>
      </div>

      {publications.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Aucune publication associée</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-4 inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter une publication
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {publications.map((publication) => (
            <div key={publication.id} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-start space-x-4">
                <img
                  src={publication.imageUrl}
                  alt={publication.title}
                  className="h-20 w-16 object-cover rounded"
                />
                <div>
                  <h4 className="text-sm font-medium text-gray-900">
                    {publication.title}
                  </h4>
                  <p className="mt-1 text-sm text-gray-500">
                    Stock: {publication.quantity}
                  </p>
                  {publication.quantity <= publication.minQuantity && (
                    <div className="mt-1 flex items-center text-red-600 text-sm">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      Stock bas
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddModal && (
        <AddPublicationModal
          onClose={() => setShowAddModal(false)}
          onAdd={onAddPublication}
        />
      )}
    </div>
  );
};