import React, { useState } from 'react';
import { ArrowLeft, Plus, Minus } from 'lucide-react';
import type { Publication } from '../../types';

interface StockManagementProps {
  displayId: string;
  publications: Publication[];
  onBack: () => void;
  onUpdateStock: (publicationId: string, newQuantity: number) => void;
}

export const StockManagement: React.FC<StockManagementProps> = ({
  displayId,
  publications,
  onBack,
  onUpdateStock,
}) => {
  const [quantities, setQuantities] = useState<Record<string, number>>(
    publications.reduce((acc, pub) => ({ ...acc, [pub.id]: pub.quantity }), {})
  );

  const handleQuantityChange = (publicationId: string, value: number) => {
    const newQuantity = Math.max(0, value);
    setQuantities(prev => ({ ...prev, [publicationId]: newQuantity }));
  };

  const handleSubmit = () => {
    Object.entries(quantities).forEach(([publicationId, quantity]) => {
      onUpdateStock(publicationId, quantity);
    });
    onBack();
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Retour
          </button>
          <h2 className="text-xl font-semibold text-gray-900">Gestion du stock</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Publication
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Titre
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantité
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {publications.map((publication) => (
                <tr key={publication.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img
                      src={publication.imageUrl}
                      alt={publication.title}
                      className="h-16 w-12 object-cover rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {publication.title}
                    </div>
                    {quantities[publication.id] <= publication.minQuantity && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Stock bas
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {quantities[publication.id]}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleQuantityChange(
                          publication.id,
                          quantities[publication.id] - 1
                        )}
                        className="p-1 rounded-full text-gray-400 hover:text-gray-500"
                      >
                        <Minus className="h-5 w-5" />
                      </button>
                      <input
                        type="number"
                        value={quantities[publication.id]}
                        onChange={(e) => handleQuantityChange(
                          publication.id,
                          parseInt(e.target.value) || 0
                        )}
                        className="w-16 px-2 py-1 text-center border rounded-md"
                        min="0"
                      />
                      <button
                        onClick={() => handleQuantityChange(
                          publication.id,
                          quantities[publication.id] + 1
                        )}
                        className="p-1 rounded-full text-gray-400 hover:text-gray-500"
                      >
                        <Plus className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Mettre à jour le stock
          </button>
        </div>
      </div>
    </div>
  );
};