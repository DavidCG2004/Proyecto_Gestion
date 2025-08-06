// src/components/AuthForm.js

import React, { useState } from 'react';
// --- 1. Importa useNavigate y el ícono de flecha ---
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../utils/supabase';
import { Mail, Lock, UserPlus, LogIn, ArrowLeft } from 'lucide-react'; // Añade ArrowLeft

const AuthForm = ({ onAuthSuccess }) => {
  // --- 2. Inicializa el hook de navegación ---
  const navigate = useNavigate();
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let authResponse;
      if (isLogin) {
        authResponse = await supabase.auth.signInWithPassword({ email, password });
      } else {
        authResponse = await supabase.auth.signUp({ email, password });
      }

      const { data, error: authError } = authResponse;

      if (authError) {
        throw authError;
      }

      if (data.user) {
        onAuthSuccess(data.user);
      } else {
        setError('Revisa tu correo para confirmar tu cuenta.');
      }
    } catch (err) {
      setError(err.message || 'Ocurrió un error inesperado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      // --- 3. Añade 'relative' para posicionar el botón de volver ---
      className="relative bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-3xl p-8 shadow-xl max-w-md w-full mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* --- 4. AÑADE EL BOTÓN PARA VOLVER A LA LANDING PAGE --- */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-5 left-5 text-gray-500 hover:text-gray-900 transition-colors duration-200 p-2 rounded-full hover:bg-gray-100"
        aria-label="Volver a la página de inicio"
      >
        <ArrowLeft size={24} />
      </button>

      <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-blue-600 to-purple-700 bg-clip-text text-transparent">
        {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
      </h2>

      {error && (
        <motion.p
          className="bg-red-100 text-red-700 p-3 rounded-xl mb-4 text-sm text-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {error}
        </motion.p>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="email"
            placeholder="Correo Electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-300 text-gray-900"
            required
          />
        </div>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-300 text-gray-900"
            required
          />
        </div>

        <motion.button
          type="submit"
          className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={loading}
        >
          {loading ? (
            'Cargando...'
          ) : isLogin ? (
            <>
              <LogIn size={20} /> Iniciar Sesión
            </>
          ) : (
            <>
              <UserPlus size={20} /> Registrarse
            </>
          )}
        </motion.button>
      </form>

      <p className="text-center text-gray-600 mt-6">
        {isLogin ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'}{' '}
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-blue-600 hover:underline font-medium"
        >
          {isLogin ? 'Regístrate aquí' : 'Inicia Sesión'}
        </button>
      </p>
    </motion.div>
  );
};

export default AuthForm;