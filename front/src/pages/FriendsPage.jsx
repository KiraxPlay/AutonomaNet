import { useEffect, useState } from 'react';
import {
  sendFriendRequest,
  acceptFriendRequest,
  cancelFriendRequest,
  deleteFriend,
  getMyFriends,
  getFriendRequests,
  searchUsersByName,
} from '../api/friends.js';
import { toast } from 'react-toastify';

const FriendsPage = () => {
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState({ received: [], sent: [] });
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const friendsRes = await getMyFriends();
      const requestsRes = await getFriendRequests();
      setFriends(friendsRes);
      setRequests(requestsRes);
      setLoading(false);
      setError('');
    } catch (err) {
      setError('Error al cargar datos');
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }
    try {
      setLoading(true);
      const results = await searchUsersByName(searchTerm);
      setSearchResults(results);
      setLoading(false);
    } catch {
      setError('Error buscando usuarios');
      setLoading(false);
    }
  };

  const handleAccept = async (userId) => {
    await acceptFriendRequest(userId);
    await loadData();
  };

  const handleCancel = async (userId) => {
    await cancelFriendRequest(userId);
    await loadData();
  };

  const handleDelete = async (userId) => {
    await deleteFriend(userId);
    await loadData();
  };

  const handleSendRequest = async (userId) => {
    try {
      await sendFriendRequest(userId);
      toast.success('Solicitud enviada');
      setSearchResults([]);
      setSearchTerm('');
      await loadData();
    } catch (err) {
      toast.error(err.message || 'Error al enviar la solicitud');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Gestión de Amigos</h1>

      {loading && <p className="text-blue-500 text-center">Cargando...</p>}
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {/* Amigos */}
      <div className="mb-6 bg-white shadow rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4">Tus Amigos</h2>
        {friends.length === 0 ? (
          <p className="text-gray-500">No tienes amigos aún</p>
        ) : (
          <ul className="space-y-2">
            {friends.map((f) => (
              <li key={f._id} className="flex justify-between items-center bg-gray-100 p-3 rounded">
                <span>{f.username}</span>
                <button
                  onClick={() => handleDelete(f._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Solicitudes recibidas */}
      <div className="mb-6 bg-white shadow rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4">Solicitudes Recibidas</h2>
        {requests.received.length === 0 ? (
          <p className="text-gray-500">No hay solicitudes recibidas</p>
        ) : (
          <ul className="space-y-2">
            {requests.received.map((r) => (
              <li key={r._id} className="flex justify-between items-center bg-gray-100 p-3 rounded">
                <span>{r.username}</span>
                <div className="space-x-2">
                  <button
                    onClick={() => handleAccept(r._id)}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                  >
                    Aceptar
                  </button>
                  <button
                    onClick={() => handleCancel(r._id)}
                    className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded"
                  >
                    Rechazar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Solicitudes enviadas */}
      <div className="mb-6 bg-white shadow rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4">Solicitudes Enviadas</h2>
        {requests.sent.length === 0 ? (
          <p className="text-gray-500">No hay solicitudes enviadas</p>
        ) : (
          <ul className="space-y-2">
            {requests.sent.map((r) => (
              <li key={r._id} className="flex justify-between items-center bg-gray-100 p-3 rounded">
                <span>{r.username}</span>
                <button
                  onClick={() => handleCancel(r._id)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                >
                  Cancelar
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Búsqueda de usuarios */}
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4">Buscar Usuarios</h2>
        <div className="flex items-center space-x-2 mb-4">
          <input
            type="text"
            placeholder="Nombre de usuario"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Buscar
          </button>
        </div>

        <ul className="space-y-2">
          {searchResults.length === 0 && searchTerm && !loading && (
            <li className="text-gray-500">No se encontraron usuarios</li>
          )}
          {searchResults.map((user) => (
            <li key={user._id} className="flex justify-between items-center bg-gray-100 p-3 rounded">
              <span>{user.username}</span>
              <button
                onClick={() => handleSendRequest(user._id)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
              >
                Enviar solicitud
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FriendsPage;
