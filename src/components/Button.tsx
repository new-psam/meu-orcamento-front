import type { ButtonHTMLAttributes } from "react";
import { cn } from "../lib/utils";

// Estendemos as propriedades nativas do HTML para não reiventar a roda
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "danger" | "outline";
}

export function Button({ variant = "primary", className, children, ...props }: ButtonProps) {
    // Classes base que todo botão tem (numca mais vamos repetir isso)
    const baseClasses = "px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

    // Classes específicas para cada variante
    const variants = {
        primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
        danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
        outline: "border-2 border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500",
    };

    return (
        <button
            {...props}
            // A função 'cn' junta a base, a variante e qualquer classe extra que você passar depois
            className={cn(baseClasses, variants[variant], className)}
         >
            {children}
        </button>
    )
}