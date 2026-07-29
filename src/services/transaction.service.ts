import { api } from "./api";

// Definimos o formato exato que uma transação tem no nosso sistema
export interface Transaction {
    id: string;
    description: string;
    amount: number;
    type: "INCOME" | "EXPENSE";
    status: "PAID" | "PENDING";
    date: string
    categoryId?: string;
}

// O formato exato para criar sem o ID
export interface CreateTransactionData {
    description: string;
    amount: number;
    type: "INCOME" | "EXPENSE";
    date: string
    status?: "PAID" | "PENDING";
    categoryId?: string;
}

export interface UpdateTransactionData extends Partial<CreateTransactionData> {}

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
    status?: "PAID"| "PENDING";
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

export const transactionService = {
    async getAll(params?: GetTransactionsParams): Promise<PaginatedTransactions> {
        // O axios automaticamente transforma esse objeto { params } na string da URL (?month=6&page=1...)
        const response = await api.get<PaginatedTransactions>("/transactions", { params });
        return response.data;
    },

    async getSummary(month: number, year: number, status?: "PAID" | "PENDING"): Promise<TransactionSummary>{
        const response = await api.get<TransactionSummary>("/transactions/summary", 
            { params: {month, year, status  }}
        );
        return response.data
    },


    async create(data: CreateTransactionData): Promise<Transaction> {
        const response = await api.post<Transaction>("/transactions", data);
        return response.data;
    },

    async update(id: string, data: UpdateTransactionData) : Promise<Transaction> {
        const response = await api.put<Transaction>(`/transactions/${id}`, data);
        return response.data;
    },

    async delete(id: string): Promise<void>{
        await api.delete(`/transactions/${id}`);
    }
};