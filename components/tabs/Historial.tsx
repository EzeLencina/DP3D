import React from 'react';
import jsPDF from 'jspdf';
import { Card } from '../ui/Card';

import type { User } from '../../types';

interface HistorialProps {
    user: User;
}

export const Historial: React.FC<HistorialProps> = ({ user }) => {
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

    // Filtrar pedidos en estado 'Historial'
    const historial = orders.filter(o => o.estadoPedido === 'Historial');

        // Eliminar pedido del historial
        const handleDelete = async (orderId: string) => {
            const { db } = await import('../../firebase');
            const { doc, deleteDoc } = await import('firebase/firestore');
            await deleteDoc(doc(db, 'orders', orderId));
            setOrders(orders => orders.filter(o => o.id !== orderId));
        };

    return (
    <Card className="w-full">
            <div className="py-8">
                <h2 className="text-2xl font-bold text-white text-center mb-6">Historial de pedidos</h2>
                {loading ? (
                    <div className="text-center text-slate-400">Cargando pedidos...</div>
                ) : historial.length === 0 ? (
                    <div className="text-center text-slate-400">No hay pedidos históricos.</div>
                ) : (
                    <div className="space-y-6">
                        {historial.map(order => (
                            <div key={order.id} className="rounded-lg p-4 bg-slate-900/80 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div className="flex flex-col gap-1">
                                    <div className="font-bold text-white text-lg">{order.nombre}</div>
                                    <div className="text-white text-sm">
                                        {order.fechaEntrega?.toDate?.() ? order.fechaEntrega.toDate().toLocaleDateString('es-AR') : (order.fechaEntrega || (order.createdAt?.toDate?.() ? order.createdAt.toDate().toLocaleDateString('es-AR') : order.createdAt || '-'))}
                                    </div>
                                </div>
                                <div className="flex flex-row gap-3">
                                    <button
                                        className="bg-green-500 hover:bg-green-600 text-white font-semibold px-3 h-10 rounded-lg transition-colors text-sm w-full"
                                        onClick={() => {
                                            if(order.whatsapp){
                                                let numero = order.whatsapp.replace(/\D/g, '');
                                                if(numero.length < 10){
                                                    alert('El número de WhatsApp debe estar en formato internacional, por ejemplo: 5491123456789');
                                                    return;
                                                }
                                                const mensaje = `¡Hola ${order.nombre}! Tu pedido está listo y pronto será despachado. Te avisaremos cuando esté disponible para retirar.`;
                                                window.open(`https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`, '_blank');
                                            }else{
                                                alert('No hay número de teléfono disponible para este cliente.');
                                            }
                                        }}
                                    >
                                        Avisar por WhatsApp
                                    </button>
                                    <button
                                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-3 h-10 rounded-lg transition-colors text-sm w-full"
                                        onClick={() => {
                                            const doc = new jsPDF();
                                            doc.setFontSize(16);
                                            doc.text('Remito / Factura', 20, 20);
                                            doc.setFontSize(12);
                                            doc.text(`Cliente: ${order.nombre}`, 20, 35);
                                            doc.text(`WhatsApp: ${order.whatsapp || '-'}`, 20, 42);
                                            doc.text(`Mail: ${order.mail || '-'}`, 20, 49);
                                            doc.text(`Instagram: ${order.instagram || '-'}`, 20, 56);
                                            doc.text(`Fecha de entrega: ${order.fechaEntrega?.toDate?.().toLocaleDateString?.('es-AR') || order.fechaEntrega || '-'}`, 20, 63);
                                            doc.text(`Descripción: ${order.descripcionProducto || '-'}`, 20, 70);
                                            doc.text(`Precio final: ${order.results?.finalPrice ? `$${order.results.finalPrice}` : '-'}`, 20, 77);
                                            doc.text('¡Gracias por tu compra!', 20, 90);
                                            doc.save(`remito_${order.nombre}.pdf`);
                                            const destinatario = order.mail || '';
                                            const asunto = encodeURIComponent('Factura de compra - Tu pedido');
                                            const cuerpo = encodeURIComponent(`Hola ${order.nombre},\nTu factura está lista. ¡Gracias por tu compra!`);
                                            window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${destinatario}&su=${asunto}&body=${cuerpo}`,'_blank');
                                        }}
                                    >
                                        Enviar factura
                                    </button>
                                       <button
                                           className="bg-red-600 hover:bg-red-700 text-white font-semibold px-3 h-10 rounded-lg transition-colors text-sm w-full"
                                           onClick={() => handleDelete(order.id)}
                                       >
                                           Eliminar
                                       </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Card>
    );
};
