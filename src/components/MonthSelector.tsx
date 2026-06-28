import { ChevronLeft, ChevronRight } from "lucide-react";

interface MonthSelectorProps {
    month: number;
    year: number;
    onPrevious: ()=> void;
    onNext: () => void;
}

export function MonthSelector({ month, year, onPrevious, onNext}: MonthSelectorProps){
    const formattedDate = new Date(year, month - 1).toLocaleString('pt-BR', {
        month: 'long', 
        year: 'numeric'
    });

    return (
        <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-2 shadow-sm mb-6 max-w-sm">
            <button
                onClick={onPrevious}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors text-gray-600 hover:text-blue-600"
            >
                <ChevronLeft size={20}/>
            </button>
            <span className="font-semibold text-gray-800 capitalize">
                {formattedDate}
            </span>
            <button
                onClick={onNext}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors text-gray-600 hover:text-blue-600"
            >
                <ChevronRight size={20}/>
            </button>
    </div>
    )
}