import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { RecurringActionModal } from "./RecurringActionModal";
import userEvent from "@testing-library/user-event";

describe('Componente: RecurringActionModal', () => {
    // Função Factory tira a repetição de código
    const setup = (actionName: "edit" | "delete" = "edit") => {
        const mockConfirm = vi.fn();
        const mockClose = vi.fn();

        render(
            <RecurringActionModal
                isOpen={true}
                onClose={mockClose}
                onConfirm={mockConfirm}
                actionName={actionName}
            />
        );

        return { mockConfirm, mockClose }
    }
    it('deve exibir textos corretos para edição', () => {
        setup('edit');

        expect(screen.getByText(/Editar Transação Recorrente/i)).toBeInTheDocument();
        expect(screen.getByText(/alterar uma transação que se repete/i)).toBeInTheDocument();
    });

    it('deve exibir textos corretos para exclusão', () => {
        setup('delete');

        expect(screen.getByText(/Excluir Transação Recorrente/i)).toBeInTheDocument();
        expect(screen.getByText(/apagar uma transação que se repete/i)).toBeInTheDocument();
    });

    it('deve chamar onConfirm com SINGLE ao clicar em "Somente Esta"',async () => {
        const { mockConfirm } = setup('edit');
        await userEvent.click(screen.getByRole('button', {name: /Somente Esta/i}));
        expect(mockConfirm).toHaveBeenCalledWith("SINGLE");
    });

    it('deve chamar onConfirm com ALL ao clicar em "Esta e as próximas"',async () => {
        const { mockConfirm } = setup('delete');
        await userEvent.click(screen.getByRole('button', {name: /Esta e as próximas/i}));
        expect(mockConfirm).toHaveBeenCalledWith("ALL");
    });
})