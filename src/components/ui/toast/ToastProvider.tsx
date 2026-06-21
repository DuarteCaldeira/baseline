import { createContext, useCallback, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';

import { Stack } from '@/components/layout/stack';
import { useMounted } from '@/hooks/useMounted';

import { Toast } from './Toast';
import styles from './Toast.module.scss';
import type { ToastContextValue, ToastItem } from './Toast.types';

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
	const mounted = useMounted();

	const show = useCallback((toast: Omit<ToastItem, 'id'>) => {
		const id = String(++toastCount);
		setToasts((prev) => [...prev, { ...toast, id }]);
	}, []);

	const dismiss = useCallback((id: string) => {
		setToasts((prev) => prev.filter((t) => t.id !== id));
	}, []);

	const toastContainer = (
		<Stack
			gap="md"
			className={styles['toast-container']}
			aria-label="Notifications"
			aria-live="polite"
			aria-atomic="false"
		>
			{toasts.map((toast) => (
				<Toast key={toast.id} {...toast} onDismiss={dismiss} />
			))}
		</Stack>
	);

	return (
		<ToastContext.Provider value={{ show, dismiss }}>
			{children}
			{mounted && createPortal(toastContainer, document.body)}
		</ToastContext.Provider>
	);
};
