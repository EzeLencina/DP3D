import React from 'react';
import { Card } from '../ui/Card';
import { Icon } from '../ui/Icon';

export const EnCola: React.FC = () => {
    const [deleteId, setDeleteId] = React.useState<string|null>(null);
    const [showConfirm, setShowConfirm] = React.useState(false);

    const handleDelete = async (orderId: string) => {
        const { db } = await import('../../firebase');
        const { doc, deleteDoc } = await import('firebase/firestore');
        await deleteDoc(doc(db, 'orders', orderId));
        setOrders(orders => orders.filter(o => o.id !== orderId));
        setShowConfirm(false);
        setDeleteId(null);
    };
    const [orders, setOrders] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        let unsub: any;
        (async () => {
            const { db } = await import('../../firebase');
            const { collection, onSnapshot, query, orderBy } = await import('firebase/firestore');
            const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
            unsub = onSnapshot(q, (snap) => {
                setOrders(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
                setLoading(false);
            });
        })();
        return () => { if (unsub) unsub(); };
    }, []);

    // Filtrar pedidos en estado 'Imprimiendo'
    const enCola = orders.filter(o => o.estadoPedido === 'Imprimiendo');

    return (
        <Card className="max-w-5xl w-full mx-auto">
            <div className="py-8 w-full">
                <h2 className="text-2xl font-bold text-white text-center mb-6">Pedidos en cola</h2>
                {loading ? (
                    <div className="text-center text-slate-400">Cargando pedidos...</div>
                ) : enCola.length === 0 ? (
                    <div className="text-center text-slate-400">No hay pedidos en cola.</div>
                ) : (
                    <div className="space-y-6">
                        {enCola.map(order => (
                            <div key={order.id} className="rounded-lg p-4 bg-slate-900/80 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div className="flex flex-col md:flex-row md:items-center gap-3">
                                    <div className="flex items-center gap-2">
                                        <Icon name="person" className="text-slate-400" />
                                        <span className="font-semibold text-white text-lg">{order.nombre}</span>
                                    </div>
                                    {order.fechaEntrega && (
                                        <div className="flex items-center gap-2">
                                            <Icon name="calendar_month" className="text-brand-accent-400" />
                                            <span className="text-slate-300 text-sm">
                                                {order.fechaEntrega?.toDate?.().toLocaleDateString?.('es-AR') || order.fechaEntrega}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        className="bg-brand-accent-600 hover:bg-brand-accent-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
                                        onClick={async () => {
                                            const { db } = await import('../../firebase');
                                            const { doc, updateDoc } = await import('firebase/firestore');
                                            await updateDoc(doc(db, 'orders', order.id), { estadoPedido: 'Imprimiendo' });
                                            setOrders(orders => orders.filter(o => o.id !== order.id));
                                        }}
                                    >
                                        Imprimir
                                    </button>
                                    <button
                                        className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
                                        onClick={() => { setDeleteId(order.id); setShowConfirm(true); }}
                                    >
                                        Eliminar
                                    </button>
                                </div>
    {/* Pop-up de confirmación de eliminación */}
    {showConfirm && (
    <div className="fixed inset-0 bg-slate-900/90 flex items-center justify-center z-50 rounded-lg">
            <div className="bg-slate-800 rounded-lg p-6 shadow-lg w-full max-w-xs text-center">
                <h3 className="text-lg font-bold text-white mb-4">¿Seguro que quiere eliminar?</h3>
                <div className="flex justify-center gap-4 mt-2">
                    <button
                        className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg"
                        onClick={() => deleteId && handleDelete(deleteId)}
                    >
                        Sí
                    </button>
                    <button
                        className="bg-slate-600 hover:bg-slate-700 text-white font-semibold px-4 py-2 rounded-lg"
                        onClick={() => { setShowConfirm(false); setDeleteId(null); }}
                    >
                        No
                    </button>
                </div>
            </div>
        </div>
    )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Card>
    );
};
