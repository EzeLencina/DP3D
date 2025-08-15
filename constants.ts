import type { Tab, CostSettings, CalculationResults } from './types';

export const TABS: Tab[] = [
    { id: 'keychain', label: 'Llaveros', icon: 'key' },
    { id: 'general', label: 'General', icon: 'category' },
    { id: 'costs', label: 'Costos', icon: 'receipt_long' },
    { id: 'orders', label: 'Pedidos', icon: 'inventory_2' },
    { id: 'encola', label: 'En cola', icon: 'pending_actions' },
    { id: 'imprimiendo', label: 'Imprimiendo', icon: 'print' }, // Nueva pestaña
];

export const INITIAL_COSTS: CostSettings = {
    filamentCostPerKg: 25000,
    laborCostPerHour: 850,
    washerCost: 7500,
    washerQuantity: 100,
    washerProfit: false,
    washerProfitPercent: 10,
    profitMargin: 20,
    purgeMm: 70, // Example value
    purgeMmCost: 2.5, // Example cost per mm
    purgeChangesCount: 0,
    mmPerGram: 330, // Example for PLA
    filamentDiameter: 1.75,
    filamentDensity: 1.24,
    printerPowerWatts: 250, // Average printer power
    electricityCostKwh: 50, // Example cost
};

export const INITIAL_RESULTS: CalculationResults = {
    totalCost: 0,
    totalKeychains: 0,
    totalFilamentUsed: 0,
    totalPrintingHours: 0,
    printingDays: 0,
    costPerUnit: 0,
    filamentCost: 0,
    purgeChanges: 0,
    purgeCost: 0,
    colorChangeCost: 0,
    washerCost: 0,
    productionCost: 0,
    electricityCost: 0,
    laborCost: 0,
    profitPercentage: 0,
    totalProfit: 0,
    finalPrice: 0,
};
