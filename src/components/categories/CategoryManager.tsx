import { useCategories } from "@/hooks/useCategories";
import { useState } from "react";
import type { Category } from "@/types/category.types";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Pencil, Trash, X } from "lucide-react";

// Paleta fixa baseada nas cores do Tailwind (garante consistência no design system)
const PREDEFINED_COLORS = [
    '#EF4444', // red
    '#F97316', // orange
    '#EAB308', // yellow
    '#22C55E', // green
    '#10B981', // emerald
    '#06B6D4', // cyan
    '#3B82F6', // blue
    '#8B5CF6', // violet
    '#D946EF', // fuchsia
    '#6B7280', // gray
];

interface CategoryManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CategoryManager({ isOpen, onClose }: CategoryManagerProps) {
    const {categories, addCategory, updateCategory, removeCategory, loading, error} = useCategories();
    const [name, setName] = useState('');
    const [color, setColor] = useState(PREDEFINED_COLORS[6]); // cor padrão azul do Tailwind
    const [editingId, setEditingId] = useState<string | null>(null);

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!name.trim()) return;

        try {
            if (editingId) {
                await updateCategory(editingId, { name, color });
                setEditingId(null);
            } else {
                await addCategory({ name, color });
            }
            setName('');
            setColor(PREDEFINED_COLORS[6]); // reseta para azul padrão
        } catch (err) {
            // O hook já seta a mensagem de erro no estado, mas o catch evita 
            // que a aplicação quebre silenciosamente caso a promessa seja rejeitada
            console.error(err);
        }
    };

    const handleEditClick = (cat: Category) => {
        setEditingId(cat.id);
        setName(cat.name);
        // Se a categoria antiga tiver uma cor fora da paleta, mantém-na; caso contrário, usa o azul
        setColor(cat.color || PREDEFINED_COLORS[6]); // fallback para azul padrão
    };

    const cancelEdit = () => {
        setEditingId(null);
        setName('');
        setColor(PREDEFINED_COLORS[6]); // reseta para azul padrão
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Gerenciar Categorias" isLoading={loading}>
            <div className="space-y-6">

                {/* Exibição de alerta de erro */}
                {error && (
                    <div className="p-3 rounded-md bg-red-50 text-sm text-red-700 border border-red-200">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex gap-2 items-end">
                        <div className="flex-1">
                            <label className="text-sm font-medium text-gray-700 block mb-1">
                                {editingId ? 'Editando Nome' : "Nova Categoria"}
                            </label>
                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Ex: Alimentação"
                            />
                        </div>
                        <Button type="submit" disabled={loading || !name.trim()}>
                            {editingId ? 'Atualizar' : 'Adicionar'}
                        </Button>
                        {editingId && (
                            <Button type="button" variant="outline" onClick={cancelEdit} title="Cancelar Edição">
                                <X size={18} />
                            </Button>
                        )}
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-2">
                            Cor da Categoria
                        </label>
                        <div className="flex gap-3 flex-wrap">
                            {PREDEFINED_COLORS.map((hex)=>(
                                <button
                                    key={hex}
                                    type="button"
                                    onClick={() => setColor(hex)}
                                    className={`w-7 h-7 rounded-full transition-all duration-200 border-2 outline-none focus-ring-2 focus:ring-offset-1 focus:ring-blue-500 hover:scale-110 ${
                                        color === hex
                                            ? 'border-gray-900 scale-110 shadow-md'
                                            : 'border-transparent shadow-sm'
                                    }`}
                                    style={{ backgroundColor: hex }}
                                    title={`Selecionar cor ${hex}`}
                                />
                            ))}
                        </div>
                    </div>
                </form>

                <div className="border-t pt-4 max-h-64 overflow-y-auto">
                    <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase">
                        Suas Categorias
                    </h3>
                    {categories.length === 0 ? (
                        <p className="text-sm text-gray-500 text-center py-4">Nenhuma categoria cadastrada.</p>
                    ) : (
                        <ul className="space-y-2">
                            {categories.map((cat) => (
                                <li key={cat.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md border border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <span
                                            className="w-4 h-4 rounded-full"
                                            style={{ backgroundColor: cat.color || "#ccc" }}
                                        />
                                        <span className="font-medium text-gray-800">{cat.name}</span>
                                    </div>
                                    <div className="flex gap-1">
                                        <button 
                                            type="button"
                                            onClick={() => handleEditClick(cat)}
                                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-md transition-colors"
                                            title="Editar Categoria"
                                        >
                                            <Pencil size={18}/>
                                        </button>
                                        <button 
                                            type="button"
                                            onClick={() => removeCategory(cat.id)}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                                            title="Excluir Categoria"
                                        >
                                            <Trash size={18}/>
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </Modal>
    );
}
