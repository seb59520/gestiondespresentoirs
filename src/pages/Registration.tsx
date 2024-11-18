import React, { useState } from 'react';
import { Eye, EyeOff, Mail, User, Lock, Building2 } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../utils/auth';
import { useAtom } from 'jotai';
import { authStateAtom } from '../store/authStore';
import { checkAssemblyId } from '../utils/assembly';

export const Registration: React.FC = () => {
  const navigate = useNavigate();
  const [, setAuthState] = useAtom(authStateAtom);
  const [step, setStep] = useState<'assembly-check' | 'user-info'>('assembly-check');
  const [assemblyId, setAssemblyId] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleAssemblyCheck = async () => {
    try {
      setIsLoading(true);
      setErrors({});

      if (!assemblyId.trim()) {
        setErrors({ assemblyId: 'L\'ID d\'assemblée est requis' });
        return;
      }

      const exists = await checkAssemblyId(assemblyId);
      if (exists) {
        // L'assemblée existe, passer à l'inscription de l'utilisateur
        setStep('user-info');
      } else {
        // L'assemblée n'existe pas, rediriger vers la création
        navigate('/setup', { state: { assemblyId } });
      }
    } catch (error) {
      setErrors({ assemblyId: 'Erreur lors de la vérification de l\'ID d\'assemblée' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      if (step === 'assembly-check') {
        await handleAssemblyCheck();
      } else {
        // Créer l'utilisateur
        const user = await register(formData.email, formData.password, {
          firstName: formData.firstName,
          lastName: formData.lastName,
          assemblyId
        });

        // Mettre à jour l'état d'authentification
        setAuthState({
          isAuthenticated: true,
          user,
          loading: false
        });

        // Rediriger vers le tableau de bord
        navigate('/', { replace: true });
      }
    } catch (error) {
      setErrors({ submit: error instanceof Error ? error.message : 'Une erreur est survenue' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-4xl font-extrabold text-center text-blue-600 mb-8">
          Gest'Prez
        </h1>
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          {step === 'assembly-check' ? 'Rejoindre une assemblée' : 'Créer votre compte'}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 'assembly-check' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  ID de l'assemblée
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building2 className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={assemblyId}
                    onChange={(e) => setAssemblyId(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Entrez l'ID de votre assemblée"
                    required
                  />
                </div>
                {errors.assemblyId && (
                  <p className="mt-2 text-sm text-red-600">{errors.assemblyId}</p>
                )}
                <p className="mt-2 text-sm text-gray-500">
                  Si vous n'avez pas d'ID d'assemblée, vous serez redirigé vers la création d'une nouvelle assemblée.
                </p>
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Prénom
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nom
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Mot de passe
                  </label>
                  <div className="mt-1 relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="block w-full rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}

            {errors.submit && (
              <div className="rounded-md bg-red-50 p-4">
                <p className="text-sm text-red-700">{errors.submit}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Chargement...' : 
               step === 'assembly-check' ? 'Vérifier' : 'Créer le compte'}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Ou</span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/login"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Retour à la connexion
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};