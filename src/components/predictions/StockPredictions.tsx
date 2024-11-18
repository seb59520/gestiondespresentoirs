import React from 'react';
import { TrendingUp, AlertTriangle, Package } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import type { Publication } from '../../types';
import { predictStockLevel, predictRestockDate, optimizeStockLevels } from '../../utils/predictions';

interface StockPredictionsProps {
  publications: Publication[];
}

export const StockPredictions: React.FC<StockPredictionsProps> = ({ publications }) => {
  const predictions = publications.map(pub => ({
    ...pub,
    predictedLevel: predictStockLevel([pub]),
    restockDate: predictRestockDate(pub),
    ...optimizeStockLevels([pub])[0]
  }));

  const generatePredictionData = (publication: Publication) => {
    return Array.from({ length: 30 }, (_, i) => ({
      day: i + 1,
      actual: Math.max(0, publication.quantity - Math.floor(i * 0.5)),
      predicted: predictStockLevel([publication], i)
    }));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {predictions.map(pub => (
          <div key={pub.id} className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-start space-x-4">
              <img
                src={pub.imageUrl}
                alt={pub.title}
                className="w-16 h-24 object-cover rounded"
              />
              <div>
                <h3 className="font-medium text-gray-900">{pub.title}</h3>
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-gray-500">
                    Stock actuel: {pub.quantity}
                  </p>
                  <p className="text-sm text-gray-500">
                    Prévision à 30 jours: {pub.predictedLevel}
                  </p>
                  {pub.restockDate && (
                    <p className="text-sm text-red-600 flex items-center">
                      <AlertTriangle className="w-4 h-4 mr-1" />
                      Réapprovisionnement conseillé le {pub.restockDate.toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4">
              <LineChart width={300} height={200} data={generatePredictionData(pub)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="actual" stroke="#8884d8" name="Réel" />
                <Line type="monotone" dataKey="predicted" stroke="#82ca9d" name="Prévu" />
              </LineChart>
            </div>

            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h4 className="text-sm font-medium text-blue-900">Recommandations</h4>
              <ul className="mt-2 space-y-2 text-sm text-blue-800">
                <li className="flex items-center">
                  <Package className="w-4 h-4 mr-2" />
                  Stock minimum recommandé: {pub.recommendations.minStock}
                </li>
                <li className="flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Point de réapprovisionnement: {pub.recommendations.restockPoint}
                </li>
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};