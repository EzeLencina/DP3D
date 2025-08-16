
import React, { useState } from 'react';
import { useCurrency } from '../../context/CurrencyContext';
import { useCalculator } from '../../context/CalculatorContext';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import type { GeneralInputs } from '../../types';

export const GeneralCalculator: React.FC = () => {
    const { calculateGeneral, resetCalculator } = useCalculator();
    // import { useCurrency } from '../../context/CurrencyContext';
    const { country, rate } = useCurrency();
    // Función para mostrar el costo convertido
    const formatCurrency = (value: number) => {
        return value.toLocaleString('es-ES', { style: 'currency', currency: country.code });
    }
    const [inputs, setInputs] = useState<GeneralInputs>({
        grams: '',
        hours: '',
    } as any);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputs({ ...inputs, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            calculateGeneral({
                grams: parseFloat(inputs.grams) || 0,
                hours: parseFloat(inputs.hours) || 0,
            });
            setIsLoading(false);
        }, 500);
    };
    
    const handleReset = () => {
        setInputs({ grams: '', hours: '' });
        resetCalculator();
    };

    return (
        <Card>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                        label="Gramos de Filamento Usado"
                        id="grams"
                        name="grams"
                        type="number"
                        min="0"
                        step="0.1"
                        value={inputs.grams}
                        onChange={handleChange}
                        icon="scale"
                        unit="g"
                        required
                        placeholder="0"
                    />
                    <Input
                        label="Horas Totales de Impresión"
                        id="hours"
                        name="hours"
                        type="number"
                        min="0"
                        step="0.01"
                        value={inputs.hours}
                        onChange={handleChange}
                        icon="timer"
                        unit="hrs"
                        required
                        placeholder="0"
                    />
                </div>
                <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-700">
                     <Button type="button" onClick={handleReset} variant="secondary" icon="refresh">
                        Resetear
                    </Button>
                    <Button type="submit" isLoading={isLoading} icon="calculate">
                        Calcular Costo
                    </Button>
                </div>
            </form>
        </Card>
    );
};
