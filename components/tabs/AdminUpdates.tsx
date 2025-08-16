import React, { useState } from 'react';
import { db } from '../../firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

interface AdminUpdatesProps {
  onUpdate?: () => void;
}

const AdminUpdates: React.FC<AdminUpdatesProps> = ({ onUpdate }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await addDoc(collection(db, 'updates'), {
        title,
        description,
        createdAt: Timestamp.now(),
      });
      setTitle('');
      setDescription('');
      setMessage('Actualización publicada correctamente');
      if (onUpdate) onUpdate();
    } catch (err: any) {
      setMessage('Error al publicar la actualización');
    }
    setLoading(false);
  };

  return (
    <div className="bg-slate-800 rounded-lg p-6 mb-8 shadow">
      <h2 className="text-xl font-bold mb-4 text-white">Publicar actualización</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Título de la actualización"
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
          {loading ? 'Publicando...' : 'Publicar'}
        </button>
      </form>
      {message && <p className="mt-4 text-brand-accent-400">{message}</p>}
    </div>
  );
};

export default AdminUpdates;
