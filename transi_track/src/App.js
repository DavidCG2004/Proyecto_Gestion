import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from './utils/supabase';

// --- COMPONENTES Y PÁGINAS ---
// Públicas
import LandingWrapper from './pages/LandingWrapper';
import AuthPage from './pages/AuthPage'; 
import Navbar from './components/Navbar';

// Páginas de Usuario
import HomePage from './pages/HomePage';
import UserRoutesPage from './pages/UserRoutesPage';
import UserCommentsPage from './pages/UserCommentsPage'; 
import UserNotificationsPage from './pages/UserNotificationsPage'; 
import UserProfilePage from './pages/UserProfilePage';// Importación de la nueva página de usuario

// Páginas de Administrador
import AdminRoutesPage from './pages/AdminRoutesPage';
import AdminCommentsPage from './pages/AdminCommentsPage';
import AdminNotificationsPage from './pages/AdminNotificationsPage'; // Importación de la nueva página de admin

// Constante para el email del administrador
const ADMIN_EMAIL = 'alexandergarcia212@outlook.com';

// Componente Layout para todas las páginas que requieren sesión y Navbar
const ProtectedLayout = ({ user, onLogout, isAdmin }) => (
  <>
    <Navbar user={user} onLogout={onLogout} isAdmin={isAdmin} />
    <main className="container mx-auto px-4 py-8 max-w-7xl">
      <Outlet /> {/* Aquí se renderizará la página hija (HomePage, AdminRoutesPage, etc.) */}
    </main>
  </>
);


const App = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Comprueba si hay una sesión activa al cargar la app
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Escucha cambios en el estado de autenticación (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    // Pantalla de carga mientras se verifica la sesión
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <motion.div 
            className="text-2xl font-semibold text-gray-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
        >
            Cargando aplicación...
        </motion.div>
      </div>
    );
  }

  // Determina si el usuario logueado es administrador
  const isAdmin = session?.user?.email === ADMIN_EMAIL;

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Rutas Públicas (disponibles solo si NO hay sesión) */}
          <Route path="/" element={!session ? <LandingWrapper /> : <Navigate to={isAdmin ? "/admin" : "/dashboard"} />} />
          <Route path="/auth" element={!session ? <AuthPage onAuthSuccess={(user) => setSession({ user })} /> : <Navigate to="/" />} />
          {/* Si hay sesión, usamos el ProtectedLayout para todas las rutas internas */}
          {session && (



 // ================== MODIFICACIÓN AQUÍ ==================
            <Route element={<ProtectedLayout user={session.user} onLogout={() => setSession(null)} isAdmin={isAdmin} />}>
              {/* Ruta de Perfil (común para admin y usuario) */}
              <Route path="/profile" element={<UserProfilePage user={session.user} />} />

              {isAdmin ? (
                // --- RUTAS ANIDADAS PARA EL ADMINISTRADOR ---
                <>
                  <Route path="/admin" element={<AdminRoutesPage />} />
                  <Route path="/admin/comments" element={<AdminCommentsPage user={session.user} />} />
                  <Route path="/admin/notifications" element={<AdminNotificationsPage />} />
                </>
              ) : (
                // --- RUTAS ANIDADAS PARA EL USUARIO ---
                <>
                  <Route path="/dashboard" element={<HomePage />} />
                  <Route path="/routes" element={<UserRoutesPage />} />
                  <Route path="/notifications" element={<UserNotificationsPage />} />
                  <Route path="/comments" element={<UserCommentsPage user={session.user} />} />
                </>
              )}
            </Route>
            // ================== FIN DE LA MODIFICACIÓN ==================



          )}

          {/* Redirección final para cualquier ruta no encontrada */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;