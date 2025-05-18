import { useState, useEffect } from 'react';

function PostList() {
  const [posts, setPosts] = useState([]); // Estado para almacenar las publicaciones

  // Función para obtener las publicaciones
  const fetchPosts = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/task', {
        method: 'GET',
        credentials: 'include', // Para enviar cookies si es necesario
      });

      const data = await response.json();
      if (response.ok) {
        setPosts(data); // Guardar las publicaciones en el estado
      } else {
        console.error('Error al obtener las publicaciones:', data.message);
      }
    } catch (error) {
      console.error('Error al obtener las publicaciones:', error);
    }
  };

  // Llamar a fetchPosts cuando el componente se monte
  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="space-y-4 mt-6">
      <h2 className="text-xl font-bold mb-4">Publicaciones</h2>
      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post._id} className="bg-gray-100 p-4 rounded-md shadow">
            {post.imageUrl && (
              <img
                src={`http://localhost:4000${post.imageUrl}`}
                alt="Publicación"
                className="w-full h-64 object-cover rounded-md mb-4"
              />
            )}
            <p className="text-gray-800">{post.text}</p>
            <p className="text-gray-600 text-sm">
              Publicado por: {post.user?.username || "Usuario desconocido"}
            </p>
          </div>
        ))
      ) : (
        <p className="text-gray-600">No hay publicaciones disponibles.</p>
      )}
    </div>
  );
}

export default PostList;