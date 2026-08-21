import { useEffect, useState } from "react";
import { transactionService } from "../services/transaction.service";
import type {
    Transaction,
    TransactionType,
    TransactionStatus
} from "../types/transaction.types"
import { Input } from "./Input";
import { Button } from "./Button";
import { getTodayString } from "../utils/dateUtils";
import { Modal } from "./Modal";
import { Select } from "./Select";

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
    const [type, setType] = useState<TransactionType>("EXPENSE");
    const [date, setDate] = useState("");
    const [status, setStatus] = useState<TransactionStatus>("PAID");

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
                date: new Date(`${date}T12:00:00Z`).toISOString(),// o Zod no backend exige um formato ISO de data
                status,
                isRecurring: false
            }
            // decide se é criação ou Atualização
            if (editingTransaction) {
                // Para o update, fazemosum cast forçado temporário por causa da tipagem estrita do Partial
                await transactionService.update(editingTransaction.id, transactionData);
            }else{
                // aqui usamos as 'as any'temporariamente caso o backend não precise receber o userId pelo front (se for via token)
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
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={editingTransaction ? "Editar Transação" : "Nova Transação"}
            isLoading={isLoading}
        >
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
                        <Select
                            value={type}
                            onChange={(e)=> setType(e.target.value as TransactionType)}
                            disabled={isLoading}
                        >
                            <option value="EXPENSE">Despesa</option>
                            <option value="INCOME">Receita</option>
                        </Select>
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
                    
                    <Select
                        value={status}
                        onChange={(e)=> setStatus(e.target.value as TransactionStatus)}
                        disabled={isLoading}
                        className="flex h-11 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus-border-transparent"
                    >
                        <option value="PAID">Realizado (Pago/Recebido)</option>
                        <option value="PENDING">Previsão (Pendente)</option>
                    </Select>
                </div>

                <Button type="submit" className="w-full mt-2" disabled={isLoading}>
                    {isLoading ? "Salvando..." : "Salvar Transação"}
                </Button>

            </form>
        </Modal>

    );
}