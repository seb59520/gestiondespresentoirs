import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, AlertTriangle, Save } from 'lucide-react';
import { AssemblySetup } from '../components/setup/AssemblySetup';
import { DisclaimerModal } from '../components/setup/DisclaimerModal';
import { sendInitializationSummary } from '../utils/email';
import type { Domain } from '../types';
import { register } from '../utils/auth';
import { createDomain } from '../utils/firestore';

type SetupStep = 'disclaimer' | 'user' | 'assembly' | 'review';

export const InitializationWizard: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<SetupStep>('disclaimer');
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  const [assemblyData, setAssemblyData] = useState({
    name: '',
    description: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'France'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDisclaimerAccept = () => {
    setShowDisclaimer(false);
    setCurrentStep('user');
  };

  const handleNext = () => {
    switch (currentStep) {
      case 'user':
        setCurrentStep('assembly');
        break;
      case 'assembly':
        setCurrentStep('review');
        break;
    }
  };

  const handleBack = () => {
    switch (currentStep) {
      case 'assembly':
        setCurrentStep('user');
        break;
      case 'review':
        setCurrentStep('assembly');
        break;
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // 1. Créer l'utilisateur
      const user = await register(userData.email, userData.password, {
        firstName: userData.firstName,
        lastName: userData.lastName
      });

      // 2. Créer le domaine
      const domain: Domain = {
        id: `domain-${Date.now()}`,
        name: assemblyData.name,
        assemblyId: Date.now().toString(),
        description: assemblyData.description,
        address: assemblyData.address,
        city: assemblyData.city,
        postalCode: assemblyData.postalCode,
        country: assemblyData.country,
        createdAt: new Date().toISOString(),
        ownerId: user.id,
        isConfigured: true,
        displays: [],
        posters: [],
        publications: []
      };

      // 3. Sauvegarder dans Firestore
      const savedDomain = await createDomain(domain);
      
      // 4. Sauvegarder dans le localStorage
      localStorage.setItem('domain', JSON.stringify(savedDomain));

      // 5. Envoyer le résumé par email
      await sendInitializationSummary({
        email: user.email,
        domain: savedDomain,
        posters: [],
        publications: [],
        displays: []
      });

      // 6. Rediriger vers le tableau de bord
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Error during initialization:', error);
      alert('Une erreur est survenue lors de l\'initialisation. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'user':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Créer votre compte administrateur</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Prénom</label>
                <input
                  type="text"
                  value={userData.firstName}
                  onChange={(e) => setUserData({ ...userData, firstName: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Nom</label>
                <input
                  type="text"
                  value={userData.lastName}
                  onChange={(e) => setUserData({ ...userData, lastName: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={userData.email}
                  onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
                <input
                  type="password"
                  value={userData.password}
                  onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300"
                  required
                />
              </div>
            </div>
          </div>
        );
      case 'assembly':
        return (
          <AssemblySetup
            data={assemblyData}
            onChange={setAssemblyData}
          />
        );
      case 'review':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Récapitulatif</h3>
              <div className="mt-4 bg-yellow-50 border border-yellow-100 rounded-lg p-4">
                <div className="flex">
                  <AlertTriangle className="h-5 w-5 text-yellow-400" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Vérifiez les informations avant de finaliser
                    </h3>
                    <p className="mt-2 text-sm text-yellow-700">
                      Une fois validé, un email de confirmation vous sera envoyé avec les instructions pour commencer.
                    </p>
                  </div>
                </div>
              </div>
              <dl className="mt-6 space-y-6 divide-y divide-gray-200">
                <div className="pt-6">
                  <dt className="text-sm font-medium text-gray-900">Administrateur</dt>
                  <dd className="mt-1 text-sm text-gray-500">
                    {userData.firstName} {userData.lastName}
                  </dd>
                  <dd className="mt-1 text-sm text-gray-500">{userData.email}</dd>
                </div>
                <div className="pt-6">
                  <dt className="text-sm font-medium text-gray-900">Assemblée</dt>
                  <dd className="mt-1 text-sm text-gray-500">{assemblyData.name}</dd>
                  <dd className="mt-1 text-sm text-gray-500">
                    {assemblyData.address}, {assemblyData.postalCode} {assemblyData.city}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Configuration de votre assemblée</h1>
              <p className="mt-1 text-sm text-gray-500">
                Suivez les étapes pour configurer votre espace de gestion
              </p>
            </div>

            {renderStep()}

            <div className="mt-8 flex justify-between">
              {currentStep !== 'user' && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour
                </button>
              )}
              {currentStep !== 'review' ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="ml-auto inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Suivant
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`ml-auto inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSubmitting ? 'Création en cours...' : 'Finaliser la configuration'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {showDisclaimer && (
        <DisclaimerModal
          onAccept={handleDisclaimerAccept}
          onDecline={() => navigate('/')}
        />
      )}
    </div>
  );
};