import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Select } from "./Select";
import userEvent from "@testing-library/user-event";

describe('Componente: Select', () => {
    it('deve renderizar as opções e permitir a seleção', async () => {
        const handleChange = vi.fn();
        render(
            <Select aria-label="Filtro" onChange={handleChange}>
                <option value="1">Opção 1</option>
                <option value="2">Opção 2</option>
            </Select>
        );

        const select = screen.getByLabelText("Filtro");
        //Confirma se o texto da primeira opção esta na tela
        expect(screen.getByText('Opção 1')).toBeInTheDocument();

        // Simula o usuário abrindo a caixa e escolhendo a "Opção 2"
        await userEvent.selectOptions(select, '2');

        expect(handleChange).toHaveBeenCalled();
        expect(select).toHaveValue('2');
    });
});