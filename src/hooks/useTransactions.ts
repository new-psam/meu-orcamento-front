import { useState, useCallback, useEffect } from "react";
import { transactionService,  type Transaction, type TransactionSummary} from "../services/transaction.service";

type FilterType = "ALL" | "PAID" | "PENDING"

export function useTransactions(){
    // 1. Estados de Data
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1);
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    
    // 2. Estados de Dados e Interface
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [summary, setSummary] = useState<TransactionSummary>({ incomes: 0, expenses: 0, balance: 0 });
    const [filter, setFilter] = useState<FilterType>("ALL");
    const [meta, setMeta] = useState({page: 1, totalPage: 1, total: 0});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError]= useState("");

    // 3. Funça de carregamento (Resumo + Transações)
    const loadData = useCallback(async (page: number = 1) => {
        try {
            setIsLoading(true);

            // Disparamos as duas chamadas ao mesmo tempo para ganhar perfomance
            const [transactionRes, summaryRes] = await Promise.all([
                transactionService.getAll({
                    page: page,
                    limit: 15,
                    month: currentMonth,
                    year: currentYear,
                    status: filter === "ALL" ? undefined : filter
                }),
                transactionService.getSummary(currentMonth, currentYear)
            ]);

            //Aqui a grande sacada: pegamos apenas a array de transações do objeto
            setTransactions(transactionRes.data);
            // E guardamos as informações de paginação para usarmos no rodapé
            setMeta(transactionRes.meta);
            setSummary(summaryRes);
            setError("");
        } catch (error) {
            console.error("Erro ao buscar as transações: ", error);
            setError("Não foi possível carregar os dados. Tente novamente mais tarde");
        }finally{
            setIsLoading(false);
        }
    }, [currentMonth, currentYear, filter]);

    // 4. Efeito Inicial
    useEffect(() =>{
        loadData(1);
    }, [loadData]);

    // 5. Funções de Navegação 
    const handlePreviousMonth = ()=> {
        if (currentMonth === 1){
            setCurrentMonth(12);
            setCurrentYear(prev => prev - 1);
        } else {
            setCurrentMonth(prev => prev - 1);
        }
    };

    const handleNextMonth = ()=> {
        if (currentMonth === 12){
            setCurrentMonth(1);
            setCurrentYear(next => next + 1);
        } else {
            setCurrentMonth(next => next + 1);
        }
    };

    // 6. paginação
    const handlePageChange = (newPage: number) => {
        loadData(newPage);
    }

    return {
        transactions,
        summary,
        filter,
        setFilter,
        isLoading,
        error,
        meta,
        handlePageChange,
        currentMonth,
        currentYear,
        handlePreviousMonth,
        handleNextMonth,
        loadData
    };

}