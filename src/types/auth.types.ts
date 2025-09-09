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
