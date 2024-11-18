import React, { useState } from 'react';
import { ArrowLeft, TrendingUp, Users, Clock, Calendar, BarChart, LineChart as LineChartIcon } from 'lucide-react';
import { StockPredictions } from '../components/predictions/StockPredictions';
import { MaintenancePredictions } from '../components/predictions/MaintenancePredictions';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart as RechartsBarChart,
  Bar
} from 'recharts';

interface AnalyticsProps {
  onBack: () => void;
}

export const Analytics: React.FC<AnalyticsProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'stock' | 'maintenance'>('overview');
  const domain = JSON.parse(localStorage.getItem('domain') || '{}');
  const displays = domain.displays || [];

  const generateOverviewData = () => {
    const data = [];
    for (let i = 0; i < 12; i++) {
      data.push({
        month: new Date(2024, i).toLocaleString('default', { month: 'short' }),
        publications: Math.floor(Math.random() * 100),
        maintenance: Math.floor(Math.random() * 20)
      });
    }
    return data;
  };

  const overviewData = generateOverviewData();

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
          <h1 className="text-2xl font-bold text-gray-900">Analytique</h1>
        </div>

        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="p-6">
            <nav className="flex space-x-4" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-3 py-2 font-medium text-sm rounded-md ${
                  activeTab === 'overview'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <BarChart className="w-4 h-4 mr-2 inline" />
                Vue d'ensemble
              </button>
              <button
                onClick={() => setActiveTab('stock')}
                className={`px-3 py-2 font-medium text-sm rounded-md ${
                  activeTab === 'stock'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <TrendingUp className="w-4 h-4 mr-2 inline" />
                Prédictions Stock
              </button>
              <button
                onClick={() => setActiveTab('maintenance')}
                className={`px-3 py-2 font-medium text-sm rounded-md ${
                  activeTab === 'maintenance'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <LineChartIcon className="w-4 h-4 mr-2 inline" />
                Prédictions Maintenance
              </button>
            </nav>

            <div className="mt-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-blue-50 p-6 rounded-lg">
                      <div className="flex items-center">
                        <Users className="h-6 w-6 text-blue-600" />
                        <h3 className="ml-2 text-lg font-medium text-blue-900">Présentoirs Actifs</h3>
                      </div>
                      <p className="mt-2 text-3xl font-semibold text-blue-900">{displays.length}</p>
                    </div>
                    <div className="bg-green-50 p-6 rounded-lg">
                      <div className="flex items-center">
                        <Clock className="h-6 w-6 text-green-600" />
                        <h3 className="ml-2 text-lg font-medium text-green-900">Publications</h3>
                      </div>
                      <p className="mt-2 text-3xl font-semibold text-green-900">
                        {displays.reduce((sum, display) => sum + (display.publications?.length || 0), 0)}
                      </p>
                    </div>
                    <div className="bg-purple-50 p-6 rounded-lg">
                      <div className="flex items-center">
                        <Calendar className="h-6 w-6 text-purple-600" />
                        <h3 className="ml-2 text-lg font-medium text-purple-900">Maintenances</h3>
                      </div>
                      <p className="mt-2 text-3xl font-semibold text-purple-900">
                        {displays.filter(d => new Date(d.nextMaintenance) <= new Date()).length}
                      </p>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Évolution annuelle</h3>
                    <RechartsBarChart width={800} height={300} data={overviewData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="publications" fill="#3B82F6" name="Publications" />
                      <Bar dataKey="maintenance" fill="#8B5CF6" name="Maintenances" />
                    </RechartsBarChart>
                  </div>
                </div>
              )}

              {activeTab === 'stock' && (
                <StockPredictions 
                  publications={displays.reduce((all, display) => 
                    [...all, ...(display.publications || [])], [])}
                />
              )}

              {activeTab === 'maintenance' && (
                <MaintenancePredictions displays={displays} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};