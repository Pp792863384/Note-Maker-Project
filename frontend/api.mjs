import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

export const registerUser = (data) => {
  return axios.post(`${API_URL}/register`, data);
};

