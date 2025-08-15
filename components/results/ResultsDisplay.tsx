
import React from 'react';
import { useCalculator } from '../../context/CalculatorContext';
import { Card } from '../ui/Card';
import { Icon } from '../ui/Icon';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

const ResultRow: React.FC<{ icon: string; label: string; value: string; isVisible?: boolean, className?: string }> = ({ icon, label, value, isVisible = true, className = 'text-white' }) => {
    if (!isVisible) return null;
    return (
        <div className="flex items-center justify-between py-3">
            <span className="flex items-center gap-3 text-sm text-slate-300">
                <Icon name={icon} className="text-slate-400" />
                {label}
            </span>
            <span className={`font-semibold text-sm ${className}`}>{value}</span>
        </div>
    );
};

import type { User } from '../../types';

interface ResultsDisplayProps {
    user: User;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ user }) => {
    const { state, resetCalculator, resetInputs } = useCalculator();
    const { results, isCalculated } = state;
    const [modalOpen, setModalOpen] = React.useState(false);
    const [form, setForm] = React.useState({
        nombre: '',
        whatsapp: '',
        mail: '',
        instagram: '',
        fechaEntrega: ''
    });
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState('');
    const formatCurrency = (value: number) => {
        return value.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });
    };

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        setError('');
        if (!user?.email) {
            setError('Debes iniciar sesión para agendar un pedido.');
            return;
        }
        if (!form.nombre.trim() || !form.whatsapp.trim() || !form.fechaEntrega.trim()) {
            setError('Por favor completa los campos obligatorios.');
            return;
        }
        setLoading(true);
        try {
            const { db } = await import('../../firebase');
            const { collection, addDoc, Timestamp } = await import('firebase/firestore');
            const docRef = await addDoc(collection(db, 'orders'), {
                ...form,
                fechaEntrega: Timestamp.fromDate(new Date(form.fechaEntrega)),
                createdAt: Timestamp.now(),
                results,
                userEmail: user.email.trim().toLowerCase(),
                estadoPedido: 'Pendiente',
            });
            console.log('Pedido guardado correctamente con ID:', docRef.id);
            setModalOpen(false);
            setForm({ nombre: '', whatsapp: '', mail: '', instagram: '', fechaEntrega: '' });
            // Limpiar resultados y inputs de la calculadora
            if (typeof resetCalculator === 'function') resetCalculator();
            if (typeof resetInputs === 'function') resetInputs();
        } catch (err) {
            setError('Error al guardar el pedido.');
            console.error('Error al guardar el pedido:', err);
        }
        setLoading(false);
    };

    if (!isCalculated) {
        return (
            <Card className="sticky top-8" style={{ height: '410px' }}>
                <div className="text-center py-16">
                    <Icon name="calculate" className="text-6xl text-slate-500 mx-auto" />
                    <h3 className="mt-4 text-xl font-bold text-white">Resultados</h3>
                    <p className="mt-2 text-slate-400">Completa un cálculo para ver los resultados aquí.</p>
                </div>
            </Card>
        );
    }

    return (
        <>
        <Card className="sticky top-8">
            <h2 className="text-2xl font-bold text-center text-white">Precio de Venta Sugerido</h2>
            <div className="text-center my-4">
                <span className="text-5xl font-extrabold text-brand-accent-400">
                    {formatCurrency(results.finalPrice)}
                </span>
            </div>
            <div className="divide-y divide-slate-700/50">
                <ResultRow icon="inventory" label="Costo total de producción" value={formatCurrency(results.productionCost)} />
                <ResultRow icon="bolt" label="Costo Eléctrico" value={formatCurrency(results.electricityCost)} />
                <ResultRow icon="engineering" label="Mano de Obra" value={formatCurrency(results.laborCost)} />
                <ResultRow icon="paid" label="Ganancia total" value={formatCurrency(results.totalProfit)} className="text-green-400" />
            </div>

            <div className="mt-6 pt-6">
                <h3 className="text-lg font-semibold text-white mb-2">Desglose Detallado</h3>
                <div className="divide-y divide-slate-700/50">
                     <ResultRow icon="timer" label="Tiempo Total de Impresión" value={`${results.totalPrintingHours.toFixed(2)} h`} />
                     <ResultRow icon="calendar_month" label="Días de impresión" value={`${results.printingDays.toFixed(2)}`} />
                     <ResultRow icon="scale" label="Filamento Total Usado" value={`${results.totalFilamentUsed.toFixed(2)} g`} />
                     <ResultRow icon="monetization_on" label="Costo de Filamento" value={formatCurrency(results.filamentCost)} />
                     <ResultRow icon="swap_horiz" label="Cambios de Filamento" value={`${results.purgeChanges}`} isVisible={results.purgeChanges > 0} />
                     <ResultRow icon="recycling" label="Costo de purga" value={formatCurrency(results.purgeCost)} isVisible={results.purgeCost > 0} />
                     <ResultRow icon="colors" label="Costo Por Cambio de Color" value={formatCurrency(results.colorChangeCost)} isVisible={results.colorChangeCost > 0} />
                     <ResultRow icon="toll" label="Costo de arandelas" value={formatCurrency(results.washerCost)} isVisible={results.washerCost > 0}/>
                     <ResultRow icon="key" label="Cantidad Total de Llaveros" value={`${results.totalKeychains}`} isVisible={results.totalKeychains > 0} />
                     <ResultRow icon="attach_money" label="Costo por unidad" value={formatCurrency(results.costPerUnit)} isVisible={results.costPerUnit > 0} />
                     <ResultRow icon="trending_up" label="Rentabilidad" value={`${results.profitPercentage.toFixed(2)}%`} />
                </div>
            </div>
            <Button className="mt-8" icon="add_shopping_cart" onClick={() => setModalOpen(true)}>
                Agendar Pedido
            </Button>
        </Card>
        {/* Modal para agendar pedido */}
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Agendar Pedido" size="md">
            <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
                <div>
                    <label className="block text-sm text-white mb-1">Nombre del cliente *</label>
                    <input type="text" name="nombre" value={form.nombre} onChange={handleInput} required className="w-full px-3 py-2 rounded bg-slate-800 text-white" />
                </div>
                <div>
                    <label className="block text-sm text-white mb-1">WhatsApp *</label>
                    <input type="text" name="whatsapp" value={form.whatsapp} onChange={handleInput} required className="w-full px-3 py-2 rounded bg-slate-800 text-white" />
                </div>
                <div>
                    <label className="block text-sm text-white mb-1">Mail</label>
                    <input type="email" name="mail" value={form.mail} onChange={handleInput} className="w-full px-3 py-2 rounded bg-slate-800 text-white" />
                </div>
                <div>
                    <label className="block text-sm text-white mb-1">Instagram</label>
                    <input type="text" name="instagram" value={form.instagram} onChange={handleInput} className="w-full px-3 py-2 rounded bg-slate-800 text-white" />
                </div>
                <div>
                    <label className="block text-sm text-white mb-1">Fecha de entrega *</label>
                    <input type="date" name="fechaEntrega" value={form.fechaEntrega} onChange={handleInput} required className="w-full px-3 py-2 rounded bg-slate-800 text-white" />
                </div>
                <div>
                    <label className="block text-sm text-white mb-1">Descripción del producto</label>
                    <textarea name="descripcionProducto" value={form.descripcionProducto} onChange={handleInput} className="w-full px-3 py-2 rounded bg-slate-800 text-white resize-none" rows={2} placeholder="Ejemplo: Maceta, llavero, figura, etc." />
                </div>
                {error && <div className="text-red-400 text-sm">{error}</div>}
                <div className="flex justify-end gap-2 mt-4">
                    <Button type="button" className="bg-slate-700" onClick={() => setModalOpen(false)}>Cancelar</Button>
                    <Button type="submit" icon="check" disabled={loading}>{loading ? 'Guardando...' : 'Confirmar'}</Button>
                </div>
            </form>
        </Modal>
        </>
    );
};
