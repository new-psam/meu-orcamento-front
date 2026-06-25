import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export function ProtectedRoute() {
    // Pega a informação do nosso alto-falante (Context?)
    const { isAuthenticated } = useAuth();

    // Se não estiver autenticado, chuta de volta para o Login
    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    // Se estiver tudo certo, libera a passagem (renderiza o conteúdo de dentro)
    return <Outlet />;
}