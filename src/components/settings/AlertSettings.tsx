import React, { useState } from 'react';
import { Bell, Save } from 'lucide-react';

interface AlertSetting {
  id: string;
  type: 'stock' | 'maintenance' | 'damage';
  name: string;
  threshold: number;
  enabled: boolean;
  notifyBy: ('email' | 'system')[];
}

const defaultSettings: AlertSetting[] = [
  {
    id: '1',
    type: 'stock',
    name: 'Alerte stock bas',
    threshold: 10,
    enabled: true,
    notifyBy: ['system', 'email']
  },
  {
    id: '2',
    type: 'maintenance',
    name: 'Rappel maintenance',
    threshold: 7,
    enabled: true,
    notifyBy: ['system']
  }
];

export const AlertSettings: React.FC = () => {
  const [settings, setSettings] = useState<AlertSetting[]>(defaultSettings);

  const handleToggle = (settingId: string) => {
    setSettings(settings.map(setting =>
      setting.id === settingId
        ? { ...setting, enabled: !setting.enabled }
        : setting
    ));
  };

  const handleNotificationChange = (settingId: string, type: 'email' | 'system') => {
    setSettings(settings.map(setting => {
      if (setting.id === settingId) {
        const notifyBy = setting.notifyBy.includes(type)
          ? setting.notifyBy.filter(t => t !== type)
          : [...setting.notifyBy, type];
        return { ...setting, notifyBy };
      }
      return setting;
    }));
  };

  const handleThresholdChange = (settingId: string, value: number) => {
    setSettings(settings.map(setting =>
      setting.id === settingId
        ? { ...setting, threshold: value }
        : setting
    ));
  };

  const handleSave = () => {
    // Sauvegarder dans le localStorage
    const domain = JSON.parse(localStorage.getItem('domain') || '{}');
    domain.alertSettings = settings;
    localStorage.setItem('domain', JSON.stringify(domain));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Configuration des alertes</h2>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Save className="w-4 h-4 mr-2 inline-block" />
          Enregistrer
        </button>
      </div>

      <div className="space-y-4">
        {settings.map((setting) => (
          <div key={setting.id} className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-full ${
                  setting.type === 'stock' ? 'bg-blue-100' :
                  setting.type === 'maintenance' ? 'bg-yellow-100' :
                  'bg-red-100'
                }`}>
                  <Bell className={`w-5 h-5 ${
                    setting.type === 'stock' ? 'text-blue-600' :
                    setting.type === 'maintenance' ? 'text-yellow-600' :
                    'text-red-600'
                  }`} />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{setting.name}</h3>
                  <div className="mt-2 space-y-3">
                    <div>
                      <label className="text-sm text-gray-600">Seuil d'alerte</label>
                      <input
                        type="number"
                        value={setting.threshold}
                        onChange={(e) => handleThresholdChange(setting.id, parseInt(e.target.value))}
                        className="ml-2 w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        min="0"
                      />
                      <span className="ml-2 text-sm text-gray-500">
                        {setting.type === 'stock' ? 'unités' : 'jours'}
                      </span>
                    </div>

                    <div className="flex items-center space-x-4">
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          checked={setting.notifyBy.includes('system')}
                          onChange={() => handleNotificationChange(setting.id, 'system')}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-600">
                          Notification système
                        </span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          checked={setting.notifyBy.includes('email')}
                          onChange={() => handleNotificationChange(setting.id, 'email')}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-600">
                          Notification email
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={setting.enabled}
                  onChange={() => handleToggle(setting.id)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-600">
                  Activer
                </span>
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};