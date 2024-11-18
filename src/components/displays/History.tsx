import React from 'react';
import { Clock, Wrench, Package, AlertTriangle, CheckCircle } from 'lucide-react';
import type { Display } from '../../types';
import { mockDisplays } from '../../utils/mockData';

interface HistoryItem {
  id: string;
  displayId: string;
  type: 'maintenance' | 'stock' | 'alert';
  description: string;
  date: string;
  user: string;
  details?: {
    type?: 'preventive' | 'corrective';
    status?: 'completed' | 'pending';
  };
}

interface HistoryProps {
  displayId: string;
}

export const History: React.FC<HistoryProps> = ({ displayId }) => {
  const display = mockDisplays.find(d => d.id === displayId);
  if (!display) return null;

  // Combiner l'historique des maintenances avec les autres événements
  const history: HistoryItem[] = [
    ...(display.maintenanceHistory?.map(intervention => ({
      id: intervention.id,
      displayId: intervention.displayId,
      type: 'maintenance' as const,
      description: intervention.description,
      date: intervention.date,
      user: intervention.technician,
      details: {
        type: intervention.type,
        status: 'completed' as const
      }
    })) || []),
    // Ajouter d'autres types d'événements ici si nécessaire
  ];

  // Trier par date décroissante
  history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getIcon = (type: string) => {
    switch (type) {
      case 'maintenance':
        return <Wrench className="h-5 w-5 text-blue-500" />;
      case 'stock':
        return <Package className="h-5 w-5 text-green-500" />;
      case 'alert':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {history.map((item, itemIdx) => (
          <li key={item.id}>
            <div className="relative pb-8">
              {itemIdx !== history.length - 1 ? (
                <span
                  className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                  aria-hidden="true"
                />
              ) : null}
              <div className="relative flex space-x-3">
                <div>
                  <span className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                    {getIcon(item.type)}
                  </span>
                </div>
                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                  <div>
                    <p className="text-sm text-gray-900">
                      {item.description}
                      {item.type === 'maintenance' && item.details?.status === 'completed' && (
                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Acquittée
                        </span>
                      )}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">Par {item.user}</p>
                  </div>
                  <div className="text-right text-sm whitespace-nowrap text-gray-500">
                    {new Date(item.date).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}