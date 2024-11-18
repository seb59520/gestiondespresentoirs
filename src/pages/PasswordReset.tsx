import React, { useState } from 'react';
import { ArrowLeft, Mail, AlertTriangle, Check } from 'lucide-react';
import { resetPassword } from '../utils/auth';

interface PasswordResetProps {
  onBack: () => void;
}

export const PasswordReset: React.FC<PasswordResetProps> = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setError('');

    try {
      await resetPassword(email);
      setStatus('success');
    } catch (err) {
      console.error('Erreur lors de la réinitialisation:', err);
      setError('Une erreur est survenue. Vérifiez votre email et réessayez.');
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Réinitialiser votre mot de passe
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Nous vous enverrons un email avec les instructions
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {status === 'success' ? (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Email envoyé</h3>
              <p className="mt-1 text-sm text-gray-500">
                Vérifiez votre boîte mail pour réinitialiser votre mot de passe.
              </p>
              <div className="mt-6">
                <button
                  onClick={onBack}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Retour à la connexion
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Adresse email
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">{error}</h3>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={onBack}
                  className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-500"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Retour
                </button>
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    status === 'loading' ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {status === 'loading' ? 'Envoi...' : 'Envoyer les instructions'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};