import { AlertCircle, LayoutDashboard, LogOut, Menu, Plus, Receipt } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";
import { SummaryCard } from "../components/SummaryCard";
import { NewTransactionModal } from "../components/NewTransactionModal";
import { TransactionTable } from "../components/TransactionTable";
import { useTransactions } from "../hooks/useTransactions";
import { Pagination } from "../components/Pagination";
import { MonthSelector } from "../components/MonthSelector";
import { transactionService, type Transaction } from "../services/transaction.service";

export function Dashboard() {
    const { logout } = useAuth();

    // O modal controla a UI local, fica no componente
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)

    //mágica do hook: extraimos apenas o que o JSX precisa desenhar
    const {
        transactions,
        summary,
        filter,
        setFilter,
        isLoading,
        error,
        meta,
        handlePageChange,
        loadData,
        handleNextMonth,
        currentMonth,
        currentYear,
        handlePreviousMonth
    } = useTransactions();

    // Funções de Ação
    const handleEdit = (transaction: Transaction) => {
        setEditingTransaction(transaction);
        setIsModalOpen(true);
    }

    const handleDelete = async (id: string) => {
        if (confirm("Tem certeza que deseja excluir esta transação?")){
            await transactionService.delete(id);
            loadData();
        }
    }

    return (
        <div className="flex min-h-screen flex-col bg-gray-50 md:flex-row">

            {/* O Modal invisível fica esperando o comando para aparecer*/}
            <NewTransactionModal
                isOpen={isModalOpen}
                onClose={() => {
                    setEditingTransaction(null);
                    setIsModalOpen(false);
                }}
                onSuccess={loadData} // Quando salvar, ele chama o loadSumary novamente!
                editingTransaction={editingTransaction}
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
                        onClick={() => {setEditingTransaction(null); setIsModalOpen(true)}}
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

                {/* Filtro de Mês e ano */}
                <MonthSelector
                    month={currentMonth}
                    year={currentYear}
                    onPrevious={handlePreviousMonth}
                    onNext={handleNextMonth}
                />

                {/* Grid dos Cards de Resumo*/}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

                    <SummaryCard 
                        title={filter === "PENDING" ? "Saldo Projetado" : "Saldo Atual"}
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

                {/* Botões de filtro */}
                <div className="mt-12 flex gap-2 border-b pb-4">
                    <button
                        onClick={() => setFilter("ALL")}
                        className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${filter === "ALL" ? "bg-gray-900 text-white" : "bg-white text-gray-600 hover:bg-gray-100 border"}`}
                    >
                        Visão Geral
                    </button>
                    <button
                        onClick={() => setFilter("PAID")}
                        className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${filter === "PAID" ? "bg-green-600 text-white" : "bg-white text-gray-600 hover:bg-gray-100 border"}`}
                    >
                        Realizado
                    </button>
                    <button
                        onClick={() => setFilter("PENDING")}
                        className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${filter === "PENDING" ? "bg-yellow-500 text-white" : "bg-white text-gray-600 hover:bg-gray-100 border"}`}
                    >
                        Previsões
                    </button>
                </div>

                {/* A nossa tabela entra aqui*/}
                <TransactionTable
                    transactions={transactions}
                    isLoading={isLoading}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />

                {/* componente da paginação aqui*/}
                <Pagination
                    page={meta.page}
                    totalPage={meta.lastPage}
                    total={meta.total}
                    isLoading={isLoading}
                    onPageChange={handlePageChange}
                />
            </main>
        </div>
    );
}