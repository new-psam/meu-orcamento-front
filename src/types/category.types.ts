export interface Category {
    id: string;
    name: string;
    color?: string | null;

    // Relações (Foreign Keys)
    userId: string;

    // Objetos populado (opcionais, pois dependem se o backend fez um JOIN/Populate na requisição)
    user?: {id: string; name: string | null; email: string }

    createdAt?: string;
    updateAt?: string;
}

// O formato dos dados que enviaremos para criar uma nova categoria
export type CreateCategoryDTO = Omit<Category, 'id' | 'createdAt'|'updateAt' | 'user' | 'userId'>;

// O formato para atualizar (todas as propriedades se tornam opcionais)
export type UpdateCategoryDTO = Partial<CreateCategoryDTO>;