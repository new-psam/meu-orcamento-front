import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";

export function Dashboard() {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Remove o token da memória
        localStorage.removeItem("@meuOrcamento:token");
        // Manda de volta para o login
        navigate("/");
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg text-center">
                <h1 className="mb-4 text-2xl font-bold text-gray-800">
                    Bem vindo ao Dashboard! 📊
                </h1>
                <p className="mb-6 text-gray-600">
                    Seu login foi feito com sucesso e você esta na área logada!
                </p>

                <Button onClick={handleLogout} variant="danger" className="w-full">
                    Sair da Conta
                </Button>
            </div>
        </div>
    );
}