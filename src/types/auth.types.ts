export interface LoginDto {
	identifier: string;
	password: string;
}

export interface CreateUserDto {
	username: string;
	email: string;
	password: string;
}

export interface UserDto {
	id: number;
	username: string;
	email: string;
	role: string;
}

export interface AuthContextType {
	user: UserDto | null;
	setUser: (user: UserDto | null) => void;
	loading: boolean;
}

export interface LoginWithGoogleDto {
	idToken: string;
}

export interface ResendConfirmationDto {
	email: string;
}

export interface ConfirmEmailDto {
	userId: number;
	token: string;
}

export interface ForgotPasswordDto {
	email: string;
}

export interface ResetPasswordDto {
	userId: number;
	token: string;
	newPassword: string;
}

export interface ChangePasswordDto {
	currentPassword: string;
	newPassword: string;
}
