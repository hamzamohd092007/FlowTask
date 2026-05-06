import axios from "axios";

const VITE_SERVER_URL = import.meta.env.VITE_SERVER_URL;

const API = axios.create({
  baseURL: `${VITE_SERVER_URL}/api`,
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;