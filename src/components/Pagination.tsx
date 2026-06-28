interface PaginationProps {
    page: number;
    totalPage: number;
    total: number;
    isLoading: boolean;
    onPageChange: (newPage: number) => void;
}

export function Pagination({page, totalPage, total, isLoading, onPageChange}: PaginationProps) {
    // Evita mostrar "Página 1 de 0"se não houver dados
    const safeTotalPage = totalPage > 0 ? totalPage : 1;

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 p-4 bg-white border rounded-lg">
            <span className="text-sm text-gray-600">
                Página <span className="font-semibold">{page}</span> de <span className="font-semibold">{safeTotalPage}</span>
                <span className="text-gray-400 mx-2">|</span>
                <span className="font-medium text-gray-800">({total})</span>  transações no total
            </span>

            <div className="flex items-center gap-2">
                <button
                    disabled={page === 1 || isLoading}
                    onClick={()=> onPageChange(page - 1)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    Anterior
                </button>
                <button
                    disabled={page === safeTotalPage || isLoading || safeTotalPage === 1}
                    onClick={()=> onPageChange(page + 1)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    Próxima
                </button>
            </div>
        </div>
    )
}