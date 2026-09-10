import { formatCurrency } from "../utils/formatCurrency";

interface SummaryCardProps {
    title: string;
    amount: number;
    type?: 'balance' | 'income' | 'expense';
    isLoading: boolean;
}

export function SummaryCard({ title, amount, type='balance', isLoading}: SummaryCardProps) {
    // Lógica inteligente para definir a cor do texto dinheiro
    let textColorClass = "text-gray-900";

    if (type === 'income') textColorClass = "text-green-600";
    if (type === 'expense') textColorClass = "text-red-600";
    if (type === 'balance') textColorClass = amount >= 0 ? "text-gray-900" : "text-red-600";

    return (
        <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">{title}</h3>

            <div className="mt-2 min-h-9">
                {isLoading ? (
                    <div className="h-9 w-32 animate-pulse rounded bg-gray-200" />
                ) : (
                    <p className={`text-3xl font-bold ${textColorClass}`}>
                        {formatCurrency(amount)}
                    </p>
                )}    
            </div> 
        </div>
    );
}