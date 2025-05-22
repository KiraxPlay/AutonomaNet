import axios from "axios";

const API = "http://localhost:4000/api";

// Configuración base de axios
const instance = axios.create({
  baseURL: API,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  }
});

// Interceptor para manejar errores de autenticación sin refresh
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // En lugar de recargar, actualizar el estado de autenticación
      return Promise.reject({ authError: true, ...error });
    }
    return Promise.reject(error);
  }
);

export const registerRequest = (user) =>
  instance.post("/register", user);

export const loginRequest = (user) =>
  instance.post("/login", user);

export const verifyTokenRequest = () =>
  instance.get("/verify");

export const logoutRequest = () =>
  instance.post("/logout");

export const createTask = async (taskData, imageFile) => {
  const formData = new FormData();
  formData.append("text", taskData.text);
  if (imageFile) formData.append("image", imageFile);

  return instance.post("/task", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
};

// Resto de las funciones usando la instancia de axios
export const getTasks = () => instance.get("/task");
export const getTask = (id) => instance.get(`/task/${id}`);
export const updateTask = (id, data) => instance.put(`/task/${id}`, data);
export const deleteTask = (id) => instance.delete(`/task/${id}`);