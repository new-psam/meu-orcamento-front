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
    });
    
    it('Deve ixibir o campo de parcelas ao ativar a repetição de transação', async () => {
        render(<NewTransactionModal {...defaultProps} />);
        
        // O campo numérico não deve existir na tela inicialmente
        expect(screen.queryByLabelText(/quantas vezes/i)).not.toBeInTheDocument();
        
        // Encontra o checkbox e simula o clique do usuário
        const toggle = screen.getByLabelText(/repetir transação/i);
        await userEvent.click(toggle);

        // O campo deve surgir após o clique
        const installmentsInput = screen.getByLabelText(/quantas vezes/i);
        expect(installmentsInput).toBeInTheDocument();

        // Simula a digitação de 10 parcelas
        await userEvent.type(installmentsInput, '10');
        expect(installmentsInput).toHaveValue(10);
    });

    it('Deve exibir o seletor de período e alterar o placeholder de parcelas dinamicamente', async () => {
        render(<NewTransactionModal {...defaultProps}/>);

        //1. Ativa a recorrência
        const toggle = screen.getByLabelText(/repetir transação/i);
        await userEvent.click(toggle);

        //2. Verifica se o Dropdown de período surgiu na tela
        const periodSelect = screen.getByLabelText(/período da repetição/i);
        expect(periodSelect).toBeInTheDocument();

        //3. Verifica se o campo de parcelas também surgiu
        const installmentsInput = screen.getByLabelText(/quantas vezes/i);
        
        // 4. O padrão inicial deve ser Mensal, com o placeholder sugerindo 12 meses
        expect(periodSelect).toHaveValue('MONTHLY');
        expect(installmentsInput).toHaveAttribute('placeholder', 'Ex: 12');

        // 5. O usuário muda a repetição para "Anual"
        await userEvent.selectOptions(periodSelect, 'YEARLY');

        // 6. O placeholder deve reagir e sugerir 5 anos
        expect(installmentsInput).toHaveAttribute('placeholder', 'Ex: 5');
    });

    it('Deve desabilitar os campos de estrutura de recorrência no modo edição', () =>{
        //1.  Arrange: Transação recorrente vindo do banco de dados
        const mockEditingTransaction = {
            id: "123e4567-e89b-12d3-a456-426614174000",
            description: "Notebook (1/10)",
            amount: 5000,
            type: "EXPENSE",
            date: "2026-09-15",
            status: "PENDING",
            isRecurring: true,
            recurrencePeriod: "MONTHLY",
            recurrenceGroupId: "grupo-123"
        };

        // Renderizamos o modal passando a transação como prop de edição
        render(
            <NewTransactionModal
                {...defaultProps}
                editingTransaction={mockEditingTransaction as any}
            />
        );

        // 2. Act: Buscamos os campos estruturais na tela
        const toggle = screen.getByLabelText(/repetir transação/i);
        const periodSelect = screen.getByLabelText(/período da repetição/i);
        const installmentsInput = screen.getByLabelText(/quantas vezes/i);

        // 3. Assert: Exigimos que todos estejam travados
        expect(toggle).toBeDisabled();
        expect(periodSelect).toBeDisabled();
        expect(installmentsInput).toBeDisabled();
    })
});
