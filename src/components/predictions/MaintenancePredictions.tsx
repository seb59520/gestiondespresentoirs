import React from 'react';
import { Wrench, AlertTriangle, Clock } from 'lucide-react';
import type { Display } from '../../types';
import { predictMaintenanceNeeds } from '../../utils/predictions';

interface MaintenancePredictionsProps {
  displays: Display[];
}

export const MaintenancePredictions: React.FC<MaintenancePredictionsProps> = ({ displays }) => {
  const predictions = displays.map(display => ({
    ...display,
    prediction: predictMaintenanceNeeds(display)
  }));

  const getRiskColor = (score: number) => {
    if (score < 0.3) return 'bg-green-100 text-green-800';
    if (score < 0.7) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-6">
      {predictions.map(display => (
        <div key={display.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{display.name}</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Responsable: {display.responsibleName}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                getRiskColor(display.prediction.riskScore)
              }`}>
                Risque: {Math.round(display.prediction.riskScore * 100)}%
              </span>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Dernière maintenance</p>
                  <p className="mt-1 text-gray-900">
                    {new Date(display.lastMaintenance).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Wrench className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Maintenance recommandée</p>
                  <p className="mt-1 text-gray-900">
                    {display.prediction.recommendedDate.toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Facteurs de risque</p>
                  <ul className="mt-1 space-y-1 text-sm text-gray-600">
                    <li>Âge: {Math.round(display.prediction.factors.age * 100)}%</li>
                    <li>Utilisation: {Math.round(display.prediction.factors.usage * 100)}%</li>
                    <li>Historique: {Math.round(display.prediction.factors.history * 100)}%</li>
                  </ul>
                </div>
              </div>
            </div>

            {display.prediction.riskScore >= 0.7 && (
              <div className="mt-4 p-4 bg-red-50 rounded-lg">
                <div className="flex items-start">
                  <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-red-800">
                      Maintenance préventive recommandée
                    </h4>
                    <p className="mt-1 text-sm text-red-700">
                      Le présentoir présente un risque élevé de problèmes. Une maintenance préventive est fortement conseillée.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};