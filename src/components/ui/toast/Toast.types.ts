export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export type ToastItem = {
	id: string;
	variant: ToastVariant;
	title?: string;
	message: string;
};

export type ToastContextValue = {
	show: (toast: Omit<ToastItem, 'id'>) => void;
	dismiss: (id: string) => void;
};
