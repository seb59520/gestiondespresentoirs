import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface DisplayMaintenanceInfoProps {
  lastMaintenance: string;
  nextMaintenance: string;
}

export const DisplayMaintenanceInfo: React.FC<DisplayMaintenanceInfoProps> = ({
  lastMaintenance,
  nextMaintenance,
}) => {
  const maintenanceDue = new Date(nextMaintenance) <= new Date();

  return (
    <div className="space-y-2">
      <div>
        <div className="text-sm text-gray-500">Dernière maintenance</div>
        <div className="font-medium">
          {new Date(lastMaintenance).toLocaleDateString()}
        </div>
      </div>
      <div>
        <div className="text-sm text-gray-500">Prochaine maintenance</div>
        <div className={`font-medium ${maintenanceDue ? 'text-red-600' : ''}`}>
          {new Date(nextMaintenance).toLocaleDateString()}
        </div>
        {maintenanceDue && (
          <div className="flex items-center text-red-600 text-sm mt-1">
            <AlertTriangle className="h-4 w-4 mr-1" />
            Maintenance requise
          </div>
        )}
      </div>
    </div>
  );
};