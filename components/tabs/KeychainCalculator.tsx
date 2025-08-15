import './KeychainCalculator.css';

import React, { useState } from 'react';
import { useCalculator } from '../../context/CalculatorContext';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import type { KeychainInputs } from '../../types';

export const KeychainCalculator: React.FC = () => {
    const { calculateKeychain, resetCalculator, state, updateCosts } = useCalculator();
    const [inputs, setInputs] = useState<KeychainInputs>({
        hoursPerBed: 0,
        gramsPerBed: 0,
        keychainsPerBed: 0,
        numberOfBeds: 0,
        colorCount: '',
    } as any);
    const [isLoading, setIsLoading] = useState(false);

    // Costos generales editables desde aquí
    const costs = state.costs;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type, checked } = e.target;
        if ([
            'filamentCostPerKg', 'laborCostPerHour', 'washerCost', 'washerQuantity', 'profitMargin',
            'purgeMm', 'purgeMmCost', 'mmPerGram', 'filamentDiameter', 'filamentDensity',
            'printerPowerWatts', 'electricityCostKwh'
        ].includes(name)) {
            updateCosts({ [name]: type === 'checkbox' ? checked : parseFloat(value) || 0 });
        } else if (name === 'washerProfit') {
            updateCosts({ washerProfit: checked });
        } else if (name === 'colorCount') {
            setInputs({ ...inputs, [name]: value });
        } else {
            setInputs({ ...inputs, [name]: parseFloat(value) || 0 });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            calculateKeychain(inputs);
            setIsLoading(false);
        }, 500);
    };

    const handleReset = () => {
        setInputs({
            hoursPerBed: 0,
            gramsPerBed: 0,
            keychainsPerBed: 0,
            numberOfBeds: 0,
            colorCount: 2,
        });
        resetCalculator();
    }

    return (
        <Card>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input label="Tiempo por Cama (horas)" id="hoursPerBed" name="hoursPerBed" type="number" min="0" step="0.01" value={inputs.hoursPerBed === 0 ? '' : inputs.hoursPerBed} onChange={handleChange} icon="timer" unit="hrs" required placeholder="0" />
                    <Input label="Gramos por Cama" id="gramsPerBed" name="gramsPerBed" type="number" min="0" step="0.1" value={inputs.gramsPerBed === 0 ? '' : inputs.gramsPerBed} onChange={handleChange} icon="scale" unit="g" required placeholder="0" />
                    <Input label="Llaveros por Cama" id="keychainsPerBed" name="keychainsPerBed" type="number" min="0" value={inputs.keychainsPerBed === 0 ? '' : inputs.keychainsPerBed} onChange={handleChange} icon="inventory" unit="un." required placeholder="0" />
                    <Input label="Cantidad de Camas" id="numberOfBeds" name="numberOfBeds" type="number" min="1" value={inputs.numberOfBeds === 0 ? '' : inputs.numberOfBeds} onChange={handleChange} icon="view_in_ar" unit="veces" required placeholder="0" />
                        <Select label="Cantidad de Colores" id="colorCount" name="colorCount" value={inputs.colorCount} onChange={handleChange} icon="palette" required containerClassName="md:col-span-2 custom-select-bg">
                            {inputs.colorCount === '' && (
                                <option value="" disabled hidden>Selecciona Cantidad de Colores</option>
                            )}
                            <option value="2">2 Colores</option>
                            <option value="3">3 Colores</option>
                            <option value="4">4 Colores</option>
                        </Select>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-700">
                    <Button type="button" onClick={handleReset} variant="secondary" icon="refresh">Resetear</Button>
                    <Button type="submit" isLoading={isLoading} icon="calculate">Calcular Costo</Button>
                </div>
            </form>
        </Card>
    );
};
