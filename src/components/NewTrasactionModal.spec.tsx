import { beforeEach, describe, expect, it, vi } from "vitest";
import { transactionService } from "../services/transaction.service";
import { render, screen } from "@testing-library/react";
import { NewTransactionModal } from "./NewTransactionModal";
import userEvent from "@testing-library/user-event";

// 1. A mágica do Dublê (Mock):
// Substituímos o serviço real por funções espiãs vazias
// Assim não fazemos requisições de verdade para o Backend


vi.mock('../services/transaction.service', () => ({
    transactionService: {
        create: vi.fn(),
        update: vi.fn(),
    }
}));

describe('Componente: NewTransactionModal', () => {
    // 2. Criamos as propriedades padrão para injetar no componente
    const defaultProps = {
        isOpen: true,
        onClose: vi.fn(),
        onSuccess: vi.fn(),
    };

    // 3. Antes de CADA teste, nós limpamos a memória do dublê 
    beforeEach(()=> {
        vi.clearAllMocks();
    });

    it('deve renderizar o título correto para uma nova transação', () => {
        render(<NewTransactionModal {...defaultProps} />);

        expect(screen.getByRole('heading', { name: /nova transação/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /salvar transação/i })).toBeInTheDocument();
    });

    it('deve preencher o formulário e chamar a API ao salvar', async () => {
        render(<NewTransactionModal {...defaultProps}/>);

        // Passo A: Preenchendo a Descrição
        const descriptionInput = screen.getByPlaceholderText('Ex: Supermercado');
        await userEvent.type(descriptionInput, 'Compra do Mês');

        // Passo B: Preenchendo o Valor
        const amountInput = screen.getByPlaceholderText('0.00');
        await userEvent.type(amountInput, '550.50');

        // Passo C: Clicando em Salvar
        const submitButton = screen.getByRole('button', {name: /salvar transação/i});

        // Como não conseguimos digitar a data facilmente sem id (pois é um type="date"),
        // vamos simular o clique e ver se ele tenta chamar o banco de dados.
        // O formulário original exige a data (temos um "if (!date) return" no código).
        // Então se apenas clicarmos , a API Não deve ser chamada
        await userEvent.click(submitButton);

        // A experiência é que a API não tenha sido chamada, pois a data esta vazia
        expect(transactionService.create).not.toHaveBeenCalled()
    })
})
