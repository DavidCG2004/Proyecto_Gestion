import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../utils/supabase';
import { Bell, Info, AlertTriangle, Clock } from 'lucide-react'; // Añadí el icono del reloj

const UserNotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchActiveNotificationsAndRoutes();
  }, []);

  const fetchActiveNotificationsAndRoutes = async () => {
    setLoading(true);
    setError('');

    // --- CORRECCIÓN CLAVE AQUÍ ---
    // Cambiamos 'gt' (mayor que) por 'gte' (mayor o igual que)
    // para incluir las notificaciones que están activas en este preciso instante.
    const { data: notificationsData, error: notificationsError } = await supabase
      .from('notifications')
      .select('*')
      .or(`active_until.is.null,active_until.gte.${new Date().toISOString()}`)
      .order('sent_at', { ascending: false });

    if (notificationsError) {
      setError(notificationsError.message);
      setLoading(false);
      return;
    }

    const { data: routesData, error: routesError } = await supabase
      .from('routes')
      .select('id, name');

    if (routesError) {
        console.error("Could not fetch routes:", routesError.message);
    }

    setNotifications(notificationsData);
    setRoutes(routesData || []);
    setLoading(false);
  };

  const getRouteName = (routeId) => {
    if (!routeId) return 'Todas';
    const route = routes.find(r => r.id === routeId);
    return route ? route.name : 'Ruta Desconocida';
  };


  if (loading) {
    return <div className="text-center text-gray-600 p-10">Cargando notificaciones...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600 p-10">Error: {error}</div>;
  }

  return (
    <motion.div
      className="p-8 bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-3xl shadow-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Alertas y Notificaciones</h1>

      {notifications.length === 0 ? (
        <div className="text-center text-gray-600 py-10">
          <Bell size={48} className="mx-auto text-gray-400 mb-4" />
          <p>No hay notificaciones activas en este momento.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {notifications.map((notification) => (
              <motion.div
                key={notification.id}
                layout
                className={`border rounded-2xl p-5 shadow-sm flex items-start gap-4 ${
                  notification.type === 'delay' ? 'bg-red-50 border-red-200' :
                  notification.type === 'diversion' ? 'bg-orange-50 border-orange-200' :
                  'bg-blue-50 border-blue-200'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex-shrink-0 mt-1">
                  {notification.type === 'delay' && <AlertTriangle size={24} className="text-red-500" />}
                  {notification.type === 'diversion' && <Info size={24} className="text-orange-500" />}
                  {notification.type === 'info' && <Bell size={24} className="text-blue-500" />}
                </div>
                <div className="flex-grow">
                  <h3 className="text-lg font-bold text-gray-800">{notification.title}</h3>
                  <p className="text-gray-700 text-sm mt-1">{notification.message}</p>
                  
                  {/* --- MEJORA DE UI OPCIONAL --- */}
                  <div className="text-gray-500 text-xs mt-3 flex items-center justify-between flex-wrap gap-2">
                    <span>
                      <strong>Ruta:</strong> {getRouteName(notification.route_id)}
                    </span>
                    {/* Mostramos la fecha de expiración si existe, es más útil para el usuario */}
                    {notification.active_until ? (
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        Válido hasta: {new Date(notification.active_until).toLocaleString()}
                      </span>
                    ) : (
                       <span>
                        Publicado: {new Date(notification.sent_at).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};

export default UserNotificationsPage;