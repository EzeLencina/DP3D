
import React, { createContext, useContext, useReducer, useCallback } from 'react';
import type { CostSettings, KeychainInputs, GeneralInputs, CalculationResults } from '../types';
import { INITIAL_COSTS, INITIAL_RESULTS } from '../constants';

interface CalculatorState {
    costs: CostSettings;
    results: CalculationResults;
    isCalculated: boolean;
}

type Action =
    | { type: 'UPDATE_COSTS'; payload: Partial<CostSettings> }
    | { type: 'CALCULATE_KEYCHAIN'; payload: KeychainInputs }
    | { type: 'CALCULATE_GENERAL'; payload: GeneralInputs }
    | { type: 'RESET' };

const initialState: CalculatorState = {
    costs: INITIAL_COSTS,
    results: INITIAL_RESULTS,
    isCalculated: false,
};

const reducer = (state: CalculatorState, action: Action): CalculatorState => {
    switch (action.type) {
        case 'UPDATE_COSTS':
            return { ...state, costs: { ...state.costs, ...action.payload } };
        case 'CALCULATE_KEYCHAIN': {
            const inputs = action.payload;
            const costs = state.costs;

            // Datos base
            const totalKeychains = inputs.keychainsPerBed * inputs.numberOfBeds;
            const totalPrintingHours = inputs.hoursPerBed * inputs.numberOfBeds;
            const totalFilamentUsed = inputs.gramsPerBed * inputs.numberOfBeds;

            // Cálculo de filamento
            const filamentCost = (totalFilamentUsed / 1000) * costs.filamentCostPerKg;

            // Mano de obra: usar el valor fijo ingresado, no multiplicar por horas
            const laborCost = costs.laborCostPerHour;

            // Electricidad (por kWh, potencia en W)
            const printerPowerKw = costs.printerPowerWatts / 1000;
            const electricityCost = totalPrintingHours * printerPowerKw * costs.electricityCostKwh;

            // Cálculo de purga (como en JS: mm purgados * cantidad de cambios * costo por mm)
            const purgeMm = costs.purgeMm || 0;
            const purgeChanges = costs.purgeChangesCount || 0;
            // Calcular costo por mm purgado en base al costo de filamento y mm por gramo
            const mmPerGram = costs.mmPerGram || 1;
            const costPerMm = mmPerGram > 0 ? costs.filamentCostPerKg / 1000 / mmPerGram : 0;
            const purgeCost = purgeMm * costPerMm * purgeChanges;

            // Costo por cambio de color (como en JS)
            let colorChangeCostUnit = 0;
            if (inputs.colorCount === 2) colorChangeCostUnit = 200;
            else if (inputs.colorCount === 3) colorChangeCostUnit = 300;
            else if (inputs.colorCount === 4) colorChangeCostUnit = 400;
            const colorChangeCost = colorChangeCostUnit * inputs.keychainsPerBed * inputs.numberOfBeds;

            // Cálculo de arandelas
            const costPerWasher = costs.washerCost / costs.washerQuantity;
            const washerUnitCost = costs.washerProfit ? costPerWasher * 1.10 : costPerWasher;
            const washerCost = totalKeychains * washerUnitCost;

            // Costo de producción total
            const productionCost = filamentCost + purgeCost + washerCost + colorChangeCost;
            const totalBaseCost = productionCost + electricityCost + laborCost;
            const totalProfit = totalBaseCost * (costs.profitMargin / 100);
            const finalPrice = totalBaseCost + totalProfit;

            // Costo por unidad: suma de todos los costos involucrados dividido por cantidad de unidades
            const costPerUnit = totalKeychains > 0
                ? (filamentCost + laborCost + washerCost + electricityCost + purgeCost + colorChangeCost) / totalKeychains
                : 0;

            const newResults: CalculationResults = {
                totalKeychains,
                totalPrintingHours,
                totalFilamentUsed,
                printingDays: totalPrintingHours / 24,
                costPerUnit,
                filamentCost,
                purgeChanges,
                purgeCost,
                colorChangeCost,
                washerCost,
                productionCost,
                electricityCost,
                laborCost,
                profitPercentage: costs.profitMargin,
                totalProfit,
                finalPrice,
                totalCost: finalPrice, // for main display
            };
            return { ...state, results: newResults, isCalculated: true };
        }
        case 'CALCULATE_GENERAL': {
            const inputs = action.payload;
            const costs = state.costs;
            
            const filamentCost = (inputs.grams / 1000) * costs.filamentCostPerKg;
            const electricityCost = (inputs.hours * costs.printerPowerWatts / 1000) * costs.electricityCostKwh;
            const laborCost = inputs.hours * costs.laborCostPerHour;
            
            // In general calc, purge is based on manual input from costs section
            const purgeCost = costs.purgeChangesCount * costs.purgeMm * costs.purgeMmCost;

            const productionCost = filamentCost + purgeCost;
            const totalBaseCost = productionCost + electricityCost + laborCost;
            const totalProfit = totalBaseCost * (costs.profitMargin / 100);
            const finalPrice = totalBaseCost + totalProfit;
            
            const newResults: CalculationResults = {
                ...INITIAL_RESULTS, // reset keychain specific fields
                totalFilamentUsed: inputs.grams,
                totalPrintingHours: inputs.hours,
                printingDays: inputs.hours / 24,
                filamentCost,
                purgeChanges: costs.purgeChangesCount,
                purgeCost,
                productionCost,
                electricityCost,
                laborCost,
                profitPercentage: costs.profitMargin,
                totalProfit,
                finalPrice,
                totalCost: finalPrice,
            };
            return { ...state, results: newResults, isCalculated: true };
        }
        case 'RESET':
            return { ...state, results: INITIAL_RESULTS, isCalculated: false };
        default:
            return state;
    }
};

interface CalculatorContextType {
    state: CalculatorState;
    dispatch: React.Dispatch<Action>;
    updateCosts: (payload: Partial<CostSettings>) => void;
    calculateKeychain: (payload: KeychainInputs) => void;
    calculateGeneral: (payload: GeneralInputs) => void;
    resetCalculator: () => void;
    resetInputs?: () => void;
    setResetInputs?: (fn: () => void) => void;
}

const CalculatorContext = createContext<CalculatorContextType | undefined>(undefined);

export const CalculatorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const updateCosts = useCallback((payload: Partial<CostSettings>) => {
        dispatch({ type: 'UPDATE_COSTS', payload });
    }, []);

    const calculateKeychain = useCallback((payload: KeychainInputs) => {
        dispatch({ type: 'CALCULATE_KEYCHAIN', payload });
    }, []);

    const calculateGeneral = useCallback((payload: GeneralInputs) => {
        dispatch({ type: 'CALCULATE_GENERAL', payload });
    }, []);

    const resetCalculator = useCallback(() => {
        dispatch({ type: 'RESET' });
    }, []);

    // Referencia para resetear los inputs desde fuera
    const resetInputsRef = React.useRef<() => void>();
    const setResetInputs = (fn: () => void) => {
        resetInputsRef.current = fn;
    };
    const resetInputs = () => {
        if (resetInputsRef.current) resetInputsRef.current();
    };

    return (
        <CalculatorContext.Provider value={{ state, dispatch, updateCosts, calculateKeychain, calculateGeneral, resetCalculator, resetInputs, setResetInputs }}>
            {children}
        </CalculatorContext.Provider>
    );
};

export const useCalculator = (): CalculatorContextType => {
    const context = useContext(CalculatorContext);
    if (!context) {
        throw new Error('useCalculator must be used within a CalculatorProvider');
    }
    return context;
};
