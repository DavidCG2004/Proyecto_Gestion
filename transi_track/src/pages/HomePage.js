import React from 'react';
import { motion } from 'framer-motion';
import { BusFront, MapPin, Clock, MessageSquareText, BellRing } from 'lucide-react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const features = [
    {
      icon: MapPin,
      title: 'Visualización de Rutas',
      description: 'Explora todas las rutas disponibles y sus paradas.',
      link: '/routes'
    },
    {
      icon: Clock,
      title: 'Horarios Detallados',
      description: 'Consulta los horarios de salida y llegada de cada ruta.',
      link: '/routes'
    },
    {
      icon: MessageSquareText,
      title: 'Comentarios y Reseñas',
      description: 'Lee y comparte opiniones sobre las rutas y el servicio.',
      link: '/comments'
    },
    {
      icon: BellRing,
      title: 'Notificaciones en Tiempo Real',
      description: 'Mantente informado sobre desvíos y retrasos.',
      link: '/notifications'
    }
  ];

  return (
    <motion.div
      className="text-center py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
      >
        <BusFront className="w-16 h-16 text-blue-600" />
      </motion.div>

      <motion.h1
        className="text-5xl font-extrabold text-gray-900 mb-4 bg-gradient-to-r from-blue-700 to-purple-800 bg-clip-text text-transparent"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        Bienvenido a TransiTrack
      </motion.h1>

      <motion.p
        className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        Tu compañero inteligente para el transporte público.
        Encuentra rutas, horarios y mantente al día con las notificaciones.
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-3xl p-6 shadow-lg flex flex-col items-center text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
            whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
          >
            <div className="p-4 bg-blue-50 rounded-full mb-4">
              <feature.icon className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
            <p className="text-gray-600 text-sm mb-4">{feature.description}</p>
            <Link
              to={feature.link}
              className="mt-auto inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors duration-200"
            >
              Explorar
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default HomePage;