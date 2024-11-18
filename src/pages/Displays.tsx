import React, { useState } from 'react';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { DisplayList } from '../components/displays/DisplayList';
import { DisplaySelection } from './DisplaySelection';
import { DisplaysList } from './DisplaysList';
import { PosterManagement } from './PosterManagement';
import { MaintenanceManagement } from './MaintenanceManagement';
import { DashboardStats } from '../components/DashboardStats';

export const DisplaysPage: React.FC = () => {
  const [showReservation, setShowReservation] = useState(false);
  const [showDisplaysList, setShowDisplaysList] = useState(false);
  const [showPosterManagement, setShowPosterManagement] = useState(false);
  const [showMaintenanceManagement, setShowMaintenanceManagement] = useState(false);

  if (showDisplaysList) {
    return <DisplaysList onBack={() => setShowDisplaysList(false)} />;
  }

  if (showReservation) {
    return <DisplaySelection onBack={() => setShowReservation(false)} />;
  }

  if (showPosterManagement) {
    return <PosterManagement onBack={() => setShowPosterManagement(false)} />;
  }

  if (showMaintenanceManagement) {
    return <MaintenanceManagement onBack={() => setShowMaintenanceManagement(false)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="lg:pl-64 flex flex-col flex-1">
        <Header />
        
        <main className="flex-1 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">Réservation des Présentoirs</h1>
                  <p className="mt-1 text-sm text-gray-500">Gérez vos présentoirs mobiles en temps réel</p>
                </div>
                <button 
                  onClick={() => setShowReservation(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Nouvelle Réservation
                </button>
              </div>

              <div className="mt-8">
                <DashboardStats 
                  onDisplaysClick={() => setShowDisplaysList(true)}
                  onPostersClick={() => setShowPosterManagement(true)}
                  onMaintenanceClick={() => setShowMaintenanceManagement(true)}
                />
              </div>

              <div className="mt-8">
                <DisplayList />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};