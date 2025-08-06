// src/pages/AdminNotificationsPage.js

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../utils/supabase';
import { Bell, Info, AlertTriangle, XCircle, PlusCircle, Edit, Trash2 } from 'lucide-react';

const AdminNotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [currentNotification, setCurrentNotification] = useState(null);

  useEffect(() => {
    fetchNotificationsAndRoutes();
  }, []);

  const displayMessage = (setter, message, duration = 4000) => {
    setter(message);
    setTimeout(() => setter(''), duration);
  };

  const fetchNotificationsAndRoutes = async () => {
    setLoading(true);
    setError('');
    const { data: notificationsData, error: notificationsError } = await supabase
      .from('notifications')
      .select('*')
      .order('sent_at', { ascending: false });

    const { data: routesData, error: routesError } = await supabase
      .from('routes')
      .select('id, name');

    if (notificationsError) setError(notificationsError.message);
    else if (routesError) setError(routesError.message);
    else {
      setNotifications(notificationsData);
      setRoutes(routesData);
    }
    setLoading(false);
  };

  const getRouteName = (routeId) => {
    const route = routes.find(r => r.id === routeId);
    return route ? route.name : 'Todas las Rutas';
  };

  const handleAddNotification = () => {
    setCurrentNotification({ title: '', message: '', type: 'info', route_id: null, active_until: '' });
    setShowAddEditModal(true);
  };

  const handleEditNotification = (notification) => {
    const localDate = notification.active_until ? new Date(notification.active_until).toISOString().split('T')[0] : '';
    setCurrentNotification({ ...notification, active_until: localDate });
    setShowAddEditModal(true);
  };

  const handleDeleteNotification = async (notificationId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta notificación?')) {
      const { error: deleteError } = await supabase.from('notifications').delete().eq('id', notificationId);
      if (deleteError) displayMessage(setError, deleteError.message);
      else {
        displayMessage(setSuccessMessage, '¡Notificación eliminada con éxito!');
        fetchNotificationsAndRoutes();
      }
    }
  };

  const handleSaveNotification = async (notificationData) => {
    setLoading(true);
    setError('');
    let expirationDate = null;
    if (notificationData.active_until) {
      const date = new Date(notificationData.active_until);
      const userTimezoneOffset = date.getTimezoneOffset() * 60000;
      const localDate = new Date(date.getTime() + userTimezoneOffset);
      localDate.setHours(23, 59, 59, 999);
      expirationDate = localDate.toISOString();
    }
    const dataToSave = {
      ...notificationData,
      route_id: notificationData.route_id || null,
      active_until: expirationDate,
    };
    const { error: upsertError } = await supabase.from('notifications').upsert(dataToSave);
    if (upsertError) setError(upsertError.message);
    else {
      displayMessage(setSuccessMessage, '¡Notificación guardada con éxito!');
      fetchNotificationsAndRoutes();
      setShowAddEditModal(false);
      setCurrentNotification(null);
    }
    setLoading(false);
  };

  return (
    // ================== INICIO DE LA MODIFICACIÓN ESTRUCTURAL ==================
    // Usamos un Fragmento <> para que el modal sea hermano del contenedor de la página
    <>
      <motion.div
        className="p-8 bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-3xl shadow-xl space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Gestionar Notificaciones</h1>
          <motion.button
            onClick={handleAddNotification}
            className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          >
            <PlusCircle size={20} /> Nueva Notificación
          </motion.button>
        </div>
        
        {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg" role="alert"><p>{error}</p></div>}
        {successMessage && <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg" role="alert"><p>{successMessage}</p></div>}

        {loading ? (
          <div className="text-center text-gray-600 py-10">Cargando...</div>
        ) : notifications.length === 0 ? (
          <div className="text-center text-gray-600 py-10">No hay notificaciones creadas.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notifications.map((notification) => (
              <motion.div
                  key={notification.id}
                  layout
                  className="bg-gray-50 border rounded-2xl p-6 shadow-sm flex flex-col"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ y: -3, boxShadow: "0 5px 10px rgba(0,0,0,0.05)" }}
                >
                  <div className="flex items-center mb-3">
                    {notification.type === 'delay' && <AlertTriangle size={20} className="text-red-500 mr-2" />}
                    {notification.type === 'diversion' && <Info size={20} className="text-orange-500 mr-2" />}
                    {notification.type === 'info' && <Bell size={20} className="text-blue-500 mr-2" />}
                    <h3 className="text-xl font-bold text-gray-800">{notification.title}</h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-3 flex-grow break-words">{notification.message}</p>
                  <div className="text-gray-500 text-xs mb-2">
                    <span className="font-medium">Ruta:</span> {getRouteName(notification.route_id)}
                  </div>
                  <div className="text-gray-500 text-xs mb-4">
                    <span className="font-medium">Activa hasta:</span> {notification.active_until ? new Date(notification.active_until).toLocaleDateString() : 'Indefinido'}
                  </div>
                  <div className="flex justify-end gap-3 mt-auto">
                    <motion.button
                      onClick={() => handleEditNotification(notification)}
                      className="flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-sm font-medium hover:bg-yellow-200"
                      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    >
                      <Edit size={16} /> Editar
                    </motion.button>
                    <motion.button
                      onClick={() => handleDeleteNotification(notification.id)}
                      className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200"
                      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    >
                      <Trash2 size={16} /> Eliminar
                    </motion.button>
                  </div>
                </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* El modal ahora está FUERA del motion.div principal */}
      <AnimatePresence>
        {showAddEditModal && (
          <NotificationFormModal
            notification={currentNotification}
            routes={routes}
            onSave={handleSaveNotification}
            onClose={() => setShowAddEditModal(false)}
            loading={loading}
            modalError={error}
          />
        )}
      </AnimatePresence>
    </>
    // ================== FIN DE LA MODIFICACIÓN ESTRUCTURAL ==================
  );
};

// ... (El componente NotificationFormModal permanece igual, sin cambios)
const NotificationFormModal = ({ notification, routes, onSave, onClose, loading, modalError }) => {
  // ...
  const [formData, setFormData] = useState(notification);

  useEffect(() => { setFormData(notification) }, [notification]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-3xl p-8 shadow-2xl max-w-lg w-full relative"
        initial={{ scale: 0.9, y: 50 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 50 }}
        transition={{ duration: 0.3 }}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <XCircle size={24} />
        </button>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {notification.id ? 'Editar Notificación' : 'Crear Nueva Notificación'}
        </h2>
        {modalError && <p className="bg-red-100 text-red-700 p-3 rounded-xl mb-4 text-sm">{modalError}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-gray-700 font-medium mb-1">Título</label>
            <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30" required />
          </div>
          <div>
            <label htmlFor="message" className="block text-gray-700 font-medium mb-1">Mensaje</label>
            <textarea id="message" name="message" value={formData.message} onChange={handleChange} rows="3" className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30" required></textarea>
          </div>
          <div>
            <label htmlFor="type" className="block text-gray-700 font-medium mb-1">Tipo</label>
            <select id="type" name="type" value={formData.type} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30" required>
              <option value="info">Información</option>
              <option value="delay">Retraso</option>
              <option value="diversion">Desvío</option>
            </select>
          </div>
          <div>
            <label htmlFor="route_id" className="block text-gray-700 font-medium mb-1">Ruta (Opcional)</label>
            <select id="route_id" name="route_id" value={formData.route_id || ''} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30">
              <option value="">Todas las rutas</option>
              {routes.map((route) => ( <option key={route.id} value={route.id}>{route.name}</option> ))}
            </select>
          </div>
          <div>
            <label htmlFor="active_until" className="block text-gray-700 font-medium mb-1">Válida hasta (Opcional)</label>
            <input
              type="date"
              id="active_until"
              name="active_until"
              value={formData.active_until}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
            <p className="text-xs text-gray-500 mt-1">La notificación estará activa durante todo el día seleccionado.</p>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <motion.button type="button" onClick={onClose} className="px-5 py-2 bg-gray-200 text-gray-800 rounded-xl font-medium hover:bg-gray-300 transition-colors" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              Cancelar
            </motion.button>
            <motion.button type="submit" className="px-5 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AdminNotificationsPage;