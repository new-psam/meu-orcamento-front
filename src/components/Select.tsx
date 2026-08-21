import { forwardRef } from "react";
import type { SelectHTMLAttributes } from "react";
import { cn } from "../lib/utils";

// Estendemos as propriedades nativas do select e adicionamos a opção erro
export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    error?: boolean;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, error, children, ...props}, ref) => {
        return (
            <select
                ref={ref}
                className={cn(
                    "flex h-11 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
                    error && "border-red-500 focus:ring-red-500",
                    className
                )}
                {...props}
            >
                {children}
            </select>
        );
    }
);

Select.displayName = 'Select';