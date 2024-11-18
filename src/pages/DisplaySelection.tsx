import React, { useState } from 'react';
import { ArrowLeft, User, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { displaysAtom } from '../store/displayStore';
import { ReservationForm } from '../components/public/ReservationForm';

interface DisplaySelectionProps {
  onBack: () => void;
}

export const DisplaySelection: React.FC<DisplaySelectionProps> = ({ onBack }) => {
  const navigate = useNavigate();
  const [displays] = useAtom(displaysAtom);
  const [selectedDisplay, setSelectedDisplay] = useState<string | null>(null);
  const availableDisplays = displays.filter(display => display.status === 'available');
  const display = selectedDisplay ? displays.find(d => d.id === selectedDisplay) : null;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={onBack}
          className="mb-6 flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Retour à la liste
        </button>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">Sélectionner un présentoir</h2>
        
        {availableDisplays.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <p className="text-gray-500">Aucun présentoir disponible pour le moment</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {availableDisplays.map((display) => (
              <div
                key={display.id}
                onClick={() => setSelectedDisplay(display.id)}
                className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900">{display.name}</h3>
                  
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center text-sm text-gray-500">
                      <User className="h-4 w-4 mr-2" />
                      <span>Responsable: {display.responsibleName}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Package className="h-4 w-4 mr-2" />
                      <span>Stock: {display.currentStock} unités</span>
                    </div>
                  </div>

                  <button className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                    Sélectionner
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedDisplay && display && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-lg w-full">
            <ReservationForm
              display={display}
              onClose={() => setSelectedDisplay(null)}
              onSubmit={() => navigate('/')}
            />
          </div>
        </div>
      )}
    </div>
  );
};