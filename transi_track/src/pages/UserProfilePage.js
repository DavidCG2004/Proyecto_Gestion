// src/pages/UserProfilePage.js

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../utils/supabase';
// --- Iconos innecesarios eliminados ---
import { User, Lock } from 'lucide-react';

const UserProfilePage = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // --- Muestra un mensaje temporal ---
    const displayTempMessage = (setter, message) => {
        setter(message);
        setTimeout(() => setter(''), 5000); // El mensaje desaparece después de 5 segundos
    };

    const fetchProfile = async () => {
      setLoading(true);
      const { data, error: profileError } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        displayTempMessage(setError, profileError.message);
      } else if (data) {
        setUsername(data.username || '');
      }
      setLoading(false);
    };

    fetchProfile();
  }, [user.id]);

  const displayTempMessage = (setter, message) => {
    setter(message);
    setTimeout(() => setter(''), 5000);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    const { error: updateError } = await supabase
      .from('profiles')
      .upsert({ id: user.id, username, updated_at: new Date() });

    if (updateError) {
      displayTempMessage(setError, updateError.message);
    } else {
      displayTempMessage(setSuccessMessage, '¡Nombre de usuario actualizado con éxito!');
    }
    setLoading(false);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword.length > 0 && newPassword.length < 6) {
      displayTempMessage(setError, 'La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }
    setLoading(true);
    setError('');
    setSuccessMessage('');

    const { error: passwordError } = await supabase.auth.updateUser({ password: newPassword });

    if (passwordError) {
      displayTempMessage(setError, passwordError.message);
    } else {
      setNewPassword('');
      displayTempMessage(setSuccessMessage, '¡Contraseña cambiada con éxito!');
    }
    setLoading(false);
  };
  
  // --- FUNCIÓN handleDeleteAccount ELIMINADA ---

  return (
    <motion.div
      className="max-w-4xl mx-auto space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-4xl font-bold text-gray-900">Mi Perfil</h1>

      {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg" role="alert"><p>{error}</p></div>}
      {successMessage && <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg" role="alert"><p>{successMessage}</p></div>}

      {/* --- Formulario de Datos del Perfil --- */}
      <div className="p-8 bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-3xl shadow-xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center"><User className="mr-3" /> Datos del Perfil</h2>
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-gray-700 font-medium mb-1">Correo Electrónico</label>
            <input type="email" id="email" value={user.email} disabled className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-xl cursor-not-allowed"/>
          </div>
          <div>
            <label htmlFor="username" className="block text-gray-700 font-medium mb-1">Nombre de Usuario</label>
            <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30"/>
          </div>
          <div className="text-right">
            <motion.button type="submit" disabled={loading} className="px-6 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </motion.button>
          </div>
        </form>
      </div>

      {/* --- Formulario de Cambio de Contraseña --- */}
      <div className="p-8 bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-3xl shadow-xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center"><Lock className="mr-3" /> Cambiar Contraseña</h2>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label htmlFor="newPassword" className="block text-gray-700 font-medium mb-1">Nueva Contraseña</label>
            <input type="password" id="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30" placeholder="Mínimo 6 caracteres"/>
          </div>
          <div className="text-right">
            <motion.button type="submit" disabled={loading || !newPassword} className="px-6 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
            </motion.button>
          </div>
        </form>
      </div>
      
      {/* --- SECCIÓN DE ZONA DE PELIGRO ELIMINADA --- */}
      
    </motion.div>
  );
};

export default UserProfilePage;