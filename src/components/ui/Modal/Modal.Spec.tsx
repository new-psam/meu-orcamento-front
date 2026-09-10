import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Modal } from "./Modal";
import userEvent from "@testing-library/user-event";

describe('Componente: Modal', () => {
    // Criamos as propriedades padrão para não repertimos código
    const defaultProps = {
        isOpen: true,
        onClose: vi.fn(),
        title: 'Título do Modal',
        isLoading: false
    };

    it('deve renderizar o título e o conteúdo quando isOpen for true', () => {
        render(
            <Modal {...defaultProps}>
                <p>Conteúdo Interno</p>
            </Modal>
        );
        expect(screen.getByText('Título do Modal')).toBeInTheDocument();
        expect(screen.getByText('Conteúdo Interno')).toBeInTheDocument();
    });

    it('não deve renderizar absolutamente nada quando isOpen for false', () => {
        render(
            <Modal {...defaultProps} isOpen={false}>
                <p>Conteúdo fantasma</p>
            </Modal>
        );
        // O queryByText procura o elemento, mas retorna null (em vez de quebrar o teste) se não achar
        expect(screen.queryByText('Título do Modal')).not.toBeInTheDocument();
    });

    it('deve disparar onCLose ao clicar no botão fechar (X)', async () => {
        render(
            <Modal {...defaultProps}>
                <p>Conteúdo Interno</p>
            </Modal>
        );

        // O modal possui apenas um <button> na carcaça dele, que é o botão de fechar (X)
        const closeButton = screen.getByRole('button');
        await userEvent.click(closeButton);

        expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    });
});