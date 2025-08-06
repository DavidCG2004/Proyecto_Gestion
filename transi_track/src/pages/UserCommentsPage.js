import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../utils/supabase';
import { MessageSquare, Star, PlusCircle, XCircle } from 'lucide-react';
import CommentCard from '../components/CommentCard';

const UserCommentsPage = ({ user }) => {
  const [comments, setComments] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [currentComment, setCurrentComment] = useState(null);

  useEffect(() => {
    fetchCommentsAndRoutes();
  }, []);

  const displayMessage = (setter, message, duration = 4000) => {
    setter(message);
    setTimeout(() => setter(''), duration);
  };

  const fetchCommentsAndRoutes = async () => {
    setLoading(true);
    const { data: commentsData, error: commentsError } = await supabase
      .from('comments_with_details')
      .select('*')
      .order('created_at', { ascending: false });

    const { data: routesData, error: routesError } = await supabase
      .from('routes')
      .select('id, name');

    if (commentsError) displayMessage(setError, commentsError.message);
    else if (routesError) displayMessage(setError, routesError.message);
    else {
      setComments(commentsData);
      setRoutes(routesData);
    }
    setLoading(false);
  };

  const handleAddComment = () => {
    setCurrentComment({ comment_text: '', rating: 5, route_id: null, user_id: user?.id });
    setShowAddEditModal(true);
  };

  const handleEditComment = (comment) => {
    setCurrentComment(comment);
    setShowAddEditModal(true);
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este comentario?')) {
      const { error: deleteError } = await supabase.from('comments').delete().eq('id', commentId);
      if (deleteError) displayMessage(setError, deleteError.message);
      else {
        displayMessage(setSuccessMessage, 'Comentario eliminado.');
        fetchCommentsAndRoutes();
      }
    }
  };

  const handleSaveComment = async (commentData) => {
    setLoading(true);
    setError('');
    const dataToSave = {
      id: commentData.id,
      user_id: commentData.user_id,
      route_id: commentData.route_id,
      comment_text: commentData.comment_text,
      rating: commentData.rating,
    };
    
    const { error: upsertError } = await supabase.from('comments').upsert(dataToSave);

    if (upsertError) setError(upsertError.message);
    else {
      displayMessage(setSuccessMessage, '¡Gracias por tu comentario!');
      fetchCommentsAndRoutes();
      setShowAddEditModal(false);
      setCurrentComment(null);
    }
    setLoading(false);
  };

  return (
    // ================== INICIO DE LA MODIFICACIÓN ESTRUCTURAL ==================
    <>
      <motion.div
        className="p-6 sm:p-8 bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-3xl shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Comentarios</h1>
          <motion.button
            onClick={handleAddComment}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <PlusCircle size={20} />
            <span className="hidden sm:inline">Tu Comentario</span>
          </motion.button>
        </div>

        {successMessage && <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg mb-4" role="alert"><p>{successMessage}</p></div>}
        {error && !showAddEditModal && <div className="bg-red-100 text-red-700 p-3 rounded-xl mb-4 text-sm">{error}</div>}

        {loading ? (
             <div className="text-center text-gray-600 py-10">Cargando...</div>
        ): comments.length === 0 ? (
          <div className="text-center text-gray-500 py-16">
            <MessageSquare size={48} className="mx-auto text-gray-400 mb-4" />
            <p>Aún no hay comentarios. ¡Sé el primero en compartir tu opinión!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {comments.map((comment) => (
              <CommentCard
                key={comment.id}
                comment={comment}
                user={user}
                onEdit={handleEditComment}
                onDelete={handleDeleteComment}
              />
            ))}
          </div>
        )}
      </motion.div>

      {/* El modal ahora está FUERA del motion.div principal */}
      <AnimatePresence>
        {showAddEditModal && (
          <CommentFormModal
            comment={currentComment}
            routes={routes}
            onSave={handleSaveComment}
            onClose={() => setShowAddEditModal(false)}
            loading={loading}
            error={error}
            userId={user.id}
          />
        )}
      </AnimatePresence>
    </>
    // ================== FIN DE LA MODIFICACIÓN ESTRUCTURAL ==================
  );
};


// El componente del formulario de comentarios que ya tenías dentro del archivo.
const CommentFormModal = ({ comment, routes, onSave, onClose, loading, error, userId }) => {
  const [formData, setFormData] = useState(comment);

  useEffect(() => {
    setFormData(comment);
  }, [comment]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (newRating) => {
    setFormData((prev) => ({ ...prev, rating: newRating }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...formData, user_id: userId });
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-3xl p-8 shadow-2xl max-w-lg w-full relative"
        initial={{ scale: 0.9, y: 50 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 50 }}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><XCircle size={24} /></button>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {comment?.id ? 'Editar Comentario' : 'Agregar Nuevo Comentario'}
        </h2>
        {error && <p className="bg-red-100 text-red-700 p-3 rounded-xl mb-4 text-sm">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="route_id" className="block text-gray-700 font-medium mb-1">Ruta</label>
            <select id="route_id" name="route_id" value={formData.route_id || ''} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-xl" required>
              <option value="">Selecciona una ruta</option>
              {routes.map((route) => (<option key={route.id} value={route.id}>{route.name}</option>))}
            </select>
          </div>
          <div>
            <label htmlFor="comment_text" className="block text-gray-700 font-medium mb-1">Comentario</label>
            <textarea id="comment_text" name="comment_text" value={formData.comment_text} onChange={handleChange} rows="4" className="w-full px-4 py-2 border border-gray-300 rounded-xl" required></textarea>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Calificación</label>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <motion.button key={i} type="button" onClick={() => handleRatingChange(i + 1)} className="p-2 rounded-full">
                  <Star size={28} className={i < formData.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'} />
                </motion.button>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <motion.button type="button" onClick={onClose} className="px-5 py-2 bg-gray-200 text-gray-800 rounded-xl font-medium hover:bg-gray-300">Cancelar</motion.button>
            <motion.button type="submit" className="px-5 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50" disabled={loading}>{loading ? 'Guardando...' : 'Guardar'}</motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default UserCommentsPage;