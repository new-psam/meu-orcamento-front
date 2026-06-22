import axios from "axios";

export const api = axios.create({
    // O Vite exige que a variável comece com Vite_ para expô-ls no frontend
    baseURL: import.meta.env.VITE_API_URL,
});

// Interceptor
// Antes que QUALQUER requisição sair do frontend, este bloco é executado
api.interceptors.request.use((config) => {
    // Buscamos o token que será salvo no localStorage após o login
    const token = localStorage.getItem("@MeuOrcamento:token");

    // Se o token existir, injetamos o cabeçalho de autorização
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});