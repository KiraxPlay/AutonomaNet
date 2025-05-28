import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

function ProfileSidebar() {
  const { user, refreshUser } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const fileInputRef = useRef(null);

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
    if (!selectedFile) return toast.error("Selecciona una imagen primero");
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
        toast.success('Foto de perfil actualizada');
        await refreshUser();
        setSelectedFile(null);
        setMenuOpen(false);
      } else {
        toast.error(data.message || 'Error al subir la foto');
      }
    } catch (error) {
      console.error('Error al subir la foto:', error);
      toast.error('Error al subir la foto de perfil');
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
        toast.success('Foto eliminada');
        await refreshUser();
        setMenuOpen(false);
      } else {
        toast.error('Error al eliminar la foto');
      }
    } catch (error) {
      toast.error('Error al eliminar la foto');
    } finally {
      setLoading(false);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="relative max-w-xs mx-auto">
      <h1 className="text-2xl font-bold mb-4">{user?.username || 'Usuario'}</h1>

      <div className="relative inline-block mb-4 group">
        <div
          className="w-32 h-32 rounded-full overflow-hidden bg-gray-300 flex items-center justify-center cursor-pointer"
          onClick={handleImageClick}
        >
          {preview ? (
            <img src={preview} alt="Vista previa" className="object-cover w-full h-full" />
          ) : user?.profilePicture ? (
            <img
              src={`http://localhost:4000/uploads/profile/${user.profilePicture}`}
              alt="Foto de perfil"
              className="object-cover w-full h-full"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/default-avatar.png";
              }}
            />
          ) : (
            <img
              src="/default-avatar.png"
              alt="Avatar por defecto"
              className="object-cover w-full h-full"
            />
          )}
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="absolute bottom-0 right-0 bg-white border rounded-full shadow p-1 hover:bg-gray-100"
        >
          ⋮
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow z-10">
            <button
              onClick={handleUpload}
              disabled={loading || !selectedFile}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100 disabled:text-gray-400"
            >
              {loading ? 'Subiendo...' : 'Actualizar foto'}
            </button>
            {user?.profilePicture && (
              <button
                onClick={handleDelete}
                disabled={loading}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
              >
                {loading ? 'Eliminando...' : 'Eliminar foto'}
              </button>
            )}
          </div>
        )}
      </div>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={loading}
        ref={fileInputRef}
        className="hidden"
      />
    </div>
  );
}

export default ProfileSidebar;
