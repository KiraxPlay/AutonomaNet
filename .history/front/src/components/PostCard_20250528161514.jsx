import { useState } from 'react';

function PostCard({ post, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(post.text);

  const handleSave = () => {
    if (!editText.trim()) return; // Validar texto no vacío
    onEdit(post._id, editText);
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      {/* info del usuario y fecha */}
      <div className="flex items-center space-x-3">
        {/* ... foto perfil y usuario ... */}
        <div>
          <h3 className="font-semibold">{post.user.username}</h3>
          <p className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleString()}</p>
        </div>
      </div>

      {/* texto o textarea para editar */}
      {isEditing ? (
        <textarea
          className="w-full border rounded p-2 mt-3"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          rows={3}
        />
      ) : (
        <p className="mt-3">{post.text}</p>
      )}

      {/* imagen (si existe) */}
      {/* ... renderImage() ... */}

      {/* botones editar y eliminar */}
      <div className="mt-4 flex justify-end space-x-2">
        {isEditing ? (
          <>
            <button
              className="text-green-600 hover:text-green-800 text-sm"
              onClick={handleSave}
            >
              Guardar
            </button>
            <button
              className="text-gray-600 hover:text-gray-800 text-sm"
              onClick={() => {
                setIsEditing(false);
                setEditText(post.text);
              }}
            >
              Cancelar
            </button>
          </>
        ) : (
          <>
            <button
              className="text-blue-500 hover:text-blue-700 text-sm"
              onClick={() => setIsEditing(true)}
            >
              Editar
            </button>
            <button
              className="text-red-500 hover:text-red-700 text-sm"
              onClick={onDelete}
            >
              Eliminar
            </button>
          </>
        )}
      </div>

      {/* ... sección comentarios si quieres ... */}
    </div>
  );
}

export default PostCard;
