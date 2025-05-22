import axios from "axios";

const API = "http://localhost:4000/api";

// Configuración común para axios
const axiosConfig = {
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  }
};

// Autenticación
export const registerRequest = (user) =>
  axios.post(`${API}/register`, user, axiosConfig);

export const loginRequest = (user) =>
  axios.post(`${API}/login`, user, axiosConfig);

export const logoutRequest = () =>
  axios.post(`${API}/logout`, {}, axiosConfig);

export const verifyTokenRequest = () =>
  axios.get(`${API}/verify`, axiosConfig);

// Tareas/Publicaciones
export const createTask = async (taskData, imageFile) => {
  const formData = new FormData();
  formData.append("text", taskData.text);
  if (imageFile) formData.append("image", imageFile);

  return axios.post(`${API}/task`, formData, {
    ...axiosConfig,
    headers: { "Content-Type": "multipart/form-data" }
  });
};

export const getTasks = () =>
  axios.get(`${API}/task`, axiosConfig);

export const getTask = (id) =>
  axios.get(`${API}/task/${id}`, axiosConfig);

export const updateTask = async (id, taskData, imageFile) => {
  const formData = new FormData();
  formData.append("text", taskData.text);
  if (imageFile) formData.append("image", imageFile);

  return axios.put(`${API}/task/${id}`, formData, {
    ...axiosConfig,
    headers: { "Content-Type": "multipart/form-data" }
  });
};

export const deleteTask = (id) =>
  axios.delete(`${API}/task/${id}`, axiosConfig);

// Perfil y foto de perfil
export const updateProfilePhoto = async (imageFile) => {
  const formData = new FormData();
  formData.append("profilePicture", imageFile);

  return axios.put(`${API}/profile/photo`, formData, {
    ...axiosConfig,
    headers: { "Content-Type": "multipart/form-data" }
  });
};

export const deleteProfilePhoto = () =>
  axios.delete(`${API}/profile/photo`, axiosConfig);

export const getProfile = () =>
  axios.get(`${API}/profile`, axiosConfig);

// Amigos
export const getFriends = () =>
  axios.get(`${API}/friends/my-friends`, axiosConfig);

export const getFriendRequests = () =>
  axios.get(`${API}/friends/requests`, axiosConfig);

export const sendFriendRequest = (userId) =>
  axios.post(`${API}/friends/request`, { userId }, axiosConfig);

export const acceptFriendRequest = (userId) =>
  axios.post(`${API}/friends/accept`, { userId }, axiosConfig);

export const rejectFriendRequest = (userId) =>
  axios.post(`${API}/friends/reject`, { userId }, axiosConfig);

export const removeFriend = (userId) =>
  axios.post(`${API}/friends/remove`, { userId }, axiosConfig);

export const searchUsers = (query) =>
  axios.get(`${API}/friends/search?q=${query}`, axiosConfig);

// Manejo de errores global
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Redirigir al login si el token expiró
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);