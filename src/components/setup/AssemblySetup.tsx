import React from 'react';
import { Building2, MapPin } from 'lucide-react';

interface AssemblySetupProps {
  data: {
    name: string;
    description: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  onChange: (data: any) => void;
}

export const AssemblySetup: React.FC<AssemblySetupProps> = ({ data, onChange }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-medium text-gray-900">Informations de l'assemblée</h2>
          <p className="mt-1 text-sm text-gray-500">
            Renseignez les informations de base de votre assemblée
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nom de l'assemblée
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building2 className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={data.name}
                  onChange={(e) => onChange({ ...data, name: e.target.value })}
                  className="block w-full pl-10 rounded-md border-gray-300"
                  placeholder="Ex: Assemblée de Paris"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={data.description}
                onChange={(e) => onChange({ ...data, description: e.target.value })}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300"
                placeholder="Description de votre assemblée..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Adresse
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={data.address}
                  onChange={(e) => onChange({ ...data, address: e.target.value })}
                  className="block w-full pl-10 rounded-md border-gray-300"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Code postal
                </label>
                <input
                  type="text"
                  value={data.postalCode}
                  onChange={(e) => onChange({ ...data, postalCode: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Ville
                </label>
                <input
                  type="text"
                  value={data.city}
                  onChange={(e) => onChange({ ...data, city: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Pays
              </label>
              <select
                value={data.country}
                onChange={(e) => onChange({ ...data, country: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300"
              >
                <option value="France">France</option>
                <option value="Belgique">Belgique</option>
                <option value="Suisse">Suisse</option>
                <option value="Canada">Canada</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};