import axios from "axios"

const api = axios.create({
  baseURL: "https://chatbubble-production.up.railway.app/api",
  withCredentials: true,
});

export default api;