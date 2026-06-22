import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";
import { cn } from "../lib/utils"

// Estendemos as propriedades nativas do input e adicionamos uma propriedade "error"
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    error?: boolean;
}

// O forwardRef repassa a referência do componente pai direto para a tag <input> nativa
export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, error, ...props }, ref) => {
        return (
            <input
                ref={ref}
                className={cn(
                    // Classes base: borda, cor de fundo,espaçamento, compportamento ao focar
                    "flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
                    // se existir um erro, a borda e o foco ficam vermelhos
                    error && "border-red-500 focus:ring-red-500",
                    className
                )}
                {...props}
            />
        );
    }
);

// Boa prática para debug no React DevTools
Input.displayName = "Input";