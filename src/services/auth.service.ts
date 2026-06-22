import { api } from "./api";

export interface LoginData {
    email: string;
    password: string;
}

export interface RegisterData extends LoginData {
    name: string;
}

export const authService = {
    // Função para logar o usuário
    async login(data: LoginData) {
        const response = await api.post("/auth/signin", data);
        return response.data
    },

    // Função para cadastrar o usuário
    async register(data: RegisterData) {
        const response = await api.post("/auth/signup", data);
        return response.data;
    }
};