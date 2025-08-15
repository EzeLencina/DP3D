import React, { useState } from "react";

export default function KeychainCalculator() {
  const [hoursPerBed, setHoursPerBed] = useState(0);
  const [filamentGramsPerBed, setFilamentGramsPerBed] = useState(0);
  const [keychainsPerBed, setKeychainsPerBed] = useState(0);
  const [numberOfBeds, setNumberOfBeds] = useState(0);
  const [colorCount, setColorCount] = useState(0);
  const [result, setResult] = useState<string>("");

  // Costos fijos simulados (puedes recibirlos por props o contexto)
  const filamentCost = 25000; // $ por kg
  const laborCost = 850; // $
  const washerCost = 7500; // $
  const profitMargin = 0.2; // 20%
  const washerQty = 100; // cantidad de arandelas
  const electricityCostPerKwh = 18.2;
  const printerPowerConsumption = 0.15; // kW

  function calculate() {
    if (!hoursPerBed || !filamentGramsPerBed || !keychainsPerBed || !numberOfBeds || !colorCount) {
      setResult("Completa todos los campos");
      return;
    }
    // Cálculos principales
    const totalFilamentUsed = filamentGramsPerBed * numberOfBeds;
    const totalPrintingHours = hoursPerBed * numberOfBeds;
    const totalItems = keychainsPerBed * numberOfBeds;
    // Costo de arandelas por unidad
    let washerUnitCost = washerCost / washerQty;
    washerUnitCost = washerUnitCost * 1.10; // con ganancia
    const totalWasherCost = washerUnitCost * totalItems;
    // Costo por colores
    let colorCostUnit = 0;
    if (colorCount === 2) colorCostUnit = 200;
    if (colorCount === 3) colorCostUnit = 300;
    if (colorCount === 4) colorCostUnit = 400;
    const colorCostTotal = colorCostUnit * keychainsPerBed * numberOfBeds;
    // Costo de filamento
    const filamentCostTotal = (totalFilamentUsed / 1000) * filamentCost;
    // Costo eléctrico
    const electricityCostTotal = totalPrintingHours * printerPowerConsumption * electricityCostPerKwh;
    // Costo de mano de obra
    const totalLaborCost = laborCost;

    // Cálculo de purga (volumen y densidad)
    const purgeMm = 100; // mm purgados por cambio (puedes hacerlo input)
    const purgeChanges = 9; // cantidad de cambios (puedes hacerlo input)
    const filamentDiameter = 1.75; // mm (puedes hacerlo input)
    const filamentDensity = 1.24; // g/cm³ (puedes hacerlo input)
    const radius = filamentDiameter / 2;
    const totalPurgeMm = purgeMm * purgeChanges;
    const purgeVolumeMm3 = Math.PI * Math.pow(radius, 2) * totalPurgeMm;
    const purgeVolumeCm3 = purgeVolumeMm3 / 1000;
    const purgeMassGrams = purgeVolumeCm3 * filamentDensity;
    const costPerGram = filamentCost / 1000;
    const totalPurgeCost = purgeMassGrams * costPerGram;

    // Costo total de producción
    const totalProductionCost = filamentCostTotal + totalLaborCost + totalWasherCost + electricityCostTotal + colorCostTotal + totalPurgeCost;
    // Precio final y ganancia
    const finalPrice = totalProductionCost + (totalProductionCost * profitMargin);
    const profit = finalPrice - totalProductionCost;
    const profitPercentage = (profit / totalProductionCost) * 100;
    // Costo por unidad: suma de todos los costos involucrados dividido por cantidad de unidades
    const costPerUnit = totalItems > 0
      ? (filamentCostTotal + totalLaborCost + totalWasherCost + electricityCostTotal + colorCostTotal + totalPurgeCost) / totalItems
      : 0;
    const printingDays = totalPrintingHours / 24;

    setResult(
      `Filamento: ${totalFilamentUsed}g\n` +
      `Horas: ${totalPrintingHours}\n` +
      `Unidades: ${totalItems}\n` +
      `Costo color: $${colorCostTotal}\n` +
      `Costo arandelas: $${totalWasherCost.toFixed(2)}\n` +
      `Costo filamento: $${filamentCostTotal.toFixed(2)}\n` +
      `Costo eléctrico: $${electricityCostTotal.toFixed(2)}\n` +
      `Mano de obra: $${totalLaborCost.toFixed(2)}\n` +
      `Costo purga: $${totalPurgeCost.toFixed(2)}\n` +
      `Costo total producción: $${totalProductionCost.toFixed(2)}\n` +
      `Precio final: $${finalPrice.toFixed(2)}\n` +
      `Ganancia: $${profit.toFixed(2)} (${profitPercentage.toFixed(2)}%)\n` +
      `Costo por unidad: $${costPerUnit.toFixed(2)}\n` +
      `Días de impresión: ${printingDays.toFixed(2)}`
    );
  }

  return (
    <div>
      <h2>Calculadora de Llaveros</h2>
      <input type="number" value={hoursPerBed} onChange={e => setHoursPerBed(Number(e.target.value))} placeholder="Horas por cama" />
      <input type="number" value={filamentGramsPerBed} onChange={e => setFilamentGramsPerBed(Number(e.target.value))} placeholder="Gramos por cama" />
      <input type="number" value={keychainsPerBed} onChange={e => setKeychainsPerBed(Number(e.target.value))} placeholder="Llaveros por cama" />
      <input type="number" value={numberOfBeds} onChange={e => setNumberOfBeds(Number(e.target.value))} placeholder="Camas a imprimir" />
      <select value={colorCount} onChange={e => setColorCount(Number(e.target.value))}>
        <option value={0}>Colores</option>
        <option value={2}>2</option>
        <option value={3}>3</option>
        <option value={4}>4</option>
      </select>
      <button onClick={calculate}>Calcular</button>
      <div>{result}</div>
    </div>
  );
}
