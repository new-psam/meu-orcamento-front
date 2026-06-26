import { LayoutDashboard, LogOut, Menu, Receipt } from "lucide-react";
import { Button } from "../components/Button";
import { useAuth } from "../contexts/AuthContext";

export function Dashboard() {
    const { logout } = useAuth();

    return (
        <div className="flex min-h-screen flex-col bg-gray-50 md:flex-row">
            {/* ------------------- Barra Lateral (Desktop) -------------------------- */}
            <aside className="hidden w-64 flex-col border-r bg-white px-4 py-6 md:flex">
                <div className="mb-8 flex items-center gap-2 px-2">
                    <div className="flex h-8 w-8 items-center justify-center bg-blue-600 rounded-full font-bold text-white">
                        M
                    </div>
                    <span className="text-xl font-bold text-gray-800">Meu Orçamento</span>
                </div>

                <nav className="flex-1 space-y-2">
                    <a href="#" className="flex items-center gap-3 bg-blue-50 rounded-lg px-3 py-2 text-blue-700 transition-colors">
                        <LayoutDashboard size={20} />
                        <span className="font-medium">Visão Geral</span>
                    </a>
                    <a href="#" className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-600 transition-colors hover:bg-gray-100">
                        <Receipt size={20} />
                        <span className="font-medium">Transações</span>
                    </a>
                </nav>

                <div>
                    <button
                        onClick={logout}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-red-600 transition-colors hover:bg-red-50"
                    >
                        <LogOut size={20} />
                        <span className="font-medium ">Sair da Conta</span>
                    </button>
                </div>
            </aside>

            {/* ---------------------- CABEÇALHO -----------------------------*/}
            <header className="flex items-center justify-between border-b bg-white p-4 md:hidden">
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center bg-blue-600 rounded-full font-bold text-white">
                        M
                    </div>
                    <span className="text-xl font-bold text-gray-800">Meu Orçamento</span>
                </div>
                <button className="text-gray-600">
                    <Menu size={24} />
                </button>
            </header>

            {/* ---------------------------- ÁREA DE CONTEÚDO PRINCIPAL --------------------------*/}
            <main className="flex-1 p-6 md:p-8">
                <header className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-800">Visão Geral</h1>
                    <p className="text-gray-600">Acompanhe suas finanças deste mês.</p>
                </header>

                {/* Grid dos Cards de Resumo*/}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="bg-white rounded-xl border p-6 shadow-sm">
                        <h3 className="text-sm font-medium text-gray-500">Saldo Atual</h3>
                        <p className="mt-2 text-3xl font-bold text-gray-900">R$ 0,00</p>
                    </div>

                    <div className="bg-white rounded-xl border p-6 shadow-sm">
                        <h3 className="text-sm font-medium text-gray-500">Receitas</h3>
                        <p className="mt-2 text-3xl font-bold text-gray-900">R$ 0,00</p>
                    </div>

                    <div className="bg-white rounded-xl border p-6 shadow-sm">
                        <h3 className="text-sm font-medium text-gray-500">Despesas</h3>
                        <p className="mt-2 text-3xl font-bold text-gray-900">R$ 0,00</p>
                    </div>
                </div>
            </main>
        </div>
    );
}