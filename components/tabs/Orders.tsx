import React from 'react';
import type { User } from '../../types';
import { Card } from '../ui/Card';
import { Icon } from '../ui/Icon';

interface OrdersProps {
    user: User;
}

export const Orders: React.FC<OrdersProps> = ({ user }) => {
    const [orders, setOrders] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [estadoSelect, setEstadoSelect] = React.useState<{[id:string]:string}>({});
    const estadosPedido = ["En cola", "Imprimiendo", "Completado"];
    const estadosPago = ["Pendiente", "Abonado"];

    React.useEffect(() => {
        let unsub: any;
        (async () => {
            const { db } = await import('../../firebase');
            const { collection, onSnapshot, query, orderBy, where } = await import('firebase/firestore');
            const q = query(
                collection(db, 'orders'),
                where('userEmail', '==', user.email),
                orderBy('createdAt', 'desc')
            );
            unsub = onSnapshot(q, (snap) => {
                const nuevos = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setOrders(nuevos);
                setEstadoSelect(
                    prev => {
                        const obj: {[id:string]:string} = {};
                        nuevos.forEach(order => {
                            obj[order.id] = (order as any).estadoPedido || estadosPedido[0];
                        });
                        return obj;
                    }
                );
                setLoading(false);
            });
        })();
        return () => { if (unsub) unsub(); };
    }, [user]);

    const handleEstadoChange = async (orderId: string, estado: string, confirmar = false) => {
    if (estado === 'Imprimiendo' && !confirmar) return;
    const { db } = await import('../../firebase');
    const { doc, updateDoc } = await import('firebase/firestore');
    await updateDoc(doc(db, 'orders', orderId), { estadoPedido: estado });
    setOrders(orders => orders.map(o => o.id === orderId ? { ...o, estadoPedido: estado } : o));
    };

    const handlePagoChange = async (orderId: string, estado: string) => {
        const { db } = await import('../../firebase');
        const { doc, updateDoc } = await import('firebase/firestore');
        await updateDoc(doc(db, 'orders', orderId), { estadoPago: estado });
        setOrders(orders => orders.map(o => o.id === orderId ? { ...o, estadoPago: estado } : o));
    };

    // Filtrar solo pedidos pendientes
    const pedidosPendientes = orders.filter(order => order.estadoPedido === 'Pendiente');

    return (
        <div className="flex justify-center w-full">
            <div className="bg-slate-800/50 rounded-xl shadow-lg p-6 sm:p-8 backdrop-blur-sm max-w-3xl w-full mx-auto">
                    <div className="py-8 w-full">
                <h2 className="text-2xl font-bold text-white text-center mb-6">Pedidos</h2>
                {loading ? (
                    <div className="text-center text-slate-400">Cargando pedidos...</div>
                ) : pedidosPendientes.length === 0 ? (
                    <div className="text-center text-slate-400">No hay pedidos pendientes.</div>
                ) : (
                    <div className="space-y-6">
                        {pedidosPendientes.map(order => (
                            <div key={order.id} className="border border-slate-700 rounded-lg p-4 bg-slate-900/80 w-full">
                                <div className="flex items-center gap-3 mb-2">
                                    <Icon name="person" className="text-slate-400" />
                                    <span className="font-semibold text-white text-lg">{order.nombre}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-sm text-slate-300 mb-2">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-1">
                                            <Icon name="whatsapp" className="text-brand-accent-400" />
                                            <span>{order.whatsapp}</span>
                                        </div>
                                        {order.instagram && (
                                            <div className="flex items-center gap-1">
                                                <Icon name="instagram" className="text-brand-accent-500" />
                                                <span>{order.instagram}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        {order.mail && (
                                            <div className="flex items-center gap-1">
                                                <Icon name="mail" className="text-brand-accent-400" />
                                                <span>{order.mail}</span>
                                            </div>
                                        )}
                                        {order.fechaEntrega && (
                                            <div className="flex items-center gap-1 mt-1">
                                                <Icon name="calendar_month" className="text-brand-accent-400" />
                                                <span>
                                                    {order.fechaEntrega?.toDate?.().toLocaleDateString?.('es-AR') || order.fechaEntrega}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-4 mb-2">
                                    <div className="flex flex-col w-full md:flex-row md:items-end gap-2">
                                        <div className="flex flex-row gap-2 w-full">
                                            <button
                                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition w-full flex items-center justify-center"
                                                style={{height: '31px'}}
                                                onClick={() => handleEstadoChange(order.id, 'En cola', true)}
                                                disabled={order.estadoPedido === 'En cola'}
                                            >
                                                En Cola
                                            </button>
                                            <button
                                                className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition w-full flex items-center justify-center"
                                                style={{height: '31px'}}
                                                onClick={() => handleEstadoChange(order.id, 'Imprimiendo', true)}
                                                disabled={order.estadoPedido === 'Imprimiendo'}
                                            >
                                                Imprimiendo
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-2 text-slate-200">
                                    <strong>Resumen:</strong>
                                    <ul className="list-disc ml-6 mt-1 text-slate-300">
                                        <li>Precio final: <span className="font-bold text-brand-accent-400">{order.results?.finalPrice?.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}</span></li>
                                        <li>Cantidad: {order.results?.totalKeychains}</li>
                                        <li>Filamento usado: {order.results?.totalFilamentUsed?.toFixed(2)} g</li>
                                        <li>Días impresión: {order.results?.printingDays?.toFixed(2)}</li>
                                    </ul>
                                </div>
                                {/* Descripción del producto debajo del resumen */}
                                <div className="mb-2">
                                    <label className="block text-xs text-slate-400 mb-1">Descripción del producto</label>
                                    <textarea
                                        className="bg-slate-800 border border-slate-700 rounded px-3 py-2 text-slate-200 text-sm min-h-[4.5rem] w-full resize-none"
                                        value={order.descripcionProducto || ''}
                                        onChange={e => {
                                            const { db } = require('../../firebase');
                                            const { doc, updateDoc } = require('firebase/firestore');
                                            updateDoc(doc(db, 'orders', order.id), { descripcionProducto: e.target.value });
                                        }}
                                        placeholder="Ejemplo: Maceta, llavero, figura, etc."
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
        </div>
    );
};
