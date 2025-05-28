import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

function PostCard({ post, onPostDeleted, onPostUpdated }) {
  const { user } = useAuth();
  const isOwner = user?._id === post.user?._id;

  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(post.text || '');
  const [editImage, setEditImage] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);

  const API = 'http://localhost:4000/api';

  const handleDelete = async () => {
    if (!window.confirm('¿Eliminar esta publicación?')) return;
    try {
      const res = await fetch(`${API}/task/${post._id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Error al eliminar');
      toast.success('Publicación eliminada');
      onPostDeleted(post._id);
    } catch (error) {
      toast.error('Error al eliminar publicación');
    }
  };

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append('text', editText);
    if (editImage) {
      formData.append('image', editImage);
    }

    try {
      const res = await fetch(`${API}/task/${post._id}`, {
        method: 'PUT',
        credentials: 'include',
        body: formData,
      });

      if (!res.ok) throw new Error('Error al actualizar');
      const updatedPost = await res.json();
      toast.success('Publicación actualizada');
      setIsEditing(false);
      onPostUpdated(post._id, updatedPost);
    } catch (error) {
      toast.error('Error al actualizar publicación');
    }
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;
    try {
      const res = await fetch(`${API}/comments/${post._id}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newComment }),
      });
      if (!res.ok) throw new Error('Error al comentar');
      const comment = await res.json();
      setComments([...comments, comment]);
      setNewComment('');
    } catch (error) {
      toast.error('Error al comentar');
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setEditImage(e.target.files[0]);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      {/* Autor */}
      <div className="flex items-center mb-2">
        <img
          src={
            post.user?.profilePicture
              ? `http://localhost:4000${post.user.profilePicture}`
              : '/default-profile.png'
          }
          alt="Autor"
          className="w-10 h-10 rounded-full object-cover mr-2"
        />
        <span className="font-semibold">{post.user?.username || 'Autor desconocido'}</span>
      </div>

      {/* Contenido */}
      {isEditing ? (
        <div className="space-y-2">
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="w-full border p-2 rounded"
          />
          <input type="file" onChange={handleImageChange} />
          <button onClick={handleUpdate} className="bg-blue-500 text-white px-3 py-1 rounded">
            Guardar
          </button>
          <button onClick={() => setIsEditing(false)} className="ml-2 text-sm text-gray-500">
            Cancelar
          </button>
        </div>
      ) : (
        <>
          {post.text && <p className="mb-2">{post.text}</p>}
          {post.imageUrl && (
            <img
              src={`http://localhost:4000${post.imageUrl}`}
              alt="Publicación"
              className="max-w-full rounded"
            />
          )}
          {isOwner && (
            <div className="mt-2 flex gap-2">
              <button onClick={() => setIsEditing(true)} className="text-blue-500">
                Editar
              </button>
              <button onClick={handleDelete} className="text-red-500">
                Eliminar
              </button>
            </div>
          )}
        </>
      )}

      {/* Comentarios */}
      <div className="mt-4">
        <button
          onClick={() => setShowComments(!showComments)}
          className="text-sm text-gray-600 hover:underline"
        >
          {showComments ? 'Ocultar comentarios' : 'Mostrar comentarios'}
        </button>

        {showComments && (
          <div className="mt-2 space-y-2">
            {comments.map((comment, i) => (
              <div key={i} className="border p-2 rounded bg-gray-50">
                <p className="text-sm">{comment.text}</p>
              </div>
            ))}
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Escribe un comentario..."
                className="flex-1 border px-2 py-1 rounded"
              />
              <button onClick={handleCommentSubmit} className="text-sm bg-blue-500 text-white px-2 rounded">
                Enviar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PostCard;
