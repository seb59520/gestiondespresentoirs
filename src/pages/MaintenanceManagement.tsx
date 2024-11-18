import React, { useState } from 'react';
import { ArrowLeft, Wrench, AlertTriangle, CheckCircle, Calendar } from 'lucide-react';
import type { Display, MaintenanceIntervention } from '../types';
import { useAtom } from 'jotai';
import { authStateAtom } from '../store/authStore';

interface MaintenanceManagementProps {
  onBack: () => void;
}

export const MaintenanceManagement: React.FC<MaintenanceManagementProps> = ({ onBack }) => {
  const [selectedDisplay, setSelectedDisplay] = useState<Display | null>(null);
  const [showAcknowledgmentModal, setShowAcknowledgmentModal] = useState(false);
  const [acknowledgmentNote, setAcknowledgmentNote] = useState('');
  const [authState] = useAtom(authStateAtom);

  // Récupérer les données du domaine
  const domain = JSON.parse(localStorage.getItem('domain') || '{}');
  const displays = domain.displays || [];

  const handleAcknowledgeMaintenance = (display: Display) => {
    setSelectedDisplay(display);
    setShowAcknowledgmentModal(true);
  };

  const submitAcknowledgment = () => {
    if (!selectedDisplay || !acknowledgmentNote) return;

    // Créer une nouvelle intervention
    const intervention: MaintenanceIntervention = {
      id: `maint-${Date.now()}`,
      displayId: selectedDisplay.id,
      date: new Date().toISOString(),
      type: 'preventive',
      description: acknowledgmentNote,
      technician: authState.user?.firstName + ' ' + authState.user?.lastName || 'Technicien',
      status: 'completed'
    };

    // Mettre à jour la date de dernière maintenance
    const updatedDisplays = displays.map(d => {
      if (d.id === selectedDisplay.id) {
        const now = new Date();
        const nextMaintenance = new Date();
        nextMaintenance.setDate(now.getDate() + 30);

        return {
          ...d,
          lastMaintenance: now.toISOString(),
          nextMaintenance: nextMaintenance.toISOString(),
          maintenanceHistory: [...(d.maintenanceHistory || []), intervention]
        };
      }
      return d;
    });

    // Mettre à jour le domaine
    domain.displays = updatedDisplays;
    localStorage.setItem('domain', JSON.stringify(domain));

    setShowAcknowledgmentModal(false);
    setAcknowledgmentNote('');
    setSelectedDisplay(null);
  };

  const displaysDueMaintenance = displays.filter(
    display => new Date(display.nextMaintenance) <= new Date()
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Retour au tableau de bord
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Gestion de la maintenance</h1>
        </div>

        <div className="space-y-6">
          {displaysDueMaintenance.length > 0 ? (
            displaysDueMaintenance.map(display => (
              <div key={`display-${display.id}`} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{display.name}</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Responsable: {display.responsibleName}
                      </p>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Maintenance requise
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-start space-x-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
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
                        <p className="text-sm font-medium text-gray-500">Maintenance prévue</p>
                        <p className="mt-1 text-gray-900">
                          {new Date(display.nextMaintenance).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div>
                      <button
                        onClick={() => handleAcknowledgeMaintenance(display)}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Acquitter la maintenance
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <CheckCircle className="mx-auto h-12 w-12 text-green-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune maintenance requise</h3>
              <p className="mt-1 text-sm text-gray-500">
                Tous les présentoirs sont à jour dans leur maintenance.
              </p>
            </div>
          )}
        </div>
      </div>

      {showAcknowledgmentModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Acquitter la maintenance
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Note d'intervention
                </label>
                <textarea
                  value={acknowledgmentNote}
                  onChange={(e) => setAcknowledgmentNote(e.target.value)}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Décrivez les opérations effectuées..."
                  required
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowAcknowledgmentModal(false);
                    setAcknowledgmentNote('');
                    setSelectedDisplay(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  onClick={submitAcknowledgment}
                  disabled={!acknowledgmentNote}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Valider
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};