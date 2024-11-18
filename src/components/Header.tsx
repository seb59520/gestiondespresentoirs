import React, { useState, useRef, useEffect } from 'react';
import { Bell, Menu, Search, User, LogOut, Settings, ChevronDown } from 'lucide-react';
import { useAtom } from 'jotai';
import { authStateAtom } from '../store/authStore';
import { logout } from '../utils/auth';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onMobileMenuToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMobileMenuToggle }) => {
  const [authState] = useAtom(authStateAtom);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const domain = JSON.parse(localStorage.getItem('domain') || '{}');
    const displays = domain.displays || [];
    
    const results = displays.filter(display => 
      display.name.toLowerCase().includes(query.toLowerCase()) ||
      display.responsibleName?.toLowerCase().includes(query.toLowerCase())
    );

    setSearchResults(results);
    setShowSearchResults(true);
  };

  const handleLogout = async () => {
    try {
      await logout();
      window.location.reload();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <button 
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                onClick={onMobileMenuToggle}
              >
                <Menu className="h-6 w-6" />
              </button>
              <h1 className="text-xl font-bold text-gray-900 ml-3">Gestion des Présentoirs</h1>
            </div>
          </div>
          
          <div className="flex-1 flex justify-center px-2 lg:ml-6 lg:justify-end">
            <div className="max-w-lg w-full lg:max-w-xs relative">
              <label htmlFor="search" className="sr-only">Rechercher</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="search"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Rechercher présentoirs, responsables..."
                  type="search"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
              
              {showSearchResults && searchResults.length > 0 && (
                <div className="absolute mt-1 w-full bg-white rounded-md shadow-lg z-10">
                  <ul className="max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                    {searchResults.map((result) => (
                      <li
                        key={result.id}
                        className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-50"
                        onClick={() => {
                          setSearchQuery('');
                          setShowSearchResults(false);
                          navigate(`/displays/${result.id}`);
                        }}
                      >
                        <div className="flex items-center">
                          <span className="font-medium block truncate">{result.name}</span>
                        </div>
                        {result.responsibleName && (
                          <span className="text-gray-500 block text-sm truncate">
                            {result.responsibleName}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center lg:ml-6">
            <button className="p-2 rounded-full text-gray-400 hover:text-gray-500">
              <Bell className="h-6 w-6" />
            </button>
            
            <div className="ml-3 relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center p-1 rounded-full text-gray-400 hover:text-gray-500"
              >
                <User className="h-6 w-6" />
                <ChevronDown className="h-4 w-4 ml-1" />
              </button>

              {showUserMenu && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100">
                  <div className="py-1">
                    <div className="px-4 py-2">
                      <p className="text-sm font-medium text-gray-900">
                        {authState.user?.firstName} {authState.user?.lastName}
                      </p>
                      <p className="text-sm text-gray-500">{authState.user?.email}</p>
                    </div>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        navigate('/settings');
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Paramètres
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-gray-100"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Se déconnecter
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};