import React, { useState } from 'react';
import { Calendar, Save } from 'lucide-react';

interface MaintenanceCycle {
  id: string;
  name: string;
  intervalDays: number;
  description: string;
  tasks: string[];
}

const defaultCycles: MaintenanceCycle[] = [
  {
    id: '1',
    name: 'Maintenance standard',
    intervalDays: 30,
    description: 'Vérification mensuelle de l\'état général',
    tasks: [
      'Vérification de la structure',
      'Nettoyage',
      'Contrôle des affiches'
    ]
  },
  {
    id: '2',
    name: 'Maintenance approfondie',
    intervalDays: 90,
    description: 'Inspection trimestrielle complète',
    tasks: [
      'Inspection structurelle détaillée',
      'Remplacement des éléments usés',
      'Vérification des fixations',
      'Test de stabilité'
    ]
  }
];

export const MaintenanceSettings: React.FC = () => {
  const [cycles, setCycles] = useState<MaintenanceCycle[]>(defaultCycles);
  const [editingCycle, setEditingCycle] = useState<MaintenanceCycle | null>(null);

  const handleSave = (cycle: MaintenanceCycle) => {
    if (editingCycle) {
      setCycles(cycles.map(c => c.id === cycle.id ? cycle : c));
    } else {
      setCycles([...cycles, { ...cycle, id: Date.now().toString() }]);
    }
    setEditingCycle(null);

    // Sauvegarder dans le localStorage
    const domain = JSON.parse(localStorage.getItem('domain') || '{}');
    domain.maintenanceCycles = cycles;
    localStorage.setItem('domain', JSON.stringify(domain));
  };

  const handleDelete = (cycleId: string) => {
    setCycles(cycles.filter(c => c.id !== cycleId));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Cycles de maintenance</h2>
        <button
          onClick={() => setEditingCycle({
            id: '',
            name: '',
            intervalDays: 30,
            description: '',
            tasks: []
          })}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Nouveau cycle
        </button>
      </div>

      <div className="grid gap-6">
        {cycles.map((cycle) => (
          <div key={cycle.id} className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{cycle.name}</h3>
                <div className="mt-1 flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-1" />
                  Intervalle: {cycle.intervalDays} jours
                </div>
                <p className="mt-2 text-sm text-gray-600">{cycle.description}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setEditingCycle(cycle)}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Modifier
                </button>
                <button
                  onClick={() => handleDelete(cycle.id)}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Supprimer
                </button>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700">Tâches:</h4>
              <ul className="mt-2 space-y-1">
                {cycle.tasks.map((task, index) => (
                  <li key={index} className="text-sm text-gray-600">
                    • {task}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {editingCycle && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {editingCycle.id ? 'Modifier le cycle' : 'Nouveau cycle'}
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSave(editingCycle);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nom du cycle
                </label>
                <input
                  type="text"
                  value={editingCycle.name}
                  onChange={(e) => setEditingCycle({ ...editingCycle, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Intervalle (jours)
                </label>
                <input
                  type="number"
                  value={editingCycle.intervalDays}
                  onChange={(e) => setEditingCycle({ ...editingCycle, intervalDays: parseInt(e.target.value) })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={editingCycle.description}
                  onChange={(e) => setEditingCycle({ ...editingCycle, description: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tâches
                </label>
                <div className="mt-2 space-y-2">
                  {editingCycle.tasks.map((task, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={task}
                        onChange={(e) => {
                          const newTasks = [...editingCycle.tasks];
                          newTasks[index] = e.target.value;
                          setEditingCycle({ ...editingCycle, tasks: newTasks });
                        }}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newTasks = editingCycle.tasks.filter((_, i) => i !== index);
                          setEditingCycle({ ...editingCycle, tasks: newTasks });
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        Supprimer
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setEditingCycle({
                      ...editingCycle,
                      tasks: [...editingCycle.tasks, '']
                    })}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    + Ajouter une tâche
                  </button>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingCycle(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Save className="w-4 h-4 mr-2 inline-block" />
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};