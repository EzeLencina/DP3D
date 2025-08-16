import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, addDoc, query, orderBy, onSnapshot, Timestamp, deleteDoc, doc } from 'firebase/firestore';
interface NovedadesProps {
    user: { email: string; admin?: boolean };
}

export const Novedades: React.FC<NovedadesProps> = ({ user }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [updates, setUpdates] = useState<any[]>([]);

    useEffect(() => {
        const q = query(collection(db, 'updates'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setUpdates(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        return () => unsubscribe();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        try {
            await addDoc(collection(db, 'updates'), {
                title,
                description,
                createdAt: Timestamp.now(),
                author: user?.email,
            });
            setTitle('');
            setDescription('');
            setMessage('Novedad publicada correctamente');
        } catch (err: any) {
            setMessage('Error al publicar la novedad');
        }
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('¿Seguro que deseas eliminar esta novedad?')) return;
        try {
            await deleteDoc(doc(db, 'updates', id));
        } catch (err) {
            alert('Error al eliminar la novedad');
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto mt-8">
            {/* Formulario solo para admin */}
            {user?.admin && (
                <div className="bg-slate-800 rounded-lg p-6 mb-8 shadow">
                    <h2 className="text-xl font-bold mb-4 text-white">Publicar novedades</h2>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <input
                            type="text"
                            placeholder="Título de la novedad"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            className="bg-slate-700 border border-slate-600 text-white rounded-lg p-2"
                            required
                        />
                        <textarea
                            placeholder="Descripción"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            className="bg-slate-700 border border-slate-600 text-white rounded-lg p-2"
                            rows={4}
                            required
                        />
                        <button
                            type="submit"
                            className="bg-brand-accent-600 hover:bg-brand-accent-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                            disabled={loading}
                        >
                            {loading ? 'Publicando...' : 'Subir'}
                        </button>
                    </form>
                    {message && <p className="mt-4 text-brand-accent-400">{message}</p>}
                </div>
            )}
            {/* Título centrado para todos los usuarios */}
            <div className="w-full flex justify-center mb-6">
                <div className="bg-slate-800 rounded-lg px-8 py-4 shadow w-full max-w-2xl">
                    <h2 className="text-3xl font-bold text-brand-accent-400 text-center" style={{ fontFamily: 'DM Sans, sans-serif' }}>Novedades</h2>
                </div>
            </div>
            {/* Novedades para todos los usuarios */}
            <div className="flex flex-col gap-6">
                {updates.map(update => {
                    let fecha = '';
                    if (update.createdAt && typeof update.createdAt.toDate === 'function') {
                        const d = update.createdAt.toDate();
                        fecha = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth()+1).toString().padStart(2, '0')}/${d.getFullYear()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
                    }
                    return (
                        <div key={update.id} className="bg-slate-800 rounded-lg p-6 shadow flex items-start gap-2">
                            <div className="flex-1">
                                <div className="font-bold text-brand-accent-400 text-lg" style={{ fontFamily: 'DM Sans, sans-serif' }}>{update.title}</div>
                                <div className="h-3" />
                                <pre className="whitespace-pre-wrap break-words text-slate-200" style={{ fontFamily: 'DM Sans, sans-serif' }}>{update.description}</pre>
                                <span className="ml-2 text-xs text-slate-400">{fecha}</span>
                            </div>
                            {user?.admin && (
                                <button
                                    onClick={() => handleDelete(update.id)}
                                    className="ml-2 px-2 py-1 text-xs bg-red-600 hover:bg-red-800 text-white rounded"
                                    title="Eliminar novedad"
                                >
                                    Eliminar
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
