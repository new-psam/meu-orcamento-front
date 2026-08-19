// Usamos um type explicito para evitar erros de digitação nas categorias de transação
export type TransactionType = 'INCOME' | 'EXPENSE';
export type TransactionStatus = 'PAID' | 'PENDING';
export type RecurrencePeriod = 'YEARLY' | 'MONTHLY' | 'WEEKLY' | 'DAILY';

// A entidade principal de Transação exatamente como esperamos que venha do Backend
export interface Transaction {
    id: string;
    description: string;
    amount: number;
    type: TransactionType;
    status: TransactionStatus;
    date: string;

    // Relações (Foreign Keys)
    userId: string;
    categoryId?: string | null;

    // Objetos populado (opcionais, pois dependem se o backend fez um JOIN/Populate na requisição)
    user?: {id: string; name: string | null; email: string }
    category?: {id: string; name: string; color?: string | null};

    // Recorrência
    isRecurring: boolean
    // Opcional, pois só existe se isRecurring for true
    recurrencePeriod?: RecurrencePeriod | null;
    recurrenceGroupId?: string | null;

    createdAt?: string;
    updateAt?: string;
}

// O formato dos dados que enviaremos para criar uma nova transação
export type CreateTransactionDTO = Omit<Transaction, 'id' | 'createdAt'|'updateAt' | 'user' | 'userId' | 'category'>;

// O formato para atualizar (todas as propriedades se tornam opcionais)
export type UpdateTransactionDTO = Partial<CreateTransactionDTO>;