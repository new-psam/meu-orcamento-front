import { api } from "./api";

// Definimos o formato exato que uma transação temno nosso sistema
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

export const transactionService = {
    async getAll(): Promise<Transaction[]> {
        const response = await api.get<Transaction[]>("/transactions");
        return response.data;
    },

    async getSummary(): Promise<TransactionSummary>{
        const response = await api.get<TransactionSummary>("/transactions/summary");
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