import { useEffect, useState } from "react";
import { transactionService, type Transaction } from "../services/transaction.service";
import { Input } from "./Input";
import { Button } from "./Button";
import { getTodayString } from "../utils/dateUtils";
import { X } from "lucide-react";

interface NewTransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    // Essa função sera chamada assim que a transação for salva, para avisar o Dashboard para recarregar
    onSuccess: () => void;
    editingTransaction?: Transaction | null;
}

export function NewTransactionModal({isOpen, onClose, onSuccess, editingTransaction}: NewTransactionModalProps){
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [type, setType] = useState<"INCOME" | "EXPENSE">("EXPENSE");
    const [date, setDate] = useState("");
    const [status, setStatus] = useState<"PAID" | "PENDING">("PAID");

    const [isLoading, setIsLoading] = useState(false);

    //Use um useUffect para carregar os dados quando editingTransaction mudar
    useEffect(() => {
        if (editingTransaction) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setDescription(editingTransaction.description);
            setAmount(String(editingTransaction.amount));
            setType(editingTransaction.type);
            setDate(editingTransaction.date.split('T')[0]);
            setStatus(editingTransaction.status);
        } else {
            // Limpa se for nova criação
            setDescription(""); 
            setAmount(""); 
            setType("EXPENSE"); 
            setDate(""); 
            setStatus("PAID");
        }
    }, [editingTransaction, isOpen]);

    // Se o modal não estiver aberto, o React não renderiza nada
    if (!isOpen) return null;


    // "Smart Default"
    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedDateStr = e.target.value; // Chega no formato YYYY-MM-DD
        setDate(selectedDateStr);

        if (!selectedDateStr) return;

        const todayStr = getTodayString();
    
        // Comparamos as strings (ex: '2026-07-01' > '2026-06-27')
        if (selectedDateStr > todayStr) {
            setStatus("PENDING");
        }else {
            setStatus("PAID");
        }

    };


    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!date) return;

        setIsLoading(true);

        try {
            // prepara o objeto de dados
            const transactionData = {
                description,
                amount: Number(amount),
                type,
                date: new Date(`${date}T12:00:00Z`).toISOString(),// o Zod no bacjkend exige um formato ISO de data
                status,
            }
            // decide se é criação ou Atualização
            if (editingTransaction) {
                await transactionService.update(editingTransaction.id, transactionData);
            }else{
                await transactionService.create(transactionData);
            }

            // Limpa os campos após salvar
            setDescription("");
            setAmount("");
            setType("EXPENSE");
            setDate("");
            setStatus("PAID");

            onClose(); // Fecha a janelinha
            onSuccess(); // Avisa o Dashboard para buscar os novos totais
        } catch (error) {
            console.error(error);
            alert("Erro ao criar a transação. Verifique os dados.");
        } finally {
            setIsLoading(false);
        }
    };

    return(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl relative">

                {/* Botão de fechar (x) no centro superior direito*/}
                <button
                    onClick={onClose}
                    disabled={isLoading}
                    className="absolute right-4 top-4 text-gray-500 hover:text-gray-800"
                >
                    <X size={24} />
                </button>

                <h2 className="mb-6 text-2xl font-bold text-gray-800">
                    {editingTransaction ? "Editar Transação" : "Nova Transação"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Descrição</label>
                        <Input
                            type="text"
                            placeholder="Ex: Supermercado"
                            value={description}
                            onChange={(e)=> setDescription(e.target.value)}
                            disabled={isLoading}
                            required
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Valor</label>
                        <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={amount}
                            onChange={(e)=> setAmount(e.target.value)}
                            disabled={isLoading}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">Tipo</label>
                            {/* Usano um select padrão com as classes de estilo do nosso Input para manter a harmonia visual*/}
                            <select
                                value={type}
                                onChange={(e)=> setType(e.target.value as "INCOME" | "EXPENSE")}
                                disabled={isLoading}
                                className="flex h-11 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus-border-transparent"
                            >
                                <option value="EXPENSE">Despesa</option>
                                <option value="INCOME">Receita</option>
                            </select>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">Data</label>
                            <Input
                                type="date"
                                value={date}
                                onChange={handleDateChange}
                                disabled={isLoading}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Situação</label>
                        
                        <select
                            value={status}
                            onChange={(e)=> setStatus(e.target.value as "PAID" | "PENDING")}
                            disabled={isLoading}
                            className="flex h-11 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus-border-transparent"
                        >
                            <option value="PAID">Realizado (Pago/Recebido)</option>
                            <option value="PENDING">Previsão (Pendente)</option>
                        </select>
                    </div>

                    <Button type="submit" className="w-full mt-2" disabled={isLoading}>
                        {isLoading ? "Salvando..." : "Salvar Transação"}
                    </Button>
                </form>
            </div>
        </div>
    );
}