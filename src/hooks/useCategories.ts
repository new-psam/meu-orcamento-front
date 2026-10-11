import { useCallback, useEffect, useState } from 'react';
import type { Category, CreateCategoryDTO, UpdateCategoryDTO} from '../types/category.types';
import { CategoryService } from '../services/category.service';

export function useCategories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadCategories = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await CategoryService.list();
            setCategories(data);
        } catch  {
            setError('Erro ao carregar categorias.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const addCategory = async (data: CreateCategoryDTO) => {
        try {
            const newCategory = await CategoryService.create(data);
            setCategories(prev => [...prev, newCategory]);
            return newCategory;
        } catch (err) {
            setError('Erro ao adicionar categoria.');
            throw err;
        }
    };

    const updateCategory = async (id: string, data: UpdateCategoryDTO) => {
        try {
            const updatedCategory = await CategoryService.update(id, data);
            // substitui apenas a categoria editada no array atual  
            setCategories(prev => prev.map(cat => cat.id === id ? updatedCategory : cat));
            return updatedCategory;
        } catch (err) {
            setError('Erro ao atualizar categoria.');
            throw err;
        }
    };

    const removeCategory = async (id: string) => {
        // 1. chama o avso nativo do navegador
        const confirmou = window.confirm('Tem certeza que deseja remover esta categoria?');
        if (!confirmou) return;
        try{
            await CategoryService.delete(id);
            setCategories(prev=> prev.filter(cat => cat.id !== id));
            window.dispatchEvent(new Event('categoriesUpdated')); // Notifica outros componentes sobre a atualização
        
        } catch (err) {
            setError('Erro ao remover categoria.');
            throw err;
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadCategories();
        // 🎧 Cria o ouvinte para o nosso evento customizado
        const handleUpdated = () => {
            loadCategories(); // Busca no bando ce dados novamente quando o evento é disparado
        };
        // Inscreve o hook para ouvir o evento customizado
        window.addEventListener('categoriesUpdated', handleUpdated);

        // Limpeza (Cleanup) do ouvinte quando o componente que usa o hook é desmontado
        // para evitar vazamentos de memória e múltiplas inscrições do mesmo evento
        return () => {
            window.removeEventListener('categoriesUpdated', handleUpdated);
        };
    }, [loadCategories]);

    return { 
        categories, 
        loading, 
        error, 
        refreshCategories: loadCategories, 
        addCategory, 
        updateCategory,
        removeCategory 
    };
}
