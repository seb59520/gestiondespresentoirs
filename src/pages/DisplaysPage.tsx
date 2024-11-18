import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { DisplayList } from '../components/displays/DisplayList';
import { DashboardStats } from '../components/DashboardStats';
import type { Domain } from '../types';

interface DisplaysPageProps {
  domain: Domain;
  onNavigate: (page: string) => void;
}

export const DisplaysPage: React.FC<DisplaysPageProps> = ({ domain, onNavigate }) => {
  const navigate = useNavigate();

  return (
    <div className="flex-1">
      <Header onMobileMenuToggle={() => {}} />
      <div className="flex">
        <main className="flex-1 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">Tableau de bord</h1>
                  <p className="mt-1 text-sm text-gray-500">Vue d'ensemble de vos présentoirs</p>
                </div>
                <button 
                  onClick={() => navigate('/displays/new')}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Nouvelle Réservation
                </button>
              </div>

              <div className="mt-8">
                <DashboardStats />
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