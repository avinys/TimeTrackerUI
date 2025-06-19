import axios from "axios";

export default axios.create({
  baseURL: 'https://localhost:7129/api',
  withCredentials: true
});