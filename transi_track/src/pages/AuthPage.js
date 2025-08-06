// src/pages/AuthPage.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { motion } from 'framer-motion';

// --- 1. DEFINE EL EMAIL DEL ADMINISTRADOR ---
const ADMIN_EMAIL = 'alexandergarcia212@outlook.com'; // Puedes cambiar esto por el email real

const AuthPage = ({ onAuthSuccess }) => {
  const navigate = useNavigate();

  // --- 2. AÑADE LA LÓGICA DE REDIRECCIÓN BASADA EN ROL ---
  const handleSuccess = (user) => {
    if (onAuthSuccess) {
      onAuthSuccess(user);
    }

    // Comprueba si el email del usuario es el del administrador
    if (user.email === ADMIN_EMAIL) {
      // Si es admin, lo redirige al dashboard de administrador
      navigate('/admin'); 
    } else {
      // Si es un usuario normal, lo redirige a la página principal de usuario
      navigate('/'); 
    }
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <AuthForm onAuthSuccess={handleSuccess} />
    </motion.div>
  );
};

export default AuthPage;