import { useEffect, useState } from "react";
import { transactionService } from "@/services/transaction.service";
import type {
    Transaction,
    TransactionType,
    TransactionStatus
} from "@/types/transaction.types"
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { getTodayString } from "@/utils/dateUtils";
import { Modal } from "@/components/ui/Modal/Modal";
import { Select } from "@/components/ui/Select";
import { useCategories } from "@/hooks/useCategories";
import { Plus } from "lucide-react";

interface NewTransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    // Essa função sera chamada assim que a transação for salva, para avisar o Dashboard para recarregar
    onSuccess: () => void;
    editingTransaction?: Transaction | null;
    recurringEditMode?: "SINGLE" | "ALL";
    // prop para abrir o gestor de categoorias diretamente do modal de transações
    onOpenCategoryManager?: () => void;
}

export function NewTransactionModal({
        isOpen, 
        onClose, 
        onSuccess, 
        editingTransaction,
        recurringEditMode = 'SINGLE',
        onOpenCategoryManager
    }: NewTransactionModalProps){

    const { categories, loading } = useCategories();
    const isEditing = !!editingTransaction;

    // Estado da Categoria
    const [categoryId, setCategoryId] = useState("");
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [type, setType] = useState<TransactionType>("EXPENSE");
    const [date, setDate] = useState("");
    const [status, setStatus] = useState<TransactionStatus>("PAID");
    const [isLoading, setIsLoading] = useState(false);

    const [isRecurring, setIsRecurring] = useState(false);
    const [recurrencePeriod, setRecurrencePeriod] = useState<"MONTHLY" | "YEARLY" | "WEEKLY" | "DAILY">('MONTHLY');
    const [installments, setInstallments] = useState('');


    // função de recorrência
    const getInstallmentsPlaceholder = () => {
        switch (recurrencePeriod) {
            case 'YEARLY': return 'Ex: 5';
            case 'MONTHLY': return 'Ex: 12';
            case 'WEEKLY': return 'Ex: 4';
            case 'DAILY': return 'Ex: 30';
            default: return 'Ex: 12'
        }
    };

    //Use um useEffect para carregar os dados quando editingTransaction mudar
    useEffect(() => {
        if (editingTransaction) {
            /* eslint-disable */
            // Se a transação editada tiver categoria, define o ID, senão fica vazio
            setCategoryId(editingTransaction.category?.id || editingTransaction.categoryId || "");
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setDescription(editingTransaction.description);
            setAmount(String(editingTransaction.amount));
            /* eslint-enable */
            setType(editingTransaction.type);
            setDate(editingTransaction.date.split('T')[0]);
            setStatus(editingTransaction.status);

            setIsRecurring(editingTransaction.isRecurring || false);
            if (editingTransaction.recurrencePeriod) {
                setRecurrencePeriod(editingTransaction.recurrencePeriod);
            }
        } else {
            // Limpa se for nova criação
            setCategoryId("");
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
        if (!date || !categoryId) return;

        setIsLoading(true);

        try {
            // prepara o objeto de dados
            const transactionData = {
                categoryId,
                description,
                amount: Number(amount),
                type,
                date: new Date(`${date}T12:00:00Z`).toISOString(),// o Zod no backend exige um formato ISO de data
                status,
                isRecurring,
                installments: isRecurring && installments ? Number(installments) : undefined,
                recurrencePeriod: isRecurring ? recurrencePeriod : undefined
            }
            // decide se é criação ou Atualização
            if (editingTransaction) {
                // 1. Transforma o texto "ALL" em um booleano (true ou false)
                const isUpdateAll = recurringEditMode === 'ALL';
                // Para o update, fazemos um cast forçado temporário por causa da tipagem estrita do Partial
                await transactionService.update(editingTransaction.id, transactionData, isUpdateAll);
            }else{
                await transactionService.create(transactionData);
            }

            // Limpa os campos após salvar
            setCategoryId("");
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
                    <div className="flex justify-between items-end mb-1">
                        <label className="text-sm font-medium text-gray-700 block">Categoria</label>
                        <button
                            type="button"
                            onClick={onOpenCategoryManager}
                            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
                        >
                            <Plus size={14} /> Nova Categoria
                        </button>
                    </div>
                    <Select
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        required
                        disabled={isLoading}
                        className="w-full border border-gray-300 rounded-md p-2 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        <option value="" disabled>
                            {loading ? "Carregando..." : "Selecione uma categoria..."}
                        </option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </Select>
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

                {/* --- ÁREA DE RECORRÊNCIA ---*/}
                <div className="border-t border-gray-200 pt-4 space-y-4">
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={isRecurring}
                            onChange={(e)=>{
                                setIsRecurring(e.target.checked);
                                if (!e.target.checked) {
                                    setInstallments(''); //Limpa se desmarcar
                                    setRecurrencePeriod('MONTHLY');
                                }
                            }}
                            disabled={isEditing}
                            className="disabled:opacity-50 disabled:cursor-not-allowed h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-gray-700">
                            Repetir Transação (Parcelar)
                        </span>
                    </label>

                    {/* Só renderiza os campos abaixo se o Checkbox estiver ligado*/}
                    {isRecurring && (
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="recurrencePeriod" className="mb-1 block text-sm font-medium text-gray-700">
                                    Período da Repetição
                                </label>
                                <Select
                                    id="recurrencePeriod"
                                    value={recurrencePeriod}
                                    onChange={(e)=> setRecurrencePeriod(e.target.value as "MONTHLY" | "YEARLY" | "WEEKLY" | "DAILY")}
                                    disabled={isEditing}
                                    className="disabled:bg-gray-100 disabled:text-gray-500"
                                >
                                    <option value="MONTHLY">Mensal</option>
                                    <option value="YEARLY">Anual</option>
                                    <option value="WEEKLY">Semanal</option>
                                    <option value="DAILY">Diário</option>
                                </Select>
                            </div>
                            <div>
                                <label htmlFor="installments" className="mb-1 block text-sm font-medium text-gray-700">
                                    Quantas vezes? <span className="text-gray-400 font-normal text-xs">
                                        (Opcional)</span>
                                </label>
                                <Input
                                    id="installments"
                                    type="number"
                                    min="2"
                                    max="120"
                                    placeholder={getInstallmentsPlaceholder()}
                                    value={installments}
                                    onChange={(e)=> setInstallments(e.target.value)}
                                    disabled={isEditing}
                                    className="disabled:bg-gray-100 disabled:text-gray-500"
                                />
                                <p className="mt-1 text-xs text-gray-500 leading-tight">
                                    Digite as parcelas ou deixe vazio para despesas fixas (ex: Salário).
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <Button type="submit" className="w-full mt-2" disabled={isLoading}>
                    {isLoading ? "Salvando..." : "Salvar Transação"}
                </Button>

            </form>
        </Modal>

    );
}