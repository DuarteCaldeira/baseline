import { createContext, useCallback, useContext, useState } from 'react';
import type { ReactNode } from 'react';

import { Toast } from './Toast';
import type { ToastContextValue, ToastItem } from './Toast.types';
import styles from './Toast.module.scss';

export const ToastContext = createContext<ToastContextValue | null>(null);

export const useToastContext = (): ToastContextValue => {
	const ctx = useContext(ToastContext);
	if (!ctx) throw new Error('useToast must be used within a <ToastProvider>');
	return ctx;
};

let toastCount = 0;

type ToastProviderProps = {
	children: ReactNode;
};

export const ToastProvider = ({ children }: ToastProviderProps) => {
	const [toasts, setToasts] = useState<ToastItem[]>([]);

	const show = useCallback((toast: Omit<ToastItem, 'id'>) => {
		const id = String(++toastCount);
		setToasts((prev) => [...prev, { ...toast, id }]);
	}, []);

	const dismiss = useCallback((id: string) => {
		setToasts((prev) => prev.filter((t) => t.id !== id));
	}, []);

	return (
		<ToastContext.Provider value={{ show, dismiss }}>
			{children}
			<div
				className={styles['toast__container']}
				aria-label="Notifications"
				aria-live="polite"
				aria-atomic="false"
			>
				{toasts.map((toast) => (
					<Toast key={toast.id} {...toast} onDismiss={dismiss} />
				))}
			</div>
		</ToastContext.Provider>
	);
};
