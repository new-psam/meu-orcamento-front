import { type ReactNode, useEffect} from "react";
import { X } from "lucide-react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    isLoading: boolean;
}

export function Modal({ isOpen, onClose, title, children, isLoading}: ModalProps) {
    // Evita que a página role para trás quando o modal estiver aberto
    useEffect(()=>{
        if(isOpen){
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset';};
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
                {/* Botão fechar */}
                <button
                    onClick={onClose}
                    disabled={isLoading}
                    className="absolute right-4 top-4 text-gray-500 transition-colors hover:text-gray-800 disabled:opacity-50"
                >
                    <X size={24}/>
                </button>

                {/* Título Dinâmico */}
                <h2 className="mb-6 text-2xl font-bold text-gray-800">
                    {title}
                </h2>

                {/* Conteúdo injetado (Formulários,textos, etc*/}
                {children}
            </div>
        </div>
    )
}