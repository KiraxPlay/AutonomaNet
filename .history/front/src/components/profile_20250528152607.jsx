import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

function ProfileSidebar() {
  const { user, refreshUser } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const API = "http://localhost:4000/api";

  useEffect(() => {
    if (!selectedFile) {
      setPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return alert("Selecciona una imagen primero");

    setLoading(true);
    const formData = new FormData();
    formData.append('profilePicture', selectedFile);

    try {
      const res = await fetch(`${API}/profile/photo`, {
        method: 'PUT',
        credentials: 'include',
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        alert('Foto de perfil actualizada');
        await refreshUser();  // Refrescar usuario para actualizar la foto
        setSelectedFile(null);
      } else {
        alert(data.message || 'Error al subir la foto');
      }
    } catch (error) {
      console.error('Error al subir la foto:', error);
      alert('Error al subir la foto de perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('¿Quieres eliminar tu foto de perfil?')) return;

    setLoading(true);
    try {
      const res = await fetch(`${API}/profile/photo`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (res.ok) {
        alert('Foto eliminada');
        await refreshUser();  // Refrescar usuario después de borrar foto
      } else {
        alert('Error al eliminar la foto');
      }
    } catch (error) {
      alert('Error al eliminar la foto');
    } finally {
      setLoading(false);
    }
  };

  console.log('user.profilePicture:', user?.profilePicture);


  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{user?.username || 'Usuario'}</h1>

      <div className="mb-4">
        {preview ? (
          <img
            src={preview}
            alt="Vista previa"
            className="w-32 h-32 rounded-full object-cover"
          />
        ) : user?.profilePicture ? (
          <img
            src={`http://localhost:4000/uploads/profile/${user.profilePicture}`}
            alt="Foto de perfil"
            className="w-32 h-32 rounded-full object-cover"
          />
        ) : (
          <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
            Sin foto
          </div>
        )}
      </div>

      
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={loading}
        className="mb-2"
      />

      <button
        onClick={handleUpload}
        disabled={loading || !selectedFile}
        className="bg-blue-600 text-white px-4 py-2 rounded mr-2 hover:bg-blue-700"
      >
        {loading ? 'Subiendo...' : 'Actualizar foto'}
      </button>

      {user?.profilePicture && (
        <button
          onClick={handleDelete}
          disabled={loading}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          {loading ? 'Eliminando...' : 'Eliminar foto'}
        </button>
      )}
    </div>
  );
}

export default ProfileSidebar;
