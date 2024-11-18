import regression from 'regression';
import type { Display, Publication } from '../types';

// Prédiction des stocks
export const predictStockLevel = (publications: Publication[], days: number = 30) => {
  const stockHistory = publications.map((pub, index) => [index, pub.quantity]);
  const result = regression.linear(stockHistory);
  
  return Math.max(0, Math.round(result.predict(days)[1]));
};

// Calcul du taux de consommation
export const calculateConsumptionRate = (publications: Publication[]) => {
  if (publications.length < 2) return 0;
  
  const oldestQuantity = publications[0].quantity;
  const newestQuantity = publications[publications.length - 1].quantity;
  const daysDiff = publications.length;
  
  return (oldestQuantity - newestQuantity) / daysDiff;
};

// Prédiction de la date de réapprovisionnement
export const predictRestockDate = (publication: Publication) => {
  const consumptionRate = calculateConsumptionRate([publication]);
  if (consumptionRate <= 0) return null;
  
  const daysUntilMin = Math.round((publication.quantity - publication.minQuantity) / consumptionRate);
  const restockDate = new Date();
  restockDate.setDate(restockDate.getDate() + daysUntilMin);
  
  return restockDate;
};

// Prédiction des besoins de maintenance
export const predictMaintenanceNeeds = (display: Display) => {
  const lastMaintenance = new Date(display.lastMaintenance);
  const nextMaintenance = new Date(display.nextMaintenance);
  const maintenanceInterval = Math.round((nextMaintenance.getTime() - lastMaintenance.getTime()) / (1000 * 60 * 60 * 24));
  
  // Calculer le score de risque basé sur différents facteurs
  const riskFactors = {
    age: 0.3, // Poids pour l'âge du présentoir
    usage: 0.4, // Poids pour l'utilisation
    history: 0.3 // Poids pour l'historique des maintenances
  };
  
  const ageScore = Math.min(1, maintenanceInterval / 365); // Score basé sur l'âge
  const usageScore = display.publications ? Math.min(1, display.publications.length / 10) : 0;
  const historyScore = Math.random(); // Simulé pour la démo, à remplacer par des données réelles
  
  const riskScore = (
    ageScore * riskFactors.age +
    usageScore * riskFactors.usage +
    historyScore * riskFactors.history
  );
  
  return {
    riskScore,
    recommendedDate: new Date(lastMaintenance.getTime() + maintenanceInterval * 0.8 * 24 * 60 * 60 * 1000),
    factors: {
      age: ageScore,
      usage: usageScore,
      history: historyScore
    }
  };
};

// Suggestions d'optimisation des stocks
export const optimizeStockLevels = (publications: Publication[]) => {
  return publications.map(pub => {
    const avgConsumption = calculateConsumptionRate([pub]);
    const safetyStock = Math.ceil(avgConsumption * 7); // Stock de sécurité d'une semaine
    const recommendedMin = Math.max(pub.minQuantity, safetyStock);
    const recommendedMax = Math.ceil(recommendedMin * 1.5);
    
    return {
      ...pub,
      recommendations: {
        minStock: recommendedMin,
        maxStock: recommendedMax,
        restockPoint: Math.ceil(recommendedMin * 1.2)
      }
    };
  });
};