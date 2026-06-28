import { useState, useCallback, useMemo, useEffect } from "react";
import { transactionService, type Transaction, type TransactionSummary } from "../services/transaction.service";

type FilterType = "ALL" | "PAID" | "PENDING"

export function useTransactions(){
    // 1. Estados de Data
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1);
    const [currentYear, setCurrentYear] = useState(today.getFullYear());

    // 2. Estados de Dados e Interface
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [filter, setFilter] = useState<FilterType>("ALL");
    const [meta, setMeta] = useState({page: 1, lastPage: 1, total: 0});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError]= useState("");

    // 3 função de carregamento
    const loadData = useCallback(async (page: number = 1) => {
        try {
            setIsLoading(true);
            const response = await transactionService.getAll({
                page: page,
                month: currentMonth,
                year: currentYear
            });
            //Aqui a grande sacada: pegamos apenas a array de transações do objeto
            setTransactions(response.data);
            // E guardamos as informações de paginação para usarmos no rodapé
            setMeta(response.meta);
            setError("");
        } catch (error) {
            console.error("Erro ao buscar as transações: ", error);
            setError("Não foi possível carregar os dados. Tente novamente mais tarde");
        }finally{
            setIsLoading(false);
        }
    }, [currentMonth, currentYear]);

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

    // 7. Dados Derivados (Filtro e Resumo)
    const filteredTransactions = useMemo(()=> {
        const safeTransactions = Array.isArray(transactions) ? transactions : [];
        if (filter === "ALL") return safeTransactions;
        return safeTransactions.filter(t => t.status === filter);
    }, [transactions, filter])

    const summary = useMemo(() => {
        const {incomes, expenses } =  filteredTransactions.reduce(
            (acc, transaction) => {
                const amount = Number(transaction.amount) || 0;
                if (transaction.type === "INCOME") {
                    acc.incomes += amount;
                } else {
                    acc.expenses += amount;
                }
                
                return acc;
            },
            {   incomes: 0,
                expenses: 0
            }
        );
        return {
            incomes,
            expenses,
            balance: incomes - expenses
        }
    }, [filteredTransactions])

    // 8. Exportando o que a interface vai precisar consumir
    return {
        transactions: filteredTransactions,
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