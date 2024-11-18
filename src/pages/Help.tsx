import React, { useState } from 'react';
import { ArrowLeft, Book, Calculator, Bell, Wrench, QrCode, BarChart, HelpCircle, ChevronDown, ChevronRight, Smartphone } from 'lucide-react';

interface HelpProps {
  onBack: () => void;
}

interface HelpSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

export const Help: React.FC<HelpProps> = ({ onBack }) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const helpSections: HelpSection[] = [
    {
      id: 'overview',
      title: "Vue d'ensemble",
      icon: <Book className="w-5 h-5" />,
      content: (
        <div className="space-y-4">
          <p>
            Gest'Prez est un système complet de gestion des présentoirs et publications. Il permet de :
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Gérer les présentoirs et leur emplacement</li>
            <li>Suivre les stocks de publications</li>
            <li>Planifier la maintenance</li>
            <li>Générer des QR codes pour l'accès public</li>
          </ul>
        </div>
      )
    },
    {
      id: 'public-interface',
      title: "Interface publique",
      icon: <Smartphone className="w-5 h-5" />,
      content: (
        <div className="space-y-6">
          <h3 className="font-medium text-lg">Réservation d'un présentoir</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <img 
              src="https://images.unsplash.com/photo-1557568192-2fafc8b5bdc9?w=800&auto=format&fit=crop&q=60"
              alt="Interface de réservation"
              className="rounded-lg shadow-sm w-full"
            />
            <p className="mt-2 text-sm text-gray-600">
              Interface de réservation accessible via QR code. Permet de :
            </p>
            <ul className="mt-2 list-disc pl-5 space-y-1 text-sm text-gray-600">
              <li>Choisir les dates de début et fin</li>
              <li>Indiquer si c'est un prêt permanent</li>
              <li>Renseigner les informations de contact</li>
            </ul>
          </div>

          <h3 className="font-medium text-lg mt-8">Mise à jour du stock</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <img 
              src="https://images.unsplash.com/photo-1557568192-2fafc8b5bdc9?w=800&auto=format&fit=crop&q=60"
              alt="Interface de mise à jour du stock"
              className="rounded-lg shadow-sm w-full"
            />
            <p className="mt-2 text-sm text-gray-600">
              Interface de gestion du stock accessible via QR code. Permet de :
            </p>
            <ul className="mt-2 list-disc pl-5 space-y-1 text-sm text-gray-600">
              <li>Mettre à jour les quantités de publications</li>
              <li>Signaler un stock bas</li>
              <li>Demander un réapprovisionnement</li>
            </ul>
          </div>

          <h3 className="font-medium text-lg mt-8">Signalement d'utilisation</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <img 
              src="https://images.unsplash.com/photo-1557568192-2fafc8b5bdc9?w=800&auto=format&fit=crop&q=60"
              alt="Interface de signalement d'utilisation"
              className="rounded-lg shadow-sm w-full"
            />
            <p className="mt-2 text-sm text-gray-600">
              Interface de signalement accessible via QR code. Permet de :
            </p>
            <ul className="mt-2 list-disc pl-5 space-y-1 text-sm text-gray-600">
              <li>Indiquer le nombre d'utilisations sur 30 jours</li>
              <li>Ajouter des commentaires sur l'utilisation</li>
              <li>Signaler des problèmes ou besoins</li>
            </ul>
          </div>
        </div>
      )
    },
    // ... autres sections existantes ...
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Retour au tableau de bord
          </button>
          <div className="flex items-center">
            <HelpCircle className="w-5 h-5 text-blue-600 mr-2" />
            <h1 className="text-2xl font-bold text-gray-900">Centre d'aide</h1>
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="divide-y divide-gray-200">
            {helpSections.map((section) => (
              <div key={section.id} className="p-6">
                <button
                  onClick={() => setExpandedSection(
                    expandedSection === section.id ? null : section.id
                  )}
                  className="w-full flex items-center justify-between text-left"
                >
                  <div className="flex items-center">
                    <div className="mr-4">{section.icon}</div>
                    <h2 className="text-lg font-medium text-gray-900">
                      {section.title}
                    </h2>
                  </div>
                  {expandedSection === section.id ? (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-500" />
                  )}
                </button>
                {expandedSection === section.id && (
                  <div className="mt-4 pl-9 pr-4">
                    {section.content}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};