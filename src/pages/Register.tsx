import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/auth.service";
import { Input } from "../components/Input";
import { Button } from "../components/Button";

export function Register() {
    const [ name, setName ] = useState("");
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");

    const [ isLoading, setIsLoading ] = useState(false);
    const [ errorMessage, setErrorMessage ] = useState("");

    // Hook do react-router-dom para mudarmos de tela via código
    const navigate = useNavigate();

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMessage("");
        setIsLoading(true);

        try {
            // Chama a função de cadastro que criamos no serviço
            await authService.register({ name, email, password });

            alert("Conta criada com sucesso! 🎉 Faça login para continuar.");

            // Se der tudo certo, manda o usuário de volta para a tela de Login
            navigate("/");

        } catch (error) {
            console.error(error);
            setErrorMessage("Erro ao criar conta. Verifique os dados e tente novamente.")
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
                <h1 className="mb-6 text-center text-3xl font-bold text-gray-800">
                    Criar Conta 🚀
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Nome Completo
                        </label>
                        <Input
                            type="text"
                            placeholder="Seu nome"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

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
                        </label>
                        <Input
                            type="password"
                            placeholder="minimo-6-caracteres"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                        />
                    </div>

                    {errorMessage && (
                        <p className="text-sm text-red-600">{errorMessage}</p>
                    )}

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading}
                    >
                        {isLoading ? "Criando..." : "Cadastrar"}
                    </Button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-600">
                    Já tem uma conta?{" "}
                    {/* o componente Link substitui a tag <a> para navegar sem recarregar a página */}
                    <Link to="/" className="font-semibold text-blue-600 hover:underline">
                        Faça Login
                    </Link>
                </p>
            </div>
        </div>
    )
}