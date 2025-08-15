
import React, { useState } from 'react';
import { useCalculator } from '../../context/CalculatorContext';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import type { GeneralInputs } from '../../types';

export const GeneralCalculator: React.FC = () => {
    const { calculateGeneral, resetCalculator } = useCalculator();
    const [inputs, setInputs] = useState<GeneralInputs>({
        grams: 0,
        hours: 0,
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputs({ ...inputs, [e.target.name]: parseFloat(e.target.value) || 0 });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            calculateGeneral(inputs);
            setIsLoading(false);
        }, 500);
    };
    
    const handleReset = () => {
        setInputs({ grams: 0, hours: 0 });
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
                    />
                </div>
                <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-700">
                     <Button type="button" onClick={handleReset} variant="secondary" icon="refresh">
                        Resetear
                    </Button>
                    <Button type="submit" isLoading={isLoading} icon="calculate">
                        Calcular Costo y Precio
                    </Button>
                </div>
            </form>
        </Card>
    );
};
