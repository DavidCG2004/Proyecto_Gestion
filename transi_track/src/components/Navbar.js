import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bus, Route, Bell, MessageSquare, LogOut, ChevronDown, Wrench, Users, UserCircle } from 'lucide-react';
import { supabase } from '../utils/supabase';

// Componente NavLink (sin cambios)
const NavLink = ({ to, icon: Icon, label }) => (
  <Link
    to={to}
    className="flex items-center gap-2 px-3 py-2 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors duration-200"
  >
    <Icon size={20} />
    <span className="hidden sm:inline">{label}</span>
  </Link>
);

// --- ARREGLO: Añadido el enlace de Notificaciones para USUARIOS ---
const userLinks = [
  { to: '/dashboard', icon: Bus, label: 'Inicio' }, // Apuntando a /dashboard
  { to: '/routes', icon: Route, label: 'Rutas' },
  { to: '/notifications', icon: Bell, label: 'Alertas' }, // ENLACE AÑADIDO
  { to: '/comments', icon: MessageSquare, label: 'Comentarios' },
];

// --- ARREGLO: Añadido el enlace de Notificaciones para ADMIN ---
const adminLinks = [
  { to: '/admin', icon: Wrench, label: 'Gestionar Rutas' },
  { to: '/admin/notifications', icon: Bell, label: 'Gestionar Alertas' }, // ENLACE AÑADIDO
  { to: '/admin/comments', icon: Users, label: 'Moderar Comentarios' },
];

const Navbar = ({ user, onLogout, isAdmin }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      onLogout();
      navigate('/auth'); 
    } else {
      console.error('Error al cerrar sesión:', error.message);
    }
    setMenuOpen(false);
  };

  const userInitial = user && user.email ? user.email.charAt(0).toUpperCase() : '?';

  return (
    <header className="sticky top-0 z-50 p-2 sm:p-4">
      <motion.nav
        className="bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-lg flex justify-between items-center"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* El enlace del logo ahora depende del rol */}
        <Link to={isAdmin ? "/admin" : "/dashboard"} className="flex items-center gap-2 text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-700 bg-clip-text text-transparent">
          <Bus className="w-6 h-6 sm:w-7 sm:w-7" />
          <span className="hidden sm:inline">
            TransiTrack
            {isAdmin && <span className="text-sm font-normal text-red-500 ml-2">(Admin)</span>}
          </span>
        </Link>

        {/* Renderizado condicional de los enlaces de navegación (ahora completos) */}
        <div className="flex items-center gap-1 sm:gap-4">
          {(isAdmin ? adminLinks : userLinks).map((link) => (
            <NavLink key={link.to} to={link.to} icon={link.icon} label={link.label} />
          ))}
        </div>

        {/* El menú desplegable del usuario se mantiene sin cambios */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center rounded-full font-bold text-lg">
              {userInitial}
            </div>
            <span className="hidden md:inline font-medium text-gray-800">{user?.email}</span>
            <ChevronDown size={18} className={`text-gray-600 transition-transform duration-300 ${menuOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <div className="p-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-800 truncate">{user?.email}</p>
                  <p className="text-xs text-gray-500">
                    {isAdmin ? 'Administrador' : 'Usuario registrado'}
                  </p>
                </div>
                <div className="p-2">

                  {/* ================== MODIFICACIÓN AQUÍ ================== */}
                  <button
                    onClick={() => {
                      navigate('/profile');
                      setMenuOpen(false); // Cierra el menú al navegar
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  >
                    <UserCircle size={16} />
                    <span>Mi Perfil</span>
                  </button>
                  {/* ================== FIN DE LA MODIFICACIÓN ================== */}


                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  >
                    <LogOut size={16} />
                    <span>Cerrar Sesión</span>
                  </button>


                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>
    </header>
  );
};

export default Navbar;