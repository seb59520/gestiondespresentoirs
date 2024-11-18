import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { Display, DisplayRequest } from '../../types';
import { useAtom } from 'jotai';
import { createDisplayRequestAtom } from '../../store/displayStore';

interface RequestFormProps {
  display: Display;
  type: DisplayRequest['type'];
  onClose: () => void;
  onSubmit?: (request: Partial<DisplayRequest>) => void;
}

export const RequestForm: React.FC<RequestFormProps> = ({
  display,
  type,
  onClose,
  onSubmit
}) => {
  const [description, setDescription] = useState('');
  const [selectedPosterId, setSelectedPosterId] = useState('');
  const [stockUpdates, setStockUpdates] = useState<Record<string, number>>({});
  const [issueType, setIssueType] = useState<'damage' | 'missing' | 'other'>('damage');
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high'>('low');
  const [, createDisplayRequest] = useAtom(createDisplayRequestAtom);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const request: Partial<DisplayRequest> = {
      displayId: display.id,
      type,
      status: 'pending',
      description,
      createdAt: new Date().toISOString(),
      details: {
        ...(type === 'poster_change' && { newPosterId: selectedPosterId }),
        ...(type === 'stock_update' && {
          stockUpdates: Object.entries(stockUpdates).map(([id, quantity]) => ({
            publicationId: id,
            quantity
          }))
        }),
        ...(type === 'issue_report' && {
          issueType,
          severity
        })
      }
    };

    await createDisplayRequest(request);

    if (onSubmit) {
      onSubmit(request);
    }

    onClose();
  };

  const domain = JSON.parse(localStorage.getItem('domain') || '{}');
  const posters = domain.posters || [];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {type === 'poster_change' ? 'Changer l\'affiche' :
           type === 'stock_update' ? 'Mettre à jour le stock' :
           'Signaler un problème'}
        </h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {type === 'poster_change' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nouvelle affiche
            </label>
            <select
              value={selectedPosterId}
              onChange={(e) => setSelectedPosterId(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300"
              required
            >
              <option value="">Sélectionner une affiche</option>
              {posters.map((poster) => (
                <option key={poster.id} value={poster.id}>
                  {poster.title}
                </option>
              ))}
            </select>
          </div>
        )}

        {type === 'stock_update' && display.publications?.map((pub) => (
          <div key={pub.id}>
            <label className="block text-sm font-medium text-gray-700">
              {pub.title}
            </label>
            <input
              type="number"
              value={stockUpdates[pub.id] || pub.quantity}
              onChange={(e) => setStockUpdates({
                ...stockUpdates,
                [pub.id]: parseInt(e.target.value) || 0
              })}
              className="mt-1 block w-full rounded-md border-gray-300"
              min="0"
            />
          </div>
        ))}

        {type === 'issue_report' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Type de problème
              </label>
              <select
                value={issueType}
                onChange={(e) => setIssueType(e.target.value as typeof issueType)}
                className="mt-1 block w-full rounded-md border-gray-300"
              >
                <option value="damage">Dommage</option>
                <option value="missing">Élément manquant</option>
                <option value="other">Autre</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Sévérité
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as typeof severity)}
                className="mt-1 block w-full rounded-md border-gray-300"
              >
                <option value="low">Faible</option>
                <option value="medium">Moyenne</option>
                <option value="high">Haute</option>
              </select>
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300"
            required
          />
        </div>

        <div className="flex justify-end space-x-3">
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
          >
            Envoyer
          </button>
        </div>
      </form>
    </div>
  );
};