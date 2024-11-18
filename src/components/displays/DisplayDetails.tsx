import React from 'react';
import { X, Package, Calendar, AlertTriangle, Clock, RotateCcw, XCircle } from 'lucide-react';
import type { Display } from '../../types';
import { ReservationDetails } from './ReservationDetails';
import { DisplayStatusBadge } from './DisplayStatusBadge';

interface DisplayDetailsProps {
  display: Display;
  onClose: () => void;
  onCancelReservation: (displayId: string) => void;
  onAction: (display: Display, action: 'usage' | 'stock' | 'poster' | 'issue') => void;
}

export const DisplayDetails: React.FC<DisplayDetailsProps> = ({
  display,
  onClose,
  onCancelReservation,
  onAction
}) => {
  const hasActiveReservation = display.currentReservation?.status === 'active';

  return (
    <div className="p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{display.name}</h2>
          <div className="mt-2">
            <DisplayStatusBadge status={display.status} isPermanent={display.isPermanent} />
          </div>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
          <X className="w-5 h-5" />
        </button>
      </div>

      {hasActiveReservation && (
        <div className="mb-6">
          <ReservationDetails
            reservation={display.currentReservation}
            onCancel={() => onCancelReservation(display.id)}
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Actions disponibles</h3>
          <div className="space-y-3">
            <button
              onClick={() => onAction(display, 'stock')}
              className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <Package className="w-4 h-4 mr-2" />
              Mettre à jour le stock
            </button>
            <button
              onClick={() => onAction(display, 'poster')}
              className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Changer l'affiche
            </button>
            <button
              onClick={() => onAction(display, 'issue')}
              className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700"
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Signaler un problème
            </button>
            {hasActiveReservation && (
              <button
                onClick={() => onCancelReservation(display.id)}
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Annuler la réservation
              </button>
            )}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Informations</h3>
          <div className="space-y-3">
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="w-4 h-4 mr-2" />
              <span>Dernière maintenance: {new Date(display.lastMaintenance).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="w-4 h-4 mr-2" />
              <span>Prochaine maintenance: {new Date(display.nextMaintenance).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Package className="w-4 h-4 mr-2" />
              <span>Stock actuel: {display.currentStock} unités</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};