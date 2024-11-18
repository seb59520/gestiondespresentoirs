import React from 'react';
import { Calendar, Clock, User, Mail, XCircle } from 'lucide-react';
import type { DisplayReservation } from '../../types';

interface ReservationDetailsProps {
  reservation: DisplayReservation;
  onCancel?: () => void;
}

export const ReservationDetails: React.FC<ReservationDetailsProps> = ({
  reservation,
  onCancel
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-medium text-gray-900">Détails de la réservation</h3>
        {reservation.status === 'active' && onCancel && (
          <button
            onClick={onCancel}
            className="flex items-center text-red-600 hover:text-red-700"
          >
            <XCircle className="w-4 h-4 mr-1" />
            Annuler
          </button>
        )}
      </div>

      <div className="mt-4 space-y-4">
        <div className="flex items-center text-sm text-gray-500">
          <User className="h-4 w-4 mr-2" />
          <span>Emprunteur: {reservation.borrowerName}</span>
        </div>

        <div className="flex items-center text-sm text-gray-500">
          <Mail className="h-4 w-4 mr-2" />
          <span>Email: {reservation.borrowerEmail}</span>
        </div>

        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="h-4 w-4 mr-2" />
          <span>Date de début: {new Date(reservation.startDate).toLocaleDateString()}</span>
        </div>

        {reservation.endDate && (
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="h-4 w-4 mr-2" />
            <span>Date de fin: {new Date(reservation.endDate).toLocaleDateString()}</span>
          </div>
        )}

        {reservation.isPermanent && (
          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Prêt permanent
          </div>
        )}

        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          reservation.status === 'active'
            ? 'bg-green-100 text-green-800'
            : reservation.status === 'completed'
            ? 'bg-blue-100 text-blue-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {reservation.status === 'active' ? 'En cours' :
           reservation.status === 'completed' ? 'Terminée' : 'Annulée'}
        </div>
      </div>
    </div>
  );
};