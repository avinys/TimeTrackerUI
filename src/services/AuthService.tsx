// import axios from "../api/axios";
import API from "../api/axios";
import type { LoginDto, CreateUserDto, UserDto } from "../types/auth.types";

// const API = axios.create({
//   baseURL: 'https://localhost:7129/api',
//   withCredentials: true
// });

export const AuthService = {
	async login(data: LoginDto): Promise<UserDto> {
		const response = await API.post("Auth/login", data);
		console.log("Received response from login request: ", response);
		return response.data;
	},

	async register(data: CreateUserDto): Promise<UserDto> {
		const response = await API.post("Auth/register", data);
		console.log("Received response from register request: ", response);
		return response.data;
	},

	async logout(): Promise<void> {
		await API.post("Auth/logout");
	},

	async getMe(): Promise<UserDto> {
		const response = await API.get("auth/me", { withCredentials: true });
		return response.data;
	},
};
