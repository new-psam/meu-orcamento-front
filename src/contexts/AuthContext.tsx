import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

interface AuthContextData {
    isAuthenticated: boolean;
    login: (token: string) => void;
    logout: () => void;
}

// Cria o "auto-falante"
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children : ReactNode }) {
    // O estado que diz se estamos logados ou não
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Assim que o app abre, ele verifica se já existe um token no bolso do navegador
    useEffect(() => {
        const token = localStorage.getItem("@MeuOrcamento:token");
        if (token) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setIsAuthenticated(true);
        };

    }, []);

    const login = (token: string) => {
        localStorage.setItem("@MeuOrcamento:token", token)
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem("@MeuOrcamento:token");
        setIsAuthenticated(false);
    };

    return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para facilitar o uso nas telas
// eslint-disable-next-line react-hooks/set-state-in-effect
export function useAuth() {
    return useContext(AuthContext);
}