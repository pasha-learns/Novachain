export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

export interface StoredUser {
  id: string;
  email: string;
  passwordHash: string;
}

export interface TokenPayload {
  email: string;
  iat: number;
  exp: number;
}
