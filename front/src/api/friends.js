import axios from 'axios';

const API_URL = 'http://localhost:4000/api/friends';

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true, // <---- permite enviar cookies al backend
});

// Ya no necesitas agregar el token manualmente en headers Authorization,
// porque tu backend lo lee de la cookie.
  
export const sendFriendRequest = async (userId) => {
  // Cambiado de userId a recipientId para que coincida con el backend
  const res = await axiosInstance.post('/request', { recipientId: userId });
  return res.data;
};

export const acceptFriendRequest = async (userId) => {
  // El backend espera senderId
  const res = await axiosInstance.post('/accept', { senderId: userId });
  return res.data;
};

export const cancelFriendRequest = async (userId) => {
  const res = await axiosInstance.post('/cancel', { userId });
  return res.data;
};

export const deleteFriend = async (userId) => {
  // El backend espera friendId
  const res = await axiosInstance.post('/remove', { friendId: userId });
  return res.data;
};

export const getMyFriends = async () => {
  const res = await axiosInstance.get('/my-friends');
  return res.data;
};

export const getFriendRequests = async () => {
  const res = await axiosInstance.get('/requests');
  return res.data;
};

export const searchUsersByName = async (name) => {
  const res = await axiosInstance.get(`/search?name=${encodeURIComponent(name)}`);
  return res.data;
};