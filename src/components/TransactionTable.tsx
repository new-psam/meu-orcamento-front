import { Edit2, Trash2 } from "lucide-react";
import { type Transaction } from "../services/transaction.service";
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
                            // Converte a data ISO para o formato brasileiro (DD/MM?YYYY)
                            // Como salvamos com T12:00:00Z, o getUTCDate garante que o dia não mude por caso do fuso horário
                            const formattedDate = formatDateBR(transaction.date);

                            return (
                                <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">{formattedDate}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{transaction.description}</td>
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