import API from "../api/axios";
import type { ContactUsDto } from "../types/contact.types";

export const ContactService = {
	async sendMessage(dto: ContactUsDto): Promise<{ message: string }> {
		const response = await API.post("contact", dto);
		return response.data;
	},
};
