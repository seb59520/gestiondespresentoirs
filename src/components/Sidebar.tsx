import React from 'react';
import { LayoutDashboard, Calendar, Wrench, BarChart, Settings, HelpCircle, QrCode, Image, Plus, Library } from 'lucide-react';
import { useAtom } from 'jotai';
import { authStateAtom } from '../store/authStore';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { useNavigate, useLocation } from 'react-router-dom';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isMobileMenuOpen?: boolean;
  onCloseMobileMenu?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentPage, 
  onNavigate,
  isMobileMenuOpen,
  onCloseMobileMenu
}) => {
  const [authState] = useAtom(authStateAtom);
  const { isOnline, firestoreConnected } = useNetworkStatus();
  const navigate = useNavigate();
  const location = useLocation();

  const navigation = [
    { 
      name: 'Tableau de Bord', 
      icon: LayoutDashboard, 
      id: 'dashboard',
      path: '/',
      description: "Vue d'ensemble de votre assemblée"
    },
    { 
      name: 'Nouveau Présentoir', 
      icon: Plus, 
      id: 'create',
      path: '/create',
      description: 'Créer un nouveau présentoir'
    },
    { 
      name: 'Publications', 
      icon: Library, 
      id: 'publications',
      path: '/publications',
      description: 'Bibliothèque de publications'
    },
    { 
      name: 'Affiches', 
      icon: Image, 
      id: 'posters',
      path: '/posters',
      description: 'Gestion des affiches'
    },
    { 
      name: 'QR Codes', 
      icon: QrCode, 
      id: 'qrcodes',
      path: '/qrcodes',
      description: 'Gestion des QR codes des présentoirs'
    },
    { 
      name: 'Maintenance', 
      icon: Wrench, 
      id: 'maintenance',
      path: '/maintenance',
      description: 'Suivi et planification des maintenances'
    },
    { 
      name: 'Analytique', 
      icon: BarChart, 
      id: 'analytics',
      path: '/analytics',
      description: 'Statistiques et rapports'
    }
  ];

  const secondaryNavigation = [
    { 
      name: 'Paramètres', 
      icon: Settings, 
      id: 'settings',
      path: '/settings',
      description: 'Configuration de votre assemblée'
    },
    { 
      name: 'Aide', 
      icon: HelpCircle, 
      id: 'help',
      path: '/help',
      description: "Centre d'aide et support"
    }
  ];

  const handleNavigate = (path: string, pageId: string) => {
    navigate(path);
    onNavigate(pageId);
    if (onCloseMobileMenu) {
      onCloseMobileMenu();
    }
  };

  const isCurrentPath = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="flex-shrink-0 px-6 py-4 bg-white border-b border-gray-200">
        <img
          className="h-8 w-auto"
          src="https://images.unsplash.com/photo-1633409361618-c73427e4e206?auto=format&fit=crop&w=32&h=32&q=80"
          alt="Logo"
        />
        <span className="mt-2 text-xl font-bold text-gray-900">Gest'Prez</span>
        <span className="mt-1 text-sm text-gray-600 block">
          {JSON.parse(localStorage.getItem('domain') || '{}').name || 'Assemblée non configurée'}
        </span>
      </div>
      
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto bg-white">
        {navigation.map((item) => (
          <button
            key={item.name}
            onClick={() => handleNavigate(item.path, item.id)}
            className={`
              w-full text-left group flex items-center px-2 py-2 text-sm font-medium rounded-md
              ${isCurrentPath(item.path)
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
              }
            `}
            title={item.description}
          >
            <item.icon
              className={`
                mr-3 flex-shrink-0 h-5 w-5
                ${isCurrentPath(item.path) ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'}
              `}
            />
            {item.name}
          </button>
        ))}

        <div className="pt-4 mt-4 border-t border-gray-200">
          {secondaryNavigation.map((item) => (
            <button
              key={item.name}
              onClick={() => handleNavigate(item.path, item.id)}
              className={`
                w-full text-left group flex items-center px-2 py-2 text-sm font-medium rounded-md
                ${isCurrentPath(item.path)
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }
              `}
              title={item.description}
            >
              <item.icon
                className={`
                  mr-3 flex-shrink-0 h-5 w-5
                  ${isCurrentPath(item.path) ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'}
                `}
              />
              {item.name}
            </button>
          ))}
        </div>
      </nav>

      <div className="flex-shrink-0 px-4 py-4 bg-white border-t border-gray-200">
        <div className="space-y-2">
          <div className={`flex items-center justify-center w-full px-3 py-1 rounded-full text-sm ${
            isOnline 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {isOnline ? 'En ligne' : 'Hors ligne'}
          </div>
          
          {isOnline && (
            <div className={`flex items-center justify-center w-full px-3 py-1 rounded-full text-sm ${
              firestoreConnected 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {firestoreConnected ? 'Firebase connecté' : 'Firebase déconnecté'}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:border-r lg:border-gray-200 lg:bg-white">
        {sidebarContent}
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={onCloseMobileMenu} />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                onClick={onCloseMobileMenu}
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              >
                <span className="sr-only">Fermer le menu</span>
                <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};