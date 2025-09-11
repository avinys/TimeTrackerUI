import API from "../api/axios";
import type { ChangePasswordDto } from "../types/auth.types";

export const UserService = {
	async changePassword(dto: ChangePasswordDto) {
		const response = await API.post("me/password", dto);
		return response.data;
	},
};
