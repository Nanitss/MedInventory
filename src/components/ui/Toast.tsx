import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastData {
    id: string;
    message: string;
    type: ToastType;
}

const TOAST_DURATION = 3500;

const iconMap = {
    success: <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />,
    error: <XCircle size={18} className="text-red-500 shrink-0" />,
    info: <Info size={18} className="text-brand-blue shrink-0" />,
};

const bgMap = {
    success: 'bg-emerald-50 border-emerald-200 text-emerald-900',
    error: 'bg-red-50 border-red-200 text-red-900',
    info: 'bg-brand-blue-50 border-brand-blue-100 text-brand-blue-900',
};

const Toast = ({ toast, onDismiss }: { toast: ToastData; onDismiss: (id: string) => void }) => {
    const [exiting, setExiting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setExiting(true);
            setTimeout(() => onDismiss(toast.id), 300);
        }, TOAST_DURATION);
        return () => clearTimeout(timer);
    }, [toast.id, onDismiss]);

    return (
        <div
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg backdrop-blur-sm
                ${bgMap[toast.type]}
                ${exiting ? 'animate-toast-out' : 'animate-toast-in'}
                transition-all duration-300`}
        >
            {iconMap[toast.type]}
            <p className="text-sm font-medium flex-1">{toast.message}</p>
            <button
                onClick={() => {
                    setExiting(true);
                    setTimeout(() => onDismiss(toast.id), 300);
                }}
                className="text-slate-400 hover:text-slate-600 transition-colors p-0.5 shrink-0"
            >
                <X size={14} />
            </button>
        </div>
    );
};

export const ToastContainer = ({ toasts, onDismiss }: { toasts: ToastData[]; onDismiss: (id: string) => void }) => {
    if (toasts.length === 0) return null;

    return (
        <div className="fixed top-4 right-4 z-[200] flex flex-col gap-2 w-full max-w-sm pointer-events-none">
            {toasts.map(toast => (
                <div key={toast.id} className="pointer-events-auto">
                    <Toast toast={toast} onDismiss={onDismiss} />
                </div>
            ))}
        </div>
    );
};
