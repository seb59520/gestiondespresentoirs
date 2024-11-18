import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface DisclaimerModalProps {
  onAccept: () => void;
  onDecline: () => void;
}

export const DisclaimerModal: React.FC<DisclaimerModalProps> = ({
  onAccept,
  onDecline
}) => {
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-lg w-full p-6">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-yellow-100 mx-auto">
          <AlertTriangle className="h-6 w-6 text-yellow-600" />
        </div>

        <div className="mt-3 text-center sm:mt-5">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Confirmation importante
          </h3>
          <div className="mt-4">
            <p className="text-sm text-gray-500">
              En créant une nouvelle assemblée, vous confirmez :
            </p>
            <ul className="mt-4 text-left text-sm text-gray-600 space-y-3">
              <li className="flex items-start">
                <span className="font-medium mr-2">1.</span>
                Avoir l'autorisation officielle de gérer les présentoirs de cette assemblée
              </li>
              <li className="flex items-start">
                <span className="font-medium mr-2">2.</span>
                Être responsable de la gestion et de la maintenance des présentoirs
              </li>
              <li className="flex items-start">
                <span className="font-medium mr-2">3.</span>
                Vous engager à maintenir à jour les informations sur la plateforme
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex justify-center space-x-4">
          <button
            type="button"
            onClick={onDecline}
            className="inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Je décline
          </button>
          <button
            type="button"
            onClick={onAccept}
            className="inline-flex justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            J'accepte et je continue
          </button>
        </div>
      </div>
    </div>
  );
};