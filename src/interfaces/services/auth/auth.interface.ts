import { User } from "@interfaces/user/user.interface";

export interface AuthResponse {
  message: string;
  data: {
    token: string;
    user: {
      id: string;
      email: string;
      name: string;
    }
  }
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest extends LoginRequest {
  name: string;
}
