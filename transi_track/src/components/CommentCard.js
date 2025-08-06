// src/components/CommentCard.js

import React from 'react';
import { motion } from 'framer-motion';
import { User, Star, Edit, Trash2 } from 'lucide-react';

// Email del administrador para la lógica de permisos
const ADMIN_EMAIL = 'alexandergarcia212@outlook.com';

const CommentCard = ({ comment, user, onEdit, onDelete }) => {
  // Determina qué nombre mostrar, dando prioridad al username si existe
  const displayName = comment.username || comment.email || 'Anónimo';
  
  // Lógica para determinar si los botones de acción deben mostrarse
  const canEdit = user && user.id === comment.user_id;
  const canDelete = user && (user.id === comment.user_id || user.email === ADMIN_EMAIL);

  return (
    <motion.div
      layout
      className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm flex flex-col space-y-4 h-full"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4, boxShadow: "0 8px 15px rgba(0,0,0,0.06)" }}
    >
      {/* --- Cabecera: Información del Usuario y Fecha --- */}
      <header className="flex justify-between items-center text-sm">
        <div className="flex items-center gap-2 text-gray-700 font-semibold truncate">
          <User size={16} className="text-gray-400 flex-shrink-0" />
          <span className="truncate">{displayName}</span>
        </div>
        <time className="text-gray-400 flex-shrink-0">{new Date(comment.created_at).toLocaleDateString()}</time>
      </header>

      {/* --- Cuerpo: Texto del Comentario (CON LA CORRECCIÓN) --- */}
      <p className="text-gray-800 text-base flex-grow break-words">"{comment.comment_text}"</p>

      {/* --- Pie: Información de la Ruta y Calificación --- */}
      <footer className="flex justify-between items-center text-sm pt-4 border-t border-gray-100">
        <div className="text-gray-600">
          <strong>Ruta:</strong>
          <span className="ml-1 font-medium text-blue-600">{comment.route_name || 'General'}</span>
        </div>
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={18}
              className={`-ml-1 ${i < comment.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
            />
          ))}
        </div>
      </footer>

      {/* --- Acciones: Botones de Editar y Eliminar --- */}
      {(canEdit || canDelete) && (
        <div className="flex justify-end gap-2 mt-auto">
          {canEdit && (
            <motion.button
              onClick={() => onEdit(comment)}
              className="flex items-center gap-1.5 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-lg text-sm font-medium hover:bg-yellow-200"
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            >
              <Edit size={14} /> Editar
            </motion.button>
          )}
          {canDelete && (
            <motion.button
              onClick={() => onDelete(comment.id)}
              className="flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-800 rounded-lg text-sm font-medium hover:bg-red-200"
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            >
              <Trash2 size={14} /> Eliminar
            </motion.button>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default CommentCard;