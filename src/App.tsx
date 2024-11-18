import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { DisplaysPage } from './pages/DisplaysPage';
import { Settings } from './pages/Settings';
import { QRCodeManagement } from './pages/QRCodeManagement';
import { MaintenanceManagement } from './pages/MaintenanceManagement';
import { PosterManagement } from './pages/PosterManagement';
import { Login } from './pages/Login';
import { Registration } from './pages/Registration';
import { Analytics } from './pages/Analytics';
import { CreateDisplay } from './pages/CreateDisplay';
import { PublicationsLibrary } from './pages/PublicationsLibrary';
import { Help } from './pages/Help';
import { PublicDisplay } from './pages/PublicDisplay';
import { DisplaysList } from './pages/DisplaysList';
import { DisplaySelection } from './pages/DisplaySelection';
import { InitializationWizard } from './pages/InitializationWizard';
import type { Domain } from './types';
import { useAtom } from 'jotai';
import { authStateAtom, setAuthStateAtom } from './store/authStore';
import { auth } from './utils/firebase';
import { cleanupAuth } from './utils/auth';

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showRegistration, setShowRegistration] = useState(false);
  const [domain, setDomain] = useState<Domain | null>(null);
  const [authState] = useAtom(authStateAtom);
  const [, setAuthState] = useAtom(setAuthStateAtom);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Set initial auth state based on current Firebase auth state
    const initialUser = auth.currentUser;
    if (initialUser) {
      const userData = localStorage.getItem('userData');
      if (userData) {
        setAuthState({
          isAuthenticated: true,
          user: JSON.parse(userData),
          loading: false
        });
      }
    } else {
      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false
      });
    }
    setIsInitialized(true);

    // Listen for auth state changes
    const handleAuthStateChange = (event: CustomEvent) => {
      const { isAuthenticated } = event.detail;
      if (isAuthenticated) {
        const userData = localStorage.getItem('userData');
        if (userData) {
          setAuthState({
            isAuthenticated: true,
            user: JSON.parse(userData),
            loading: false
          });
        }
      } else {
        setAuthState({
          isAuthenticated: false,
          user: null,
          loading: false
        });
      }
    };

    window.addEventListener('authStateChange', handleAuthStateChange as EventListener);

    return () => {
      window.removeEventListener('authStateChange', handleAuthStateChange as EventListener);
      cleanupAuth();
    };
  }, [setAuthState]);

  useEffect(() => {
    if (authState.isAuthenticated) {
      const storedDomain = localStorage.getItem('domain');
      if (storedDomain) {
        setDomain(JSON.parse(storedDomain));
      }
    }
  }, [authState.isAuthenticated]);

  const handleLogin = async (domainId: string) => {
    const storedDomain = localStorage.getItem('domain');
    if (storedDomain) {
      setDomain(JSON.parse(storedDomain));
    }
    navigate('/');
  };

  const handleRegistration = async (registration: any) => {
    await initializeDemoUser();
    setShowRegistration(false);
    navigate('/');
  };

  if (!isInitialized || authState.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/public/displays/:id" element={<PublicDisplay />} />
      <Route path="/setup" element={<InitializationWizard />} />

      <Route
        path="/*"
        element={
          !authState.isAuthenticated ? (
            showRegistration ? (
              <Registration onComplete={handleRegistration} />
            ) : (
              <Login 
                onLogin={handleLogin}
                onRegister={() => setShowRegistration(true)}
              />
            )
          ) : (
            <div className="min-h-screen bg-gray-100">
              <Sidebar 
                currentPage={currentPage} 
                onNavigate={setCurrentPage}
                isMobileMenuOpen={isMobileMenuOpen}
                onCloseMobileMenu={() => setIsMobileMenuOpen(false)}
              />
              <div className="lg:pl-64 flex flex-col flex-1">
                <Routes>
                  <Route path="/" element={domain && <DisplaysPage domain={domain} onNavigate={setCurrentPage} />} />
                  <Route path="/displays/list" element={<DisplaysList onBack={() => navigate('/')} />} />
                  <Route path="/displays/new" element={<DisplaySelection onBack={() => navigate('/')} />} />
                  <Route path="/settings" element={<Settings onBack={() => navigate('/')} />} />
                  <Route path="/qrcodes" element={<QRCodeManagement onBack={() => navigate('/')} />} />
                  <Route path="/maintenance" element={<MaintenanceManagement onBack={() => navigate('/')} />} />
                  <Route path="/posters" element={<PosterManagement onBack={() => navigate('/')} />} />
                  <Route path="/analytics" element={<Analytics onBack={() => navigate('/')} />} />
                  <Route path="/create" element={<CreateDisplay onBack={() => navigate('/')} />} />
                  <Route path="/publications" element={<PublicationsLibrary onBack={() => navigate('/')} />} />
                  <Route path="/help" element={<Help onBack={() => navigate('/')} />} />
                </Routes>
              </div>
            </div>
          )
        }
      />
    </Routes>
  );
}