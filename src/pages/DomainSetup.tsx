import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Save } from 'lucide-react';
import type { Domain, Display, Poster, Publication } from '../types';
import { PosterSetup } from '../components/setup/PosterSetup';
import { PublicationSetup } from '../components/setup/PublicationSetup';
import { DisplaySetup } from '../components/setup/DisplaySetup';

interface DomainSetupProps {
  onSetupComplete: (domain: Domain) => void;
}

type SetupStep = 'posters' | 'publications' | 'displays' | 'review';

export const DomainSetup: React.FC<DomainSetupProps> = ({ onSetupComplete }) => {
  const [currentStep, setCurrentStep] = useState<SetupStep>('posters');
  const [domainName, setDomainName] = useState('');
  const [posters, setPosters] = useState<Partial<Poster>[]>([]);
  const [publications, setPublications] = useState<Partial<Publication>[]>([]);
  const [displays, setDisplays] = useState<Partial<Display>[]>([]);

  const handleNext = () => {
    switch (currentStep) {
      case 'posters':
        setCurrentStep('publications');
        break;
      case 'publications':
        setCurrentStep('displays');
        break;
      case 'displays':
        setCurrentStep('review');
        break;
    }
  };

  const handleBack = () => {
    switch (currentStep) {
      case 'publications':
        setCurrentStep('posters');
        break;
      case 'displays':
        setCurrentStep('publications');
        break;
      case 'review':
        setCurrentStep('displays');
        break;
    }
  };

  const handleSubmit = () => {
    const domain: Domain = {
      id: Date.now().toString(),
      name: domainName,
      createdAt: new Date().toISOString(),
      isConfigured: true,
      displays: displays as Display[],
      posters: posters as Poster[],
      publications: publications as Publication[]
    };

    onSetupComplete(domain);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'posters':
        return (
          <PosterSetup
            posters={posters}
            onPostersChange={setPosters}
          />
        );
      case 'publications':
        return (
          <PublicationSetup
            publications={publications}
            onPublicationsChange={setPublications}
          />
        );
      case 'displays':
        return (
          <DisplaySetup
            displays={displays}
            onDisplaysChange={setDisplays}
            posters={posters as Poster[]}
            publications={publications as Publication[]}
          />
        );
      case 'review':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Récapitulatif</h3>
              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nom de l'assemblée
                  </label>
                  <input
                    type="text"
                    value={domainName}
                    onChange={(e) => setDomainName(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    {posters.length} modèles d'affiches
                  </p>
                  <p className="text-sm text-gray-600">
                    {publications.length} publications
                  </p>
                  <p className="text-sm text-gray-600">
                    {displays.length} présentoirs
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="mb-8">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Configuration du Domaine</h1>
                <div className="text-sm text-gray-500">
                  Étape {
                    currentStep === 'posters' ? '1/4' :
                    currentStep === 'publications' ? '2/4' :
                    currentStep === 'displays' ? '3/4' : '4/4'
                  }
                </div>
              </div>
              <div className="mt-4 relative">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-between">
                  {['posters', 'publications', 'displays', 'review'].map((step, index) => (
                    <div
                      key={step}
                      className={`flex items-center ${
                        ['posters', 'publications', 'displays', 'review'].indexOf(currentStep) >= index
                          ? 'text-blue-600'
                          : 'text-gray-500'
                      }`}
                    >
                      <span className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 bg-white">
                        {index + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {renderStep()}

            <div className="mt-8 flex justify-between">
              {currentStep !== 'posters' && (
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
                  className="ml-auto inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Terminer la configuration
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};