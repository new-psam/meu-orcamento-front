import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi} from "vitest";
import { Input } from "./Input";
import userEvent from "@testing-library/user-event";

describe('Component: Input', () => {
    it('deve renderizar corretamente com o placeholder', () => {
        render(<Input placeholder='Digite seu nome' />);
        // Procura o input pelo texto fantasma
        expect(screen.getByPlaceholderText('Digite seu nome')).toBeInTheDocument();
    });

    it('deve repassar a digitação para onChange', async  () => {
        const handleChange = vi.fn();
        // O aria-label atua como uma etiqueta invisível para facilitar a busca no teste
        render(<Input aria-label="Nome" onChange={handleChange} />);

        const input = screen.getByLabelText('Nome');
        await userEvent.type(input, "Olá");

        //A palavra "Olá" tem 3 letras, então o evento onChange deve ter sido disparado 3 vezes
        expect(handleChange).toHaveBeenCalledTimes(3);
    })
})