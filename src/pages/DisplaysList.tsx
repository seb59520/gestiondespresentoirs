import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DisplayList } from '../components/displays/DisplayList';

interface DisplaysListProps {
  onBack: () => void;
}

export const DisplaysList: React.FC<DisplaysListProps> = ({ onBack }) => {
  const navigate = useNavigate();

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
          <h1 className="text-2xl font-bold text-gray-900">État des présentoirs</h1>
        </div>

        <div className="mb-6">
          <button
            onClick={() => navigate('/displays')}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Nouvelle réservation
          </button>
        </div>

        <DisplayList />
      </div>
    </div>
  );
};