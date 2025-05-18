// src/api/auth.js
import axios from "axios";

const API = "http://localhost:4000/api";

export const registerRequest = (user) =>
  axios.post(`${API}/register`, user, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    withCredentials: true,
  });

export const loginRequest = (user) =>
  axios.post(`${API}/login`, user, {
    withCredentials: true,
  });

export const createTask = async (taskData, imageFile) => {
  const formData = new FormData();
  formData.append("text", taskData.text);
  if (imageFile) formData.append("image", imageFile);

  const response = await axios.post(`${API}/task`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
    withCredentials: true,
  });
  return response.data;
};
