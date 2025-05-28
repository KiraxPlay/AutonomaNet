import { useState, useEffect } from 'react';
import PostCard from './PostCard';
import toast from 'react-hot-toast';

function PostList() {
  const [posts, setPosts] = useState([]);

  // Función para cargar posts
  const fetchPosts = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/task', { credentials: 'include' });
      const data = await res.json();
      setPosts(data);
    } catch (error) {
      toast.error('Error al cargar publicaciones');
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Función para eliminar un post
  const handleDeletePost = async (postId) => {
    if (!window.confirm('¿Estás seguro de eliminar esta publicación?')) return;
    try {
      const res = await fetch(`http://localhost:4000/api/task/${postId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Error al eliminar');
      setPosts(posts.filter(post => post._id !== postId));
      toast.success('Publicación eliminada');
    } catch (error) {
      toast.error('Error al eliminar publicación');
    }
  };

  // Función para actualizar un post (solo texto en este ejemplo)
  const handleEditPost = async (postId, updatedText) => {
    try {
      const res = await fetch(`http://localhost:4000/api/task/${postId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ text: updatedText }),
      });
      if (!res.ok) throw new Error('Error al actualizar');
      const updatedPost = await res.json();
      setPosts(posts.map(post => (post._id === postId ? updatedPost : post)));
      toast.success('Publicación actualizada');
    } catch (error) {
      toast.error('Error al actualizar publicación');
    }
  };

  return (
    <div className="space-y-4">
      {posts.map(post => (
        <PostCard
          key={post._id}
          post={post}
          onDelete={() => handleDeletePost(post._id)}
          onEdit={handleEditPost}
        />
      ))}
    </div>
  );
}

export default PostList;
