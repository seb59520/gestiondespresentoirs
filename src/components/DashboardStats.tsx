import React from 'react';
import { Activity, Box, Image as ImageIcon, Wrench } from 'lucide-react';
import { useAtom } from 'jotai';
import { authStateAtom } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

const StatCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  onClick?: () => void;
}> = ({ title, value, icon, color, onClick }) => (
  <div 
    className={`bg-white rounded-xl shadow-sm p-6 flex items-start space-x-4 ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
    onClick={onClick}
  >
    <div className={`p-3 rounded-lg ${color}`}>
      {icon}
    </div>
    <div>
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <div className="mt-1">
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);

export const DashboardStats: React.FC = () => {
  const [authState] = useAtom(authStateAtom);
  const navigate = useNavigate();
  const domain = JSON.parse(localStorage.getItem('domain') || '{}');

  const totalDisplays = domain.displays?.length || 0;
  const reservedDisplays = domain.displays?.filter(d => d.status === 'reserved').length || 0;
  const maintenanceNeeded = domain.displays?.filter(d => new Date(d.nextMaintenance) <= new Date()).length || 0;
  const totalPosters = domain.posters?.length || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Gestion des présentoirs"
        value={`${reservedDisplays}/${totalDisplays} réservés`}
        icon={<Box className="w-6 h-6 text-blue-600" />}
        color="bg-blue-50"
        onClick={() => navigate('/displays/list')}
      />
      <StatCard
        title="Affiches"
        value={totalPosters}
        icon={<ImageIcon className="w-6 h-6 text-purple-600" />}
        color="bg-purple-50"
        onClick={() => navigate('/posters')}
      />
      <StatCard
        title="Maintenance"
        value={`${maintenanceNeeded} à prévoir`}
        icon={<Wrench className="w-6 h-6 text-orange-600" />}
        color="bg-orange-50"
        onClick={() => navigate('/maintenance')}
      />
      <StatCard
        title="Publications"
        value={domain.publications?.length || 0}
        icon={<Activity className="w-6 h-6 text-green-600" />}
        color="bg-green-50"
        onClick={() => navigate('/publications')}
      />
    </div>
  );
};