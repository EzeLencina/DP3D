import React from 'react';
import { Card } from '../ui/Card';

import type { User } from '../../types';

interface ImprimiendoProps {
    user: User;
}

export const Imprimiendo: React.FC<ImprimiendoProps> = ({ user }) => {
    const [orders, setOrders] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);

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
                setOrders(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
                setLoading(false);
            });
        })();
        return () => { if (unsub) unsub(); };
    }, [user]);

    // Filtrar pedidos en estado 'Imprimiendo'
    const imprimiendo = orders.filter(o => o.estadoPedido === 'Imprimiendo');

    return (
        <Card className="max-w-5xl w-full mx-auto">
            <div className="py-8 w-full">
                <h2 className="text-2xl font-bold text-white text-center mb-6">Pedidos Imprimiendo</h2>
                {loading ? (
                    <div className="text-center text-slate-400">Cargando pedidos...</div>
                ) : imprimiendo.length === 0 ? (
                    <div className="text-center text-slate-400">No hay pedidos imprimiendo.</div>
                ) : (
                    <div className="space-y-6">
                        {imprimiendo.map(order => (
                            <div key={order.id} className="rounded-lg p-4 bg-slate-900/80 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div className="flex flex-col md:flex-row md:items-center gap-3">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-white text-lg">{order.nombre}</span>
                                    </div>
                                    {order.fechaEntrega && (
                                        <div className="flex items-center gap-2">
                                            <span className="text-slate-300 text-sm">
                                                {order.fechaEntrega?.toDate?.().toLocaleDateString?.('es-AR') || order.fechaEntrega}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <button
                                    className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
                                    onClick={async () => {
                                        const { db } = await import('../../firebase');
                                        const { doc, updateDoc } = await import('firebase/firestore');
                                        await updateDoc(doc(db, 'orders', order.id), { estadoPedido: 'Historial' });
                                        setOrders(orders => orders.filter(o => o.id !== order.id));
                                    }}
                                >
                                    Completado
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Card>
    );
};
