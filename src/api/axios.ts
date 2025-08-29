import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "/api";

const api = axios.create({
	// baseURL,
	baseURL: "https://localhost:7129/api",
	withCredentials: true,
	headers: { "Content-Type": "application/json" },
});

export default api;
