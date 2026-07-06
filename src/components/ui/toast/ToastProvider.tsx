import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';

import { Stack } from '@/components/layout/stack';
import { useMounted } from '@/hooks/useMounted';

import { Toast } from './Toast';
import styles from './Toast.module.scss';
import type { ToastContextValue } from './Toast.types';
import { useToastQueue } from './useToastQueue';

export const ToastContext = createContext<ToastContextValue | null>(null);

export const useToastContext = (): ToastContextValue => {
	const ctx = useContext(ToastContext);
	if (!ctx) throw new Error('useToast must be used within a <ToastProvider>');
	return ctx;
};

type ToastProviderProps = {
	children: ReactNode;
};

export const ToastProvider = ({ children }: ToastProviderProps) => {
	const { toasts, show, dismiss } = useToastQueue();
	const mounted = useMounted();

	const toastContainer = (
		<Stack
			gap="md"
			className={styles['toast-container']}
			style={{ zIndex: 'var(--z-index-toast, 9500)' }}
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
