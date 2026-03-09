import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Button Primitive
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
    size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
        const baseClass = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-slate-50";

        const variants = {
            primary: "bg-brand-blue text-white hover:bg-brand-blue-dark shadow-md",
            secondary: "bg-brand-yellow text-slate-900 hover:bg-brand-yellow-dark shadow-md",
            danger: "bg-red-500 text-white hover:bg-red-600 shadow-md",
            ghost: "hover:bg-slate-100 text-slate-700",
            outline: "border border-slate-300 bg-transparent hover:bg-slate-50 text-slate-700"
        };

        const sizes = {
            sm: "h-8 px-3 text-xs",
            md: "h-10 px-4 py-2",
            lg: "h-12 px-8 text-lg"
        };

        return (
            <button
                ref={ref}
                className={cn(baseClass, variants[variant], sizes[size], className)}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

// Badge Primitive
export const Badge = ({ children, variant = 'default', className }: { children: React.ReactNode, variant?: 'default' | 'warning' | 'error' | 'success', className?: string }) => {
    const variants = {
        default: "bg-brand-blue-100 text-brand-blue-900",
        warning: "bg-brand-yellow-100 text-brand-yellow-900",
        error: "bg-red-100 text-red-800",
        success: "bg-green-100 text-green-800",
    };

    return (
        <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", variants[variant], className)}>
            {children}
        </span>
    );
};

// Card Primitive
export const Card = ({ children, className }: { children: React.ReactNode, className?: string }) => {
    return (
        <div className={cn("glass-card rounded-xl overflow-hidden", className)}>
            {children}
        </div>
    );
};
