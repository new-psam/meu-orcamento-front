import { Edit2, Trash2 } from "lucide-react";
import  type { Transaction } from "../types/transaction.types";
import { formatDateBR } from "../utils/dateUtils";
import { formatCurrency } from "../utils/formatCurrency";

interface TransactionTablePros {
    transactions: Transaction[];
    isLoading: boolean;
    onEdit: (transaction: Transaction)=> void;
    onDelete: (id: string) => void;
}

export function TransactionTable({ transactions, isLoading, onEdit, onDelete}: TransactionTablePros) {
    if (isLoading) {
        return (
            <div className="mt-8 rounded-xl border bg-white p-6 shadow-sm">
                <div className="flex animate-pulse flex-col space-y-4">
                    <div className="h-10 w-full rounded bg-gray-200"></div>
                    <div className="h-10 w-full rounded bg-gray-200"></div>
                    <div className="h-10 w-full rounded bg-gray-200"></div>
                </div>
            </div>
        );
    }

    if (transactions.length === 0) {
        return (
            <div className="mt-8 rounded-xl border bg-white p-12 text-center shadow-sm">
                <p className="text-gray-500">Nenhuma transação encontrada para esse filtro.</p>
            </div>
        );
    }

    return (
        <div className="mt-8 overflow-hidden rounded-xl border bg-white shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-600">
                    <thead className="border-b bg-gray-50 text-gray-900">
                        <tr>
                            <th className="px-6 py-4 font-medium">Data</th>
                            <th className="px-6 py-4 font-medium">Descrição</th>
                            <th className="px-6 py-4 font-medium">Situação</th>
                            <th className="px-6 py-4 text-right font-medium">Valor</th>
                            <th className="px-6 py-4 text-right font-medium">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {transactions.map((transaction) => {
                            // 1. A MÁGICA ACONTECE AQUI: Verifica se a descrição tem o padrão (1/10)
                            const isInstallment = /\(\d+\/\d+\)/.test(transaction.description);
                            
                            // Converte a data ISO para o formato brasileiro (DD/MM?YYYY)
                            // Como salvamos com T12:00:00Z, o getUTCDate garante que o dia não mude por caso do fuso horário
                            const formattedDate = formatDateBR(transaction.date);

                            return (
                                <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">{formattedDate}</td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm font-medium text-gray-700">
                                                {transaction.description}
                                            </span>

                                            {/* Badge Dinâmica: Roxa para Parcelado, Azul para Fixo */}
                                            {transaction.isRecurring && (
                                                <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                                                    isInstallment
                                                        ? "bg-purple-50 text-purple-700 ring-purple-700/10"
                                                        : "bg-blue-50 text-blue-700 ring-blue-700/10"
                                                }`}>
                                                    {/* Opcional: Você pode até trocar o SVG do ícone aqui se quiser! */}
                                                    <svg className="mr-1 h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                                                    </svg>
                                                    {isInstallment ? "Parcelado" : "Fixo"}
                                                </span>
                                            )}
                                        </div>
                                    </td>

                                    <td className="px-6 py-4">
                                        {transaction.status === 'PAID' ? (
                                            <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                                Realizado
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center rounded-full bg-yellow-50 px-2.5 py-0.5 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
                                                Previsão
                                            </span>
                                        )}
                                    </td>
                                    <td className={`px-6 py-4 text-right font-bold whitespace-nowrap ${
                                        transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                        {transaction.type === 'EXPENSE' ? '- ' : '+ '}
                                        {formatCurrency(transaction.amount)}
                                    </td>
                                    {/* Botões de ação*/}
                                    <td className="px-6 py-4 text-right whitespace-nowrap">
                                        <button
                                            onClick={()=> onEdit(transaction)}
                                            className="text-blue-600 hover:text-blue-800 mr-3 transition-colors"
                                            title="Editar"
                                        >
                                            <Edit2 size={18}/>
                                        </button>
                                        <button
                                            onClick={()=> onDelete(transaction.id)}
                                            className="text-red-600 hover:text-red-800 mr-3 transition-colors"
                                            title="Excluir"
                                        >
                                            <Trash2 size={18}/>
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}