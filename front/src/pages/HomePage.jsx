import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import PostList from '../components/Postlist';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const { user , logout } = useAuth();
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  // Cambiar el título del documento
  useEffect(() => {
    document.title = "Publicaciones";
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file)); // Mostrar vista previa de la imagen
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!text && !image) {
      alert('Por favor, escribe un texto o sube una imagen.');
      return;
    }

    const formData = new FormData();
    formData.append('text', text);
    if (image) formData.append('image', image);

    // Verificar el contenido de FormData
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      const response = await fetch('http://localhost:4000/api/task', {
        method: 'POST',
        credentials: 'include', // Para enviar cookies
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        alert('Publicacion cargada.');
        setText('');
        setImage(null);
        setPreview(null);
      } else {
        alert(data.message || 'Error al publicar.');
      }
    } catch (error) {
      console.error('Error a subir la publicacion:', error);
      alert('Hubo un error al enviar la publicacion.');
    }
  };

  const handleLogout = () => {
    logout(); // Llama a la función de logout del contexto
    navigate('/login'); // Redirige a la página de inicio
  }

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-2">
          Bienvenido 
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Escribe algo
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none"
              placeholder="Escribe algo..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Sube una imagen
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none"
            />
            {preview && (
              <img
                src={preview}
                alt="Vista previa"
                className="mt-4 w-32 h-32 object-cover rounded-md"
              />
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Publicar
          </button>
        </form>
        <PostList /> {/* Componente para mostrar las publicaciones */}
      </div>
      <div className="mt-4">
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition"
        >
          Cerrar sesión
        </button>
      </div>
      
    </div>
  );
}

export default HomePage;