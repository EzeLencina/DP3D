import React, { useState } from 'react';
import { EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { auth } from '../../firebase';
import { updatePassword, updateProfile } from 'firebase/auth';
import axios from 'axios';

interface AccountProps {
  user: { email: string };
  onClose?: () => void;
}

export const Account: React.FC<AccountProps> = ({ user, onClose }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [photo, setPhoto] = useState<string | null>(auth.currentUser?.photoURL || null);
  const [uploading, setUploading] = useState(false);
  const [changing, setChanging] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setChanging(true);
    try {
      if (auth.currentUser && auth.currentUser.email) {
        // Reautenticación
        const credential = EmailAuthProvider.credential(
          auth.currentUser.email,
          currentPassword
        );
        await reauthenticateWithCredential(auth.currentUser, credential);
        await updatePassword(auth.currentUser, newPassword);
        setMessage('Contraseña actualizada correctamente');
        setCurrentPassword('');
        setNewPassword('');
      }
    } catch (err: any) {
      setMessage(err.message || 'Error al actualizar la contraseña');
    }
    setChanging(false);
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploading(true);
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('file', file);
  formData.append('upload_preset', 'dp3d_profile');
      try {
        const res = await axios.post(
          'https://api.cloudinary.com/v1_1/ddjb5ywgp/image/upload',
          formData
        );
  const imageUrl = res.data.secure_url;
        setPhoto(imageUrl);
        // Guardar la URL en el perfil del usuario de Firebase
        if (auth.currentUser) {
          await updateProfile(auth.currentUser, { photoURL: imageUrl });
          setMessage('Foto de perfil actualizada');
        }
      } catch (err: any) {
        setMessage('Error al subir la foto');
      }
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
      <div className="bg-slate-900 rounded-xl shadow-lg p-8 w-full max-w-md flex flex-col items-center relative">
        {/* Botón cerrar (X) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white text-2xl font-bold focus:outline-none"
          aria-label="Cerrar"
        >
          ×
        </button>
        <div className="mb-6 flex flex-col items-center">
          <label htmlFor="profile-photo-upload" className="relative w-24 h-24 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden mb-2 cursor-pointer group">
            {photo ? (
              <img src={photo} alt="Foto de perfil" className="w-full h-full object-cover" />
            ) : (
              <span className="material-symbols-outlined text-5xl text-slate-400">person</span>
            )}
            {/* Overlay visual con ícono de cámara */}
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <span className="material-symbols-outlined text-white text-3xl">photo_camera</span>
            </div>
          </label>
          <input
            id="profile-photo-upload"
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="hidden"
            disabled={uploading}
          />
          <span className="text-xs text-slate-400 mt-1">Haz clic en la foto para cambiarla</span>
        </div>
        <h2 className="text-xl font-bold text-white mb-4">Mi cuenta</h2>
        <p className="mb-4 text-slate-300">{user.email}</p>
        <form onSubmit={handlePasswordChange} className="w-full flex flex-col gap-4">
          <input
            type="password"
            placeholder="Contraseña actual"
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
            className="bg-slate-700 border border-slate-600 text-white rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-brand-accent-500"
            required
            autoComplete="current-password"
          />
          <input
            type="password"
            placeholder="Nueva contraseña"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            className="bg-slate-700 border border-slate-600 text-white rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-brand-accent-500"
            required
            autoComplete="new-password"
          />
          <button
            type="submit"
            className="bg-brand-accent-600 hover:bg-brand-accent-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            disabled={uploading || changing}
          >
            {changing ? 'Cambiando...' : 'Cambiar contraseña'}
          </button>
        </form>
        <button
          onClick={() => {
            setMessage('Configuración guardada correctamente');
            if (onClose) onClose();
          }}
          className="mt-6 bg-brand-accent-500 hover:bg-brand-accent-700 text-white font-bold py-2 px-4 rounded-lg transition-colors w-full"
        >
          Guardar configuración
        </button>
        {message && <p className="mt-4 text-center text-brand-accent-400">{message}</p>}
      </div>
    </div>
  );
};
