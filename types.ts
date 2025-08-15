export type TabId =
    'keychain'
    | 'general'
    | 'costs'
    | 'orders'
    | 'encola'
    | 'imprimiendo'
    | 'historial'
    | 'novedades';

export interface Tab {
    id: TabId;
    label: string;
    icon: string;
}

export interface CostSettings {
    filamentCostPerKg: number;
    laborCostPerHour: number;
    washerCost: number;
    washerQuantity: number;
    washerProfit: boolean;
    washerProfitPercent: string | number;
    profitMargin: number;
    purgeMm: number;
    purgeMmCost: number;
    purgeChangesCount: number;
    mmPerGram: number;
    filamentDiameter: number;
    filamentDensity: number;
    printerPowerWatts: number;
    electricityCostKwh: number;
}

export interface KeychainInputs {
    hoursPerBed: number;
    gramsPerBed: number;
    keychainsPerBed: number;
    numberOfBeds: number;
    colorCount: number;
}

export interface GeneralInputs {
    grams: number;
    hours: number;
}

export interface CalculationResults {
    totalCost: number;
    totalKeychains: number;
    totalFilamentUsed: number;
    totalPrintingHours: number;
    printingDays: number;
    costPerUnit: number;
    filamentCost: number;
    purgeChanges: number;
    purgeCost: number;
    colorChangeCost: number;
    washerCost: number;
    productionCost: number;
    electricityCost: number;
    laborCost: number;
    profitPercentage: number;
    totalProfit: number;
    finalPrice: number;
}

export interface User {
    email: string;
    // Add other user properties if needed
}

export interface Order {
    id: string;
    customerName: string;
    customerWhatsapp: string;
    customerInstagram?: string;
    customerEmail?: string;
    deliveryDate: string;
    calculationResults: CalculationResults;
    createdAt: Date;
}
