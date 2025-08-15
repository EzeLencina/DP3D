import React, { useState } from "react";

export default function GeneralCalculator() {
  const [generalGrams, setGeneralGrams] = useState(0);
  const [generalHours, setGeneralHours] = useState(0);
  const [result, setResult] = useState<string>("");

  function calculate() {
    if (!generalGrams || !generalHours) {
      setResult("Completa todos los campos");
      return;
    }
    setResult(`Filamento usado: ${generalGrams}g, Horas: ${generalHours}`);
  }

  return (
    <div>
      <h2>Calculadora General</h2>
      <input type="number" value={generalGrams} onChange={e => setGeneralGrams(Number(e.target.value))} placeholder="Gramos de filamento" />
      <input type="number" value={generalHours} onChange={e => setGeneralHours(Number(e.target.value))} placeholder="Horas de impresión" />
      <button onClick={calculate}>Calcular</button>
      <div>{result}</div>
    </div>
  );
}
