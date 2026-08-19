import { api } from "./api";

// 1. importamos as entidade centralizadas que acabamos de criar
import type {
    Transaction,
    CreateTransactionDTO,
    UpdateTransactionDTO,
    TransactionStatus
} from "../types/transaction.types";

// ============================================================================
// Tipagens exclusivas de Resposta da API e Filtros (Ficam no serviço)
// ============================================================================

export interface TransactionSummary {
    incomes: number;
    expenses: number;
    balance: number;
}

// interface para os filtros opcionais da lista
export interface GetTransactionsParams {
    month?: number;
    year?: number;
    page?: number;
    limit?: number;
    categoryId?: string;
    status?: TransactionStatus;
}

// O formato que o backend devolve
export interface PaginatedTransactions {
    data: Transaction[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPage: number;
    }
}

// ============================================================================
// Métodos de Serviço
// ============================================================================

export const transactionService = {
    async getAll(params?: GetTransactionsParams): Promise<PaginatedTransactions> {
        // O axios automaticamente transforma esse objeto { params } na string da URL (?month=6&page=1...)
        const response = await api.get<PaginatedTransactions>("/transactions", { params });
        return response.data;
    },

    async getSummary(month: number, year: number, status?: TransactionStatus): Promise<TransactionSummary>{
        const response = await api.get<TransactionSummary>("/transactions/summary", 
            { params: {month, year, status  }}
        );
        return response.data
    },


    async create(data: CreateTransactionDTO): Promise<Transaction> {
        const response = await api.post<Transaction>("/transactions", data);
        return response.data;
    },

    async update(id: string, data: UpdateTransactionDTO) : Promise<Transaction> {
        const response = await api.put<Transaction>(`/transactions/${id}`, data);
        return response.data;
    },

    async delete(id: string): Promise<void>{
        await api.delete(`/transactions/${id}`);
    }
};