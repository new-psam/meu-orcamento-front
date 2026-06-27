import { useState } from "react";
import { transactionService } from "../services/transaction.service";
import { X } from "lucide-react";
import { Input } from "./Input";
import { Button } from "./Button";

interface NewTransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    // Essa função sera chamada assim que a transação for salva, para avisar o Dashboard para recarregar
    onSuccess: () => void;
}

export function NewTransactionModal({isOpen, onClose, onSuccess}: NewTransactionModalProps){
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [type, setType] = useState<"INCOME" | "EXPENSE">("EXPENSE");
    const [date, setDate] = useState("");

    const [isLoading, setIsLoading] = useState(false);

    // Se o modal não estiver aberto, o React não renderiza nada
    if (!isOpen) return null;

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // o Zod no bacjkend exige um formato ISO de data
            // como o input type="date" devolve YYYY-MM-DD, nós convertemos ele aqui:
            const dateISO = new Date(`${date}T12:00:00Z`).toISOString();

            await transactionService.create({
                description,
                amount: Number(amount),
                type,
                date: dateISO
            });

            // Limpa os campos após salvar
            setDescription("");
            setAmount("");
            setType("EXPENSE");
            setDate("");

            onSuccess(); // Avisa o Dashboard para buscar os novos totais
            onClose(); // Fecha a janelinha
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
                    className="absolute right-4 top-4 text-gray-500 hover:text-gray-800"
                >
                    <X size={24} />
                </button>

                <h2 className="mb-6 text-2xl font-bold text-gray-800">Nova Transação</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Descrição</label>
                        <Input
                            type="text"
                            placeholder="Ex: Supermercado"
                            value={description}
                            onChange={(e)=> setDescription(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Valor</label>
                        <Input
                            type="number"
                            placeholder="0.01"
                            value={amount}
                            onChange={(e)=> setAmount(e.target.value)}
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
                                onChange={(e)=> setDate(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <Button type="submit" className="w-full mt-2" disabled={isLoading}>
                        {isLoading ? "Salvando..." : "Salvar Transação"}
                    </Button>
                </form>
            </div>
        </div>
    );
}