export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface JwtPayload {
  id: number;
  username: string;
  email: string;
}