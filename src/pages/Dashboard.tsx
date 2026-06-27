import { AlertCircle, LayoutDashboard, LogOut, Menu, Plus, Receipt } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useCallback, useEffect, useState } from "react";
import { transactionService, type TransactionSummary } from "../services/transaction.service";
import { SummaryCard } from "../components/SummaryCard";
import { NewTransactionModal } from "../components/NewTransactionModal";

export function Dashboard() {
    const { logout } = useAuth();

    // 1. Criamos um estado para guardar o resumo. Começa zerado
    const [summary, setSummary] = useState<TransactionSummary>({
        balance: 0,
        incomes: 0,
        expenses: 0
    });

    // Estado para sabermos se esta carregando (mostra um texto de espera na tela)
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    // Estado que controla se o modal esta visível ou não
    const [isModalOpen, setIsModalOpen] = useState(false);

    const loadSummary = useCallback(async ()=> {
        try {
            setIsLoading(true);
            const data = await transactionService.getSummary();
            setSummary(data);
            setError(""); // Limpa qualquer erro anterior

        } catch (error) {
            console.error("Erro ao buscar o resumo financeiro:", error);
            setError("Não foi possível carregar o resumo financeiro.Tendte novamente mais tarde");
 
        }finally{
            setIsLoading(false) // avisa que terminou de carregar
        }
    }, []);


    // 2. O useEffect dispara assim que a tela abre
    useEffect(() => {
         loadSummary();

    }, [loadSummary]);  // Essa array vazia [] means "rode apenas uma vez quando abrir a tela"


    return (
        <div className="flex min-h-screen flex-col bg-gray-50 md:flex-row">

            {/* O Modal invisível fica esperando o comando para aparecer*/}
            <NewTransactionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={loadSummary} // Quando salvar, ele chama o loadSumary novamente!
            />

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
                {/* Ajustamos o para acomodar o botão "Nova Transação"*/}
                <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Visão Geral</h1>
                        <p className="text-gray-600">Acompanhe suas finanças deste mês.</p>
                    </div>

                    {/* Botão que aciona oestado para abrir o modal */}
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
                    >
                        <Plus size={20} />
                        Nova Transação
                    </button>
                </header>

                {/* Exibição amigável de erro, caso o servidor falhe*/}
                {error && (
                    <div className="mb-6 flex items-center gap-2 rounded-lg bg-red-50 p-4 text-red-600 border border-red-200">
                        <AlertCircle size={20} />
                        <p>{error}</p>
                    </div>
                )}

                {/* Grid dos Cards de Resumo*/}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

                    <SummaryCard 
                        title="Saldo Atual"
                        amount={summary.balance}
                        type="balance"
                        isLoading={isLoading}
                    />

                    <SummaryCard 
                        title="Receitas"
                        amount={summary.incomes}
                        type="income"
                        isLoading={isLoading}
                    />

                    <SummaryCard 
                        title="Despesas"
                        amount={summary.expenses}
                        type="expense"
                        isLoading={isLoading}
                    />

                </div>
            </main>
        </div>
    );
}