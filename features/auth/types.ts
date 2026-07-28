export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface MeResponse {
  user: User;
}

export interface RegisterPayload {
  name: string;
  phone: string;
  password: string;
}

export interface LoginPayload {
  phone: string;
  password: string;
}
