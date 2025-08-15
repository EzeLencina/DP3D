import React, { useState } from "react";

export default function CostsEditor() {
  const [filamentCost, setFilamentCost] = useState(25000);
  const [laborCost, setLaborCost] = useState(850);
  const [washerCost, setWasherCost] = useState(7500);
  const [profitMargin, setProfitMargin] = useState(20);
  const [result, setResult] = useState<string>("");

  function saveCosts() {
    setResult(`Filamento: $${filamentCost}/kg, Mano de obra: $${laborCost}, Arandelas: $${washerCost}, Ganancia: ${profitMargin}%`);
  }

  return (
    <div>
      <h2>Costos Generales</h2>
      <input type="number" value={filamentCost} onChange={e => setFilamentCost(Number(e.target.value))} placeholder="Costo filamento/kg" />
      <input type="number" value={laborCost} onChange={e => setLaborCost(Number(e.target.value))} placeholder="Mano de obra" />
      <input type="number" value={washerCost} onChange={e => setWasherCost(Number(e.target.value))} placeholder="Costo arandelas" />
      <input type="number" value={profitMargin} onChange={e => setProfitMargin(Number(e.target.value))} placeholder="Ganancia (%)" />
      <button onClick={saveCosts}>Guardar</button>
      <div>{result}</div>
    </div>
  );
}
