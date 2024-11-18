import React, { useState } from 'react';
import { ArrowLeft, Save, Calendar, Wrench, AlertTriangle } from 'lucide-react';
import { MaintenanceSettings } from '../components/settings/MaintenanceSettings';
import { AlertSettings } from '../components/settings/AlertSettings';

interface SettingsProps {
  onBack: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'maintenance' | 'alerts'>('maintenance');

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
          <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
        </div>

        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('maintenance')}
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'maintenance'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <Wrench className="w-4 h-4 mr-2" />
                  Cycles de maintenance
                </div>
              </button>
              <button
                onClick={() => setActiveTab('alerts')}
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === 'alerts'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Alertes
                </div>
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'maintenance' ? (
              <MaintenanceSettings />
            ) : (
              <AlertSettings />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};