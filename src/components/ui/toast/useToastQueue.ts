import { useCallback, useEffect, useRef, useState } from 'react';

import { TOAST_DISMISS_DELAY, TOAST_EXIT_DURATION } from './Toast.constants';
import type { ToastItem, ToastQueueItem } from './Toast.types';

type ToastTimerHandles = {
	startExit: ReturnType<typeof setTimeout>;
	remove: ReturnType<typeof setTimeout>;
};

type UseToastQueueReturn = {
	toasts: ToastQueueItem[];
	show: (toast: Omit<ToastItem, 'id'>) => void;
	dismiss: (id: string) => void;
};

export const useToastQueue = (): UseToastQueueReturn => {
	const [toasts, setToasts] = useState<ToastQueueItem[]>([]);
	const toastCountRef = useRef(0);
	const timersRef = useRef<Map<string, ToastTimerHandles>>(new Map());

	const clearToastTimers = useCallback((id: string) => {
		const handles = timersRef.current.get(id);
		if (!handles) return;

		clearTimeout(handles.startExit);
		clearTimeout(handles.remove);
		timersRef.current.delete(id);
	}, []);

	const removeToast = useCallback(
		(id: string) => {
			clearToastTimers(id);
			setToasts((prev) => prev.filter((toast) => toast.id !== id));
		},
		[clearToastTimers]
	);

	const markDismissing = useCallback((id: string) => {
		setToasts((prev) =>
			prev.map((toast) =>
				toast.id === id ? { ...toast, dismissing: true } : toast
			)
		);
	}, []);

	const scheduleToast = useCallback(
		(id: string, exitDelay: number, removeDelay: number) => {
			clearToastTimers(id);
			timersRef.current.set(id, {
				startExit: setTimeout(() => markDismissing(id), exitDelay),
				remove: setTimeout(() => removeToast(id), removeDelay),
			});
		},
		[clearToastTimers, markDismissing, removeToast]
	);

	const show = useCallback(
		(toast: Omit<ToastItem, 'id'>) => {
			const id = String(++toastCountRef.current);
			setToasts((prev) => [...prev, { ...toast, id, dismissing: false }]);
			scheduleToast(
				id,
				TOAST_DISMISS_DELAY - TOAST_EXIT_DURATION,
				TOAST_DISMISS_DELAY
			);
		},
		[scheduleToast]
	);

	const dismiss = useCallback(
		(id: string) => {
			setToasts((prev) => {
				const target = prev.find((toast) => toast.id === id);
				if (!target || target.dismissing) return prev;

				return prev.map((toast) =>
					toast.id === id ? { ...toast, dismissing: true } : toast
				);
			});
			scheduleToast(id, TOAST_EXIT_DURATION, TOAST_EXIT_DURATION);
		},
		[scheduleToast]
	);

	useEffect(
		() => () => {
			for (const id of timersRef.current.keys()) {
				clearToastTimers(id);
			}
		},
		[clearToastTimers]
	);

	return { toasts, show, dismiss };
};
