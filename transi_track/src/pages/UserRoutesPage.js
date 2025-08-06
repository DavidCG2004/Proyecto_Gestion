// src/pages/UserRoutesPage.js

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../utils/supabase';
import { Clock, MapPin, XCircle } from 'lucide-react';

// Componente para mostrar la lista de horarios (solo vista)
const ScheduleDisplayModal = ({ route, schedules, onClose, loading }) => (
  <motion.div
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
  >
    <motion.div
      className="bg-white rounded-3xl p-8 shadow-2xl max-w-lg w-full relative"
      initial={{ scale: 0.9, y: 50 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 50 }}
    >
      <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
        <XCircle size={24} />
      </button>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Horarios para: <span className="text-blue-600">{route.name}</span>
      </h2>
      {loading ? (
        <div className="text-center text-gray-600">Cargando...</div>
      ) : schedules.length === 0 ? (
        <div className="text-center text-gray-600 py-8">No hay horarios definidos para esta ruta.</div>
      ) : (
        <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
          {schedules.map((schedule) => (
            <div key={schedule.id} className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <p className="font-semibold text-gray-800">{schedule.day_of_week}</p>
              <p className="text-gray-600 text-sm">
                {schedule.start_time} - {schedule.end_time}
                {schedule.frequency_minutes && ` (cada ${schedule.frequency_minutes} min)`}
              </p>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  </motion.div>
);

const UserRoutesPage = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [loadingSchedules, setLoadingSchedules] = useState(false);

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('routes').select('*').order('name');
    if (error) setError(error.message);
    else setRoutes(data);
    setLoading(false);
  };

  const fetchSchedules = async (routeId) => {
    setLoadingSchedules(true);
    const { data, error } = await supabase.from('schedules').select('*').eq('route_id', routeId).order('day_of_week');
    if (error) setError(error.message);
    else setSchedules(data);
    setLoadingSchedules(false);
  };

  const handleViewSchedules = (route) => {
    setSelectedRoute(route);
    fetchSchedules(route.id);
  };

  if (loading) return <div className="text-center text-gray-600">Cargando rutas...</div>;
  if (error) return <div className="text-center text-red-600">Error: {error}</div>;

  return (
    <motion.div
      className="p-8 bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-3xl shadow-xl"
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Rutas de Transporte</h1>
      
      {routes.length === 0 ? (
        <div className="text-center text-gray-600 py-10">No hay rutas disponibles en este momento.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {routes.map((route) => (
            <motion.div
              key={route.id}
              className="bg-gray-50 border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col"
              whileHover={{ y: -3, boxShadow: "0 5px 10px rgba(0,0,0,0.05)" }}
            >
              <h3 className="text-xl font-bold text-gray-800 mb-2">{route.name}</h3>
              <p className="text-gray-600 text-sm mb-4 flex-grow">{route.description}</p>
              <div className="flex items-center text-gray-500 text-sm mb-4">
                <MapPin size={16} className="mr-2 flex-shrink-0" />
                <span>{route.start_location} → {route.end_location}</span>
              </div>
              <div className="flex justify-end mt-auto">
                <motion.button
                  onClick={() => handleViewSchedules(route)}
                  className="flex items-center gap-1 px-4 py-2 bg-blue-500 text-white rounded-xl text-sm font-medium hover:bg-blue-600 transition-colors"
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                >
                  <Clock size={16} /> Ver Horarios
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {selectedRoute && (
          <ScheduleDisplayModal
            route={selectedRoute}
            schedules={schedules}
            onClose={() => setSelectedRoute(null)}
            loading={loadingSchedules}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default UserRoutesPage;