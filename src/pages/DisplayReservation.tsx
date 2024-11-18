import React, { useState } from 'react';
import { mockDisplays } from '../utils/mockData';
import { StockManagement } from '../components/stock/StockManagement';
import { DisplayDetails } from '../components/displays/DisplayDetails';
import type { Publication } from '../types';

interface DisplayReservationProps {
  displayId: string;
  onBack: () => void;
}

export const DisplayReservation: React.FC<DisplayReservationProps> = ({ displayId, onBack }) => {
  const [showStockManagement, setShowStockManagement] = useState(false);
  const [display, setDisplay] = useState(mockDisplays.find(d => d.id === displayId));

  if (!display) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <p className="text-gray-500">Présentoir non trouvé</p>
          </div>
        </div>
      </div>
    );
  }

  const handleAddPublication = (publication: Publication) => {
    const updatedDisplay = {
      ...display,
      publications: [...(display.publications || []), publication]
    };
    setDisplay(updatedDisplay);

    // Update in mockDisplays
    const displayIndex = mockDisplays.findIndex(d => d.id === displayId);
    if (displayIndex !== -1) {
      mockDisplays[displayIndex] = updatedDisplay;
    }

    // Update in localStorage
    const domain = JSON.parse(localStorage.getItem('domain') || '{}');
    if (domain.displays) {
      domain.displays = domain.displays.map((d: typeof display) =>
        d.id === displayId ? updatedDisplay : d
      );
      localStorage.setItem('domain', JSON.stringify(domain));
    }
  };

  if (showStockManagement) {
    return (
      <StockManagement
        displayId={displayId}
        publications={display.publications || []}
        onBack={() => setShowStockManagement(false)}
        onUpdateStock={(publicationId, newQuantity) => {
          const updatedDisplay = {
            ...display,
            publications: display.publications?.map(pub =>
              pub.id === publicationId ? { ...pub, quantity: newQuantity } : pub
            )
          };
          setDisplay(updatedDisplay);
        }}
      />
    );
  }

  return (
    <DisplayDetails
      display={display}
      onBack={onBack}
      onStockManagement={() => setShowStockManagement(true)}
      onAddPublication={handleAddPublication}
    />
  );
};