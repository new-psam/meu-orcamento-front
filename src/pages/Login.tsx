import { useState } from "react";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { authService } from "../services/auth.service";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"

export function Login() {
    const navigate = useNavigate()
    // Estados para guardar o que o usuário digita
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");

    // Estados para controlar o visual de carregamento e erros
    const [isLoading, setIsLoading ] = useState(false);
    const [ errorMessage, setErrorMessage ] = useState("");

    const { login } = useAuth();

    // Função que roda quando o usuário clica em "Entrar"
    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault(); // Evita que a página recarregue
        setErrorMessage("");
        setIsLoading(true);

        try {
            // Chama a ponte de comunicação
            const response = await authService.login({ email, password})

            // Se deu certo,salvamos o token no bolso do navegador
            //localStorage.setItem("@MeuOrcamento:token", response.token);
            login(response.token);

            alert("Login realizado com sucesso! 🎉");
            // Depois vamos redirecionar o usuário para o Dashboard daqui
            navigate("/dashboard");

        } catch (error) {
            console.error(error);
            setErrorMessage("E-mail ou senha incorretos. Tente Novamente.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
                <h1 className="mb-6 text-center text-3xl font-bold text-gray-800">
                    Meu Orçamento 🚀
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            E-mail
                        </label>
                        <Input
                            type="email"
                            placeholder="seu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Senha
                        </label >
                        <Input
                            type="password"
                            placeholder="senha-de-6-letras/numeros-noMinimo"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {/* Exibe o erro em vermelho se algo der errado */}
                    {errorMessage && (
                        <p className="text-sm text-red-600">{errorMessage}</p>
                    )}

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading}
                    >
                        {isLoading ? "Carregando..." : "Entrar"}
                    </Button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-600">
                    Ainda não tem uma conta?{" "}
                    <Link to="/cadastro" className="font-semibold text-blue-600 hover:underline">
                        Cadastre-se
                    </Link>
                </p>
            </div>
        </div>
    );
}