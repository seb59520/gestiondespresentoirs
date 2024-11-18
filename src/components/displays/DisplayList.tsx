import React, { useState } from 'react';
import { User, Calendar, Package, Clock, XCircle, AlertTriangle, Wrench, RotateCcw, Image, Eye } from 'lucide-react';
import type { Display, DisplayRequest } from '../../types';
import { useNavigate } from 'react-router-dom';
import { UsageReport } from '../public/UsageReport';
import { RequestForm } from '../public/RequestForm';
import { DisplayDetails } from './DisplayDetails';
import { ReservationForm } from '../public/ReservationForm';

export const DisplayList: React.FC = () => {
  const navigate = useNavigate();
  const domain = JSON.parse(localStorage.getItem('domain') || '{}');
  const [displays, setDisplays] = useState(domain.displays || []);
  const [selectedDisplay, setSelectedDisplay] = useState<Display | null>(null);
  const [showUsageReport, setShowUsageReport] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showReservationForm, setShowReservationForm] = useState(false);
  const [requestType, setRequestType] = useState<DisplayRequest['type']>('poster_change');

  const handleAction = (display: Display, action: 'usage' | 'stock' | 'poster' | 'issue') => {
    setSelectedDisplay(display);
    if (action === 'usage') {
      setShowUsageReport(true);
    } else {
      setRequestType(
        action === 'stock' ? 'stock_update' :
        action === 'poster' ? 'poster_change' : 'issue_report'
      );
      setShowRequestForm(true);
    }
  };

  const handleCancelReservation = async (displayId: string) => {
    const confirmCancel = window.confirm('Êtes-vous sûr de vouloir annuler cette réservation ?');
    
    if (confirmCancel) {
      const updatedDisplays = displays.map(display => {
        if (display.id === displayId) {
          return {
            ...display,
            status: 'available',
            currentReservation: {
              ...display.currentReservation!,
              status: 'cancelled'
            }
          };
        }
        return display;
      });

      // Mettre à jour le state local
      setDisplays(updatedDisplays);

      // Mettre à jour le localStorage
      const updatedDomain = {
        ...domain,
        displays: updatedDisplays
      };
      localStorage.setItem('domain', JSON.stringify(updatedDomain));

      // Fermer les modales
      setSelectedDisplay(null);
      setShowDetails(false);
    }
  };

  const handleReserveClick = (display: Display) => {
    if (display.status === 'available') {
      setSelectedDisplay(display);
      setShowReservationForm(true);
    } else {
      setSelectedDisplay(display);
      setShowDetails(true);
    }
  };

  const handleReservationComplete = () => {
    // Recharger les données depuis le localStorage
    const updatedDomain = JSON.parse(localStorage.getItem('domain') || '{}');
    setDisplays(updatedDomain.displays || []);
    setShowReservationForm(false);
    setSelectedDisplay(null);
  };

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Présentoir
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Emprunteur
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {displays.map((display) => {
              const hasActiveReservation = display.currentReservation?.status === 'active';
              return (
                <tr key={display.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{display.name}</div>
                    <div className="text-sm text-gray-500">{display.location}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {hasActiveReservation ? display.currentReservation?.borrowerName : '-'}
                    </div>
                    {hasActiveReservation && (
                      <div className="text-sm text-gray-500">
                        {display.currentReservation?.borrowerEmail}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      display.status === 'available' 
                        ? 'bg-green-100 text-green-800'
                        : display.status === 'reserved'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {display.status === 'available' ? 'Disponible' : 
                       display.status === 'reserved' ? 'Réservé' : 'En maintenance'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {display.currentStock} unités
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      {hasActiveReservation ? (
                        <>
                          <button
                            onClick={() => handleAction(display, 'stock')}
                            className="text-blue-600 hover:text-blue-900"
                            title="Mettre à jour le stock"
                          >
                            <Package className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleAction(display, 'poster')}
                            className="text-purple-600 hover:text-purple-900"
                            title="Changer l'affiche"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleAction(display, 'issue')}
                            className="text-yellow-600 hover:text-yellow-900"
                            title="Signaler un problème"
                          >
                            <AlertTriangle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleCancelReservation(display.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Annuler la réservation"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleReserveClick(display)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          {display.status === 'available' ? 'Réserver' : 'Voir détails'}
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setSelectedDisplay(display);
                          setShowDetails(true);
                        }}
                        className="text-gray-600 hover:text-gray-900"
                        title="Voir les détails"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {selectedDisplay && showDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <DisplayDetails
              display={selectedDisplay}
              onClose={() => {
                setSelectedDisplay(null);
                setShowDetails(false);
              }}
              onCancelReservation={handleCancelReservation}
              onAction={handleAction}
            />
          </div>
        </div>
      )}

      {selectedDisplay && showReservationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-lg w-full">
            <ReservationForm
              display={selectedDisplay}
              onClose={() => {
                setSelectedDisplay(null);
                setShowReservationForm(false);
              }}
              onSubmit={handleReservationComplete}
            />
          </div>
        </div>
      )}

      {selectedDisplay && showUsageReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-lg w-full">
            <UsageReport
              display={selectedDisplay}
              onClose={() => {
                setSelectedDisplay(null);
                setShowUsageReport(false);
              }}
            />
          </div>
        </div>
      )}

      {selectedDisplay && showRequestForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-lg w-full">
            <RequestForm
              display={selectedDisplay}
              type={requestType}
              onClose={() => {
                setSelectedDisplay(null);
                setShowRequestForm(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};