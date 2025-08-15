
import React from 'react';
import { useCalculator } from '../../context/CalculatorContext';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';

export const CostsEditor: React.FC = () => {
    const { state, updateCosts } = useCalculator();
    const { costs } = state;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const { checked } = e.target as HTMLInputElement;
            updateCosts({ [name]: checked });
        } else {
            // Si el input está vacío, guardar como vacío
            updateCosts({ [name]: value === '' ? '' : parseFloat(value) });
        }
    };

    return (
        <Card>
            <h2 className="text-xl font-bold text-white mb-6">Costos Generales</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <Input label="Costo Filamento" id="filamentCostPerKg" name="filamentCostPerKg" type="number" value={costs.filamentCostPerKg === 0 ? '' : costs.filamentCostPerKg} onChange={handleChange} icon="paid" unit="$" placeholder="0" />
                <Input label="Mano de Obra" id="laborCostPerHour" name="laborCostPerHour" type="number" value={costs.laborCostPerHour === 0 ? '' : costs.laborCostPerHour} onChange={handleChange} icon="engineering" unit="$" placeholder="0" />
                <Input label="Ganancia Deseada" id="profitMargin" name="profitMargin" type="number" value={costs.profitMargin === 0 ? '' : costs.profitMargin} onChange={handleChange} icon="trending_up" unit="%" placeholder="0" />

                <Input label="Consumo en Watts" id="printerPowerWatts" name="printerPowerWatts" type="number" value={costs.printerPowerWatts === 0 ? '' : costs.printerPowerWatts} onChange={handleChange} icon="bolt" unit="W" placeholder="0" />
                <Input label="Costo kW/h" id="electricityCostKwh" name="electricityCostKwh" type="number" value={costs.electricityCostKwh === 0 ? '' : costs.electricityCostKwh} onChange={handleChange} icon="electric_meter" unit="$" placeholder="0" />

                <Input label="Costo Arandelas" id="washerCost" name="washerCost" type="number" value={costs.washerCost === 0 ? '' : costs.washerCost} onChange={handleChange} icon="toll" unit="$" placeholder="0" />
                <div className="flex flex-col sm:flex-row items-end gap-2 w-full">
                    <Select label="Cantidad" id="washerQuantity" name="washerQuantity" value={costs.washerQuantity} onChange={handleChange} icon="inventory_2">
                        {[50, 100, 150, 200, 250, 300, 350, 400, 450, 500].map(q => <option key={q} value={q}>{q} un.</option>)}
                    </Select>
                </div>
                <div>
                    <Select label="Ganancia Arandelas" id="washerProfitSelect" name="washerProfitSelect" value={costs.washerProfit ? 'si' : 'no'} onChange={e => updateCosts({ washerProfit: e.target.value === 'si' })} icon="trending_up">
                        <option value="si">Sí</option>
                        <option value="no">No</option>
                    </Select>
                </div>
                <div>
                    <Input label="Porcentaje General" id="washerProfitPercent" name="washerProfitPercent" type="number" min="0" max="100" value={costs.washerProfitPercent === 0 ? '' : String(costs.washerProfitPercent)} onChange={e => updateCosts({ washerProfitPercent: e.target.value === '' ? '' : parseFloat(e.target.value) })} icon="percent" unit="%" placeholder="0" />
                </div>

                <h3 className="text-lg font-semibold text-white mt-4 md:col-span-2 lg:col-span-3">Costos de Purga</h3>
                <Input label="Purga de filamento" id="purgeMm" name="purgeMm" type="number" value={costs.purgeMm === 0 ? '' : costs.purgeMm} onChange={handleChange} icon="recycling" unit="mm" placeholder="0"/>
                <Input label="Costo por mm purgado" id="purgeMmCost" name="purgeMmCost" type="number" value={costs.purgeMmCost === 0 ? '' : costs.purgeMmCost} onChange={handleChange} icon="paid" unit="$" placeholder="0"/>
                <Input label="Cambios de filamento" id="purgeChangesCount" name="purgeChangesCount" type="number" value={costs.purgeChangesCount === 0 ? '' : costs.purgeChangesCount} onChange={handleChange} icon="swap_horiz" placeholder="0" />
                
                <h3 className="text-lg font-semibold text-white mt-4 md:col-span-2 lg:col-span-3">Especificaciones de Filamento</h3>
                <Input label="Diámetro" id="filamentDiameter" name="filamentDiameter" type="number" step="0.01" value={costs.filamentDiameter === 0 ? '' : costs.filamentDiameter} onChange={handleChange} icon="straighten" unit="mm" placeholder="0" />
                <Input label="Densidad" id="filamentDensity" name="filamentDensity" type="number" step="0.01" value={costs.filamentDensity === 0 ? '' : costs.filamentDensity} onChange={handleChange} icon="density_medium" unit="g/cm³" placeholder="0" />
                <Input label="mm por gramo" id="mmPerGram" name="mmPerGram" type="number" value={costs.mmPerGram === 0 ? '' : costs.mmPerGram} onChange={handleChange} icon="tune" unit="mm/g" placeholder="0" />

            </div>
        </Card>
    );
};
