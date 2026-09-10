import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from "vitest";
import { Button } from './Button';

// O 'describe' cria um bloco para grupar todos os testes deste componente
describe('Componente: Button', () => {
    // O 'it' (ou 'test') é o caso de teste específico
    it('deve renderizar o botão com o texto correto', () => {
        //1. Simula a renderização do botão na tela
        render(<Button>Salvar Transação</Button>);

        // 2. Busca o elemento da tela como um usuário cego faria (pelo papel e nome)
        const buttonElement = screen.getByRole('button', { name: /salvar transação/i });

        // 3. A afirmação (expectativa) de que ele realmente está lá
        expect(buttonElement).toBeInTheDocument();
    });

    it('deve disparar a função onClick ao ser clicado', async ()=> {
        // O 'vi.fn()'cria uma função espiã falsa apenas para sabermos se ela foi chamada
        const handleClick = vi.fn();

        render(<Button onClick={handleClick}>Confirmar</Button>);
        const buttonElement = screen.getByRole('button', { name: /confirmar/i });

        // Simula um usuário humano clicando com o mouse real
        await userEvent.click(buttonElement);

        // Verifica se a função espiã foi executada 1 vez
        expect(handleClick).toHaveBeenCalledTimes(1);
    });
    
    it('não deve disparar o clique se estiver desabilitado', async () => {
        const handleClick = vi.fn();

        render(<Button onClick={handleClick} disabled>Enviando...</Button>);
        const buttonElement = screen.getByRole('button', { name: /enviando/i});

        await userEvent.click(buttonElement);

        //O botão esta disabled, então o Clique não deve surtir efeito
        expect(handleClick).not.toHaveBeenCalled();
    })
})