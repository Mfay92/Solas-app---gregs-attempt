import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import clsx from 'clsx';
import { UI_CONSTANTS } from '../constants';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: ToastType = 'success') => {
        const id = Date.now().toString();
        setToasts((prev) => [...prev, { id, message, type }]);

        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, UI_CONSTANTS.TOAST_DURATION);
    }, []);

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div
                className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 space-y-2"
                role="region"
                aria-live="polite"
                aria-label="Notifications"
            >
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={clsx(
                            "flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border pointer-events-auto animate-slide-up min-w-[300px]",
                            toast.type === 'success' && "bg-white border-ivolve-mid text-slate-800",
                            toast.type === 'error' && "bg-red-50 border-red-200 text-red-800",
                            toast.type === 'info' && "bg-blue-50 border-blue-200 text-blue-800"
                        )}
                    >
                        {toast.type === 'success' && <CheckCircle size={20} className="text-ivolve-mid" />}
                        {toast.type === 'error' && <AlertCircle size={20} className="text-red-500" />}
                        {toast.type === 'info' && <Info size={20} className="text-blue-500" />}

                        <span className="flex-1 font-medium text-sm">{toast.message}</span>

                        <button onClick={() => removeToast(toast.id)} className="text-slate-400 hover:text-slate-600">
                            <X size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};
