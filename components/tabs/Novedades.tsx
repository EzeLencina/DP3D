import React from 'react';

export const Novedades: React.FC = () => {
    return (
        <div className="w-full p-6 bg-slate-800 rounded-lg shadow-lg mt-4">
            <h2 className="text-2xl font-bold text-brand-accent-400 mb-4">Novedades</h2>
            <ul className="list-disc pl-6 text-slate-200 space-y-2">
                <li>Agosto 2025: Sección de novedades agregada al nav y panel principal.</li>
                <li>Fix: Reseteo automático de inputs y resultados al agendar pedido.</li>
                <li>Fix: Solución de errores de tipado y contexto en la calculadora.</li>
                <li>Fix: Eliminación y reubicación de la sección novedades en el header y nav.</li>
                <li>Mejoras visuales: Reducción de márgenes y mayor ancho en cards de costos.</li>
                <li>Mejoras UX: Ocultación automática de resultados en la sección costos.</li>
                <li>Mejoras de navegación: Nueva pestaña "Novedades" al final del nav.</li>
                <li>Fix: Sincronización de reseteo entre calculadora y resultados usando contexto.</li>
                <li>Fix: Solución de errores de renderizado y recarga innecesaria.</li>
                <li>Próximamente: Edición dinámica de novedades y más funcionalidades.</li>
            </ul>
        </div>
    );
};
