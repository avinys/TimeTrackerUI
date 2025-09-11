import { useMutation } from "@tanstack/react-query";
import { ContactService } from "../services/ContactService";
import type { ContactUsDto } from "../types/contact.types";
import toast from "react-hot-toast";

export function useContactUs() {
	const { isPending, mutate } = useMutation({
		mutationFn: (dto: ContactUsDto) => ContactService.sendMessage(dto),
		onSuccess: (res) => toast.success(res?.message ?? "Message sent"),
		onError: (err: any) =>
			toast.error(err?.response?.data?.message ?? "Failed to send message"),
	});

	return { isPending, sendMessage: mutate };
}
