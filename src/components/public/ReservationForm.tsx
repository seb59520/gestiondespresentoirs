import React, { useState } from 'react';
import { Calendar, X } from 'lucide-react';
import type { Display, DisplayReservation } from '../../types';

interface ReservationFormProps {
  display: Display;
  onClose: () => void;
  onSubmit?: (reservation: Partial<DisplayReservation>) => void;
}

export const ReservationForm: React.FC<ReservationFormProps> = ({
  display,
  onClose,
  onSubmit
}) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isPermanent, setIsPermanent] = useState(false);
  const [borrowerName, setBorrowerName] = useState('');
  const [borrowerEmail, setBorrowerEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const reservation: Partial<DisplayReservation> = {
      displayId: display.id,
      borrowerName,
      borrowerEmail,
      startDate,
      endDate: isPermanent ? null : endDate,
      isPermanent,
      status: 'active'
    };

    // Mettre à jour le domaine
    const domain = JSON.parse(localStorage.getItem('domain') || '{}');
    const updatedDisplays = domain.displays.map(d => {
      if (d.id === display.id) {
        return {
          ...d,
          status: 'reserved',
          currentReservation: {
            id: `reservation-${Date.now()}`,
            ...reservation
          }
        };
      }
      return d;
    });

    domain.displays = updatedDisplays;
    localStorage.setItem('domain', JSON.stringify(domain));

    if (onSubmit) {
      onSubmit(reservation);
    }

    onClose();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Réserver {display.name}</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nom de l'emprunteur
          </label>
          <input
            type="text"
            value={borrowerName}
            onChange={(e) => setBorrowerName(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email de l'emprunteur
          </label>
          <input
            type="email"
            value={borrowerEmail}
            onChange={(e) => setBorrowerEmail(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Date de début
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Prêt permanent
          </label>
          <div className="mt-1">
            <input
              type="checkbox"
              checked={isPermanent}
              onChange={(e) => setIsPermanent(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-600">
              Ce présentoir sera utilisé de manière permanente
            </span>
          </div>
        </div>

        {!isPermanent && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date de fin
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                required={!isPermanent}
              />
            </div>
          </div>
        )}

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
            Réserver
          </button>
        </div>
      </form>
    </div>
  );
};