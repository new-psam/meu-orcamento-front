import { beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "./api";
import { CategoryService } from "./category.service";

// Intercepta as chamadas do Axios/Fetch
vi.mock('./api' );

describe('CategoryService', () => {
    beforeEach(() => {
        vi.clearAllMocks(); // Limpa os mocks antes de cada teste
    });

    const mockCategory = {
        id: 'cat-1',
        name: 'Alimentação',
        color: '#FF5733',
        userId: 'user-1',
    };

    it('deve listar as categorias com sucesso (GET)', async () => {
        vi.mocked(api.get).mockResolvedValue({ data: [mockCategory] });

        const result = await CategoryService.list();
        
        expect(api.get).toHaveBeenCalledWith('/categories');
        expect(result).toEqual([mockCategory]);
        expect(result).toHaveLength(1);
    });

    it('deve criar uma categoria com sucesso (POST)', async () => {
        const newCategoryDto = { name: 'Transporte', color: '#33FF57'};
        const createdCategory = {id: 'cat-2', ...newCategoryDto, userId: 'user-1'};

        vi.mocked(api.post).mockResolvedValue({ data: createdCategory });

        const result = await CategoryService.create(newCategoryDto);
        
        expect(api.post).toHaveBeenCalledWith('/categories', newCategoryDto);
        expect(result).toEqual(createdCategory);
    });

    it('deve atualizar uma categoria com sucesso (PUT)', async () => {
        const updatedDto = { name: 'Alimentação Atualizada'};
        const updatedCategory = { ...mockCategory, ...updatedDto };

        vi.mocked(api.put).mockResolvedValueOnce({ data: updatedCategory });

        const result = await CategoryService.update(mockCategory.id, updatedDto);
        
        expect(api.put).toHaveBeenCalledWith(`/categories/${mockCategory.id}`, updatedDto);
        expect(result).toEqual(updatedCategory);
    });

    it('deve deletar uma categoria com sucesso (DELETE)', async () => {
        vi.mocked(api.delete).mockResolvedValueOnce({ data: {message: 'Deleted '} });

        await CategoryService.delete(mockCategory.id);
        
        expect(api.delete).toHaveBeenCalledWith(`/categories/${mockCategory.id}`);
    });
});