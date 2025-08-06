import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../utils/supabase';
import { Bus, Clock, MapPin, PlusCircle, Edit, Trash2, XCircle } from 'lucide-react';

const AdminRoutesPage = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // Estado para mensajes de éxito
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [currentRoute, setCurrentRoute] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [currentSchedule, setCurrentSchedule] = useState(null);
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    fetchRoutes();
  }, []);

  // --- FUNCIÓN MEJORADA PARA MOSTRAR MENSAJES ---
  const displayMessage = (setter, message, duration = 4000) => {
    setter(message);
    setTimeout(() => setter(''), duration);
  };

  const fetchRoutes = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('routes').select('*').order('name', { ascending: true });
    if (error) displayMessage(setError, error.message);
    else setRoutes(data);
    setLoading(false);
  };

  const fetchSchedules = async (routeId) => {
    setLoading(true);
    const { data, error } = await supabase.from('schedules').select('*').eq('route_id', routeId).order('day_of_week').order('start_time');
    if (error) displayMessage(setError, error.message);
    else setSchedules(data);
    setLoading(false);
  };

  const handleAddRoute = () => {
    setCurrentRoute({ name: '', description: '', start_location: '', end_location: '' });
    setShowAddEditModal(true);
  };

  const handleEditRoute = (route) => {
    setCurrentRoute(route);
    setShowAddEditModal(true);
  };

  // --- FUNCIÓN MEJORADA ---
  const handleDeleteRoute = async (routeId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta ruta? Esto también eliminará sus horarios y comentarios asociados.')) {
      const { error } = await supabase.from('routes').delete().eq('id', routeId);
      if (error) displayMessage(setError, error.message);
      else {
        displayMessage(setSuccessMessage, '¡Ruta eliminada con éxito!');
        fetchRoutes();
      }
    }
  };

  // --- FUNCIÓN MEJORADA (USA UPSERT) ---
  const handleSaveRoute = async (routeData) => {
    setLoading(true);
    // Limpiamos los datos para evitar enviar campos extra
    const dataToSave = {
        id: routeData.id,
        name: routeData.name,
        description: routeData.description,
        start_location: routeData.start_location,
        end_location: routeData.end_location
    };
    
    const { error } = await supabase.from('routes').upsert(dataToSave);

    if (error) displayMessage(setError, error.message);
    else {
      displayMessage(setSuccessMessage, '¡Ruta guardada con éxito!');
      fetchRoutes();
      setShowAddEditModal(false);
      setCurrentRoute(null);
    }
    setLoading(false);
  };

  const handleViewSchedules = (route) => {
    setSelectedRoute(route);
    fetchSchedules(route.id);
  };

  const handleAddSchedule = () => {
    setCurrentSchedule({ route_id: selectedRoute.id, day_of_week: '', start_time: '', end_time: '', frequency_minutes: null });
    setShowScheduleModal(true);
  };

  const handleEditSchedule = (schedule) => {
    setCurrentSchedule(schedule);
    setShowScheduleModal(true);
  };

  // --- FUNCIÓN MEJORADA ---
  const handleDeleteSchedule = async (scheduleId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este horario?')) {
      const { error } = await supabase.from('schedules').delete().eq('id', scheduleId);
      if (error) displayMessage(setError, error.message);
      else {
        displayMessage(setSuccessMessage, '¡Horario eliminado!');
        fetchSchedules(selectedRoute.id);
      }
    }
  };

  // --- FUNCIÓN MEJORADA (USA UPSERT) ---
  const handleSaveSchedule = async (scheduleData) => {
    setLoading(true);
    const { error } = await supabase.from('schedules').upsert(scheduleData);
    if (error) displayMessage(setError, error.message);
    else {
      displayMessage(setSuccessMessage, '¡Horario guardado!');
      fetchSchedules(selectedRoute.id);
      setShowScheduleModal(false);
      setCurrentSchedule(null);
    }
    setLoading(false);
  };
  
  return (
    <>
      <motion.div
        className="p-8 bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-3xl shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Rutas de Transporte</h1>
          <motion.button
            onClick={handleAddRoute}
            className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <PlusCircle size={20} /> Nueva Ruta
          </motion.button>
        </div>

        {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-4" role="alert"><p>{error}</p></div>}
        {successMessage && <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg mb-4" role="alert"><p>{successMessage}</p></div>}

        {loading ? (
            <div className="text-center text-gray-600 py-10">Cargando...</div>
        ) : routes.length === 0 ? (
          <div className="text-center text-gray-600 py-10">No hay rutas disponibles. ¡Crea una!</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {routes.map((route) => (
              <motion.div
                key={route.id}
                layout
                className="bg-gray-50 border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -3, boxShadow: "0 5px 10px rgba(0,0,0,0.05)" }}
              >
                <h3 className="text-xl font-bold text-gray-800 mb-2">{route.name}</h3>
                <p className="text-gray-600 text-sm mb-4 flex-grow break-words">{route.description}</p>
                <div className="flex items-center text-gray-500 text-sm mb-2">
                  <MapPin size={16} className="mr-2 flex-shrink-0" />
                  <span className="truncate">{route.start_location} <span className="mx-1">→</span> {route.end_location}</span>
                </div>
                <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-100">
                  <motion.button
                    onClick={() => handleViewSchedules(route)}
                    className="flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Clock size={14} /> Horarios
                  </motion.button>
                  <motion.button
                    onClick={() => handleEditRoute(route)}
                    className="flex items-center gap-1.5 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-sm font-medium hover:bg-yellow-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Edit size={14} /> Editar
                  </motion.button>
                  <motion.button
                    onClick={() => handleDeleteRoute(route.id)}
                    className="flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Trash2 size={14} /> Eliminar
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {showAddEditModal && (
          <RouteFormModal route={currentRoute} onSave={handleSaveRoute} onClose={() => setShowAddEditModal(false)} loading={loading} error={error} />
        )}
        {selectedRoute && (
          <ScheduleListModal route={selectedRoute} schedules={schedules} onClose={() => setSelectedRoute(null)} onAddSchedule={handleAddSchedule} onEditSchedule={handleEditSchedule} onDeleteSchedule={handleDeleteSchedule} loading={loading} error={error} />
        )}
        {showScheduleModal && (
          <ScheduleFormModal schedule={currentSchedule} onSave={handleSaveSchedule} onClose={() => setShowScheduleModal(false)} loading={loading} error={error} />
        )}
      </AnimatePresence>
    </>
  );
};

// ... (Los componentes de Modal: RouteFormModal, ScheduleListModal, ScheduleFormModal no necesitan cambios)

// ... (Pega aquí los componentes de tus modales sin cambios)
const RouteFormModal = ({ route, onSave, onClose, loading, error }) => {
  const [formData, setFormData] = useState(route);

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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-3xl p-8 shadow-2xl max-w-lg w-full relative"
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 50 }}
        transition={{ duration: 0.3 }}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <XCircle size={24} />
        </button>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {route.id ? 'Editar Ruta' : 'Agregar Nueva Ruta'}
        </h2>
        {error && <p className="bg-red-100 text-red-700 p-3 rounded-xl mb-4 text-sm">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-gray-700 font-medium mb-1">Nombre de la Ruta</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-gray-700 font-medium mb-1">Descripción</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            ></textarea>
          </div>
          <div>
            <label htmlFor="start_location" className="block text-gray-700 font-medium mb-1">Ubicación de Inicio</label>
            <input
              type="text"
              id="start_location"
              name="start_location"
              value={formData.start_location}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              required
            />
          </div>
          <div>
            <label htmlFor="end_location" className="block text-gray-700 font-medium mb-1">Ubicación Final</label>
            <input
              type="text"
              id="end_location"
              name="end_location"
              value={formData.end_location}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              required
            />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <motion.button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-gray-200 text-gray-800 rounded-xl font-medium hover:bg-gray-300 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Cancelar
            </motion.button>
            <motion.button
              type="submit"
              className="px-5 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={loading}
            >
              {loading ? 'Guardando...' : 'Guardar Ruta'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

const ScheduleListModal = ({ route, schedules, onAddSchedule, onEditSchedule, onDeleteSchedule, onClose, loading, error }) => {
  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-3xl p-8 shadow-2xl max-w-2xl w-full relative"
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 50 }}
        transition={{ duration: 0.3 }}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <XCircle size={24} />
        </button>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Horarios para: <span className="text-blue-600">{route.name}</span>
        </h2>
        {error && <p className="bg-red-100 text-red-700 p-3 rounded-xl mb-4 text-sm">{error}</p>}

        <div className="flex justify-end mb-4">
          <motion.button
            onClick={onAddSchedule}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <PlusCircle size={18} /> Nuevo Horario
          </motion.button>
        </div>

        {loading ? (
          <div className="text-center text-gray-600">Cargando horarios...</div>
        ) : schedules.length === 0 ? (
          <div className="text-center text-gray-600 py-8">No hay horarios para esta ruta.</div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            <AnimatePresence>
              {schedules.map((schedule) => (
                <motion.div
                  key={schedule.id}
                  className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center justify-between"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <div>
                    <p className="font-semibold text-gray-800">{schedule.day_of_week}</p>
                    <p className="text-gray-600 text-sm">
                      {schedule.start_time} - {schedule.end_time}
                      {schedule.frequency_minutes && ` (cada ${schedule.frequency_minutes} min)`}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <motion.button
                      onClick={() => onEditSchedule(schedule)}
                      className="p-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Edit size={18} />
                    </motion.button>
                    <motion.button
                      onClick={() => onDeleteSchedule(schedule.id)}
                      className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Trash2 size={18} />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

const ScheduleFormModal = ({ schedule, onSave, onClose, loading, error }) => {
  const [formData, setFormData] = useState(schedule);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const daysOfWeek = [
    'Lunes a Viernes', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes',
    'Sábado', 'Domingo', 'Fines de Semana', 'Todos los días'
  ];

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-3xl p-8 shadow-2xl max-w-lg w-full relative"
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 50 }}
        transition={{ duration: 0.3 }}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <XCircle size={24} />
        </button>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {schedule.id ? 'Editar Horario' : 'Agregar Nuevo Horario'}
        </h2>
        {error && <p className="bg-red-100 text-red-700 p-3 rounded-xl mb-4 text-sm">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="day_of_week" className="block text-gray-700 font-medium mb-1">Día de la Semana</label>
            <select
              id="day_of_week"
              name="day_of_week"
              value={formData.day_of_week}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              required
            >
              <option value="">Selecciona un día</option>
              {daysOfWeek.map((day) => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="start_time" className="block text-gray-700 font-medium mb-1">Hora de Inicio</label>
              <input
                type="time"
                id="start_time"
                name="start_time"
                value={formData.start_time}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                required
              />
            </div>
            <div>
              <label htmlFor="end_time" className="block text-gray-700 font-medium mb-1">Hora Fin</label>
              <input
                type="time"
                id="end_time"
                name="end_time"
                value={formData.end_time}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="frequency_minutes" className="block text-gray-700 font-medium mb-1">Frecuencia (minutos)</label>
            <input
              type="number"
              id="frequency_minutes"
              name="frequency_minutes"
              value={formData.frequency_minutes || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              placeholder="Ej: 15 (opcional)"
            />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <motion.button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-gray-200 text-gray-800 rounded-xl font-medium hover:bg-gray-300 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Cancelar
            </motion.button>
            <motion.button
              type="submit"
              className="px-5 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={loading}
            >
              {loading ? 'Guardando...' : 'Guardar Horario'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};


export default AdminRoutesPage;