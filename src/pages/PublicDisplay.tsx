import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Package, User, MapPin, Calendar, AlertTriangle, Clock, Edit, RotateCcw, Wrench } from 'lucide-react';
import type { Display } from '../types';
import { ReservationForm } from '../components/public/ReservationForm';
import { UsageReport } from '../components/public/UsageReport';
import { RequestForm } from '../components/public/RequestForm';

export const PublicDisplay: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [display, setDisplay] = useState<Display | null>(null);
  const [showReservationForm, setShowReservationForm] = useState(false);
  const [showUsageReport, setShowUsageReport] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestType, setRequestType] = useState<'poster_change' | 'stock_update' | 'issue_report'>('poster_change');

  useEffect(() => {
    const domain = JSON.parse(localStorage.getItem('domain') || '{}');
    const foundDisplay = domain.displays?.find(d => d.id === id);
    setDisplay(foundDisplay || null);
  }, [id]);

  const handleReservationComplete = () => {
    setShowReservationForm(false);
    // Recharger les données du présentoir
    const domain = JSON.parse(localStorage.getItem('domain') || '{}');
    const updatedDisplay = domain.displays?.find(d => d.id === id);
    setDisplay(updatedDisplay || null);
  };

  if (!display) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Présentoir non trouvé</h1>
          <p className="text-gray-600">Ce présentoir n'existe pas ou n'est plus disponible.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{display.name}</h1>
            
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Informations</h2>
                <div className="space-y-3">
                  {display.responsibleName && (
                    <div className="flex items-center text-gray-600">
                      <User className="w-5 h-5 mr-2" />
                      <span>Responsable: {display.responsibleName}</span>
                    </div>
                  )}
                  {display.location && (
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-5 h-5 mr-2" />
                      <span>Emplacement: {display.location}</span>
                    </div>
                  )}
                  <div className="flex items-center text-gray-600">
                    <Package className="w-5 h-5 mr-2" />
                    <span>Stock: {display.currentStock} unités</span>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Actions</h2>
                <div className="space-y-3">
                  {display.status === 'available' && (
                    <button
                      onClick={() => setShowReservationForm(true)}
                      className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Réserver le présentoir
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setRequestType('stock_update');
                      setShowRequestForm(true);
                    }}
                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                  >
                    <Package className="w-4 h-4 mr-2" />
                    Mettre à jour le stock
                  </button>
                  <button
                    onClick={() => {
                      setRequestType('poster_change');
                      setShowRequestForm(true);
                    }}
                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Changer l'affiche
                  </button>
                  <button
                    onClick={() => {
                      setRequestType('issue_report');
                      setShowRequestForm(true);
                    }}
                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700"
                  >
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Signaler un problème
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showReservationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-lg w-full">
            <ReservationForm
              display={display}
              onClose={() => setShowReservationForm(false)}
              onSubmit={handleReservationComplete}
            />
          </div>
        </div>
      )}

      {showUsageReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-lg w-full">
            <UsageReport
              display={display}
              onClose={() => setShowUsageReport(false)}
            />
          </div>
        </div>
      )}

      {showRequestForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-lg w-full">
            <RequestForm
              display={display}
              type={requestType}
              onClose={() => setShowRequestForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};