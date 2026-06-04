import {
	useCallback,
	useEffect,
	useRef,
	type MouseEvent,
	type KeyboardEvent,
	type RefObject,
} from 'react';

const FOCUSABLE_SELECTORS = [
	'a[href]',
	'button:not([disabled])',
	'textarea:not([disabled])',
	'input:not([disabled])',
	'select:not([disabled])',
	'[tabindex]:not([tabindex="-1"])',
].join(', ');

type UseModalOptions = {
	isOpen: boolean;
	onClose: () => void;
	closeOnBackdropClick: boolean;
};

type UseModalReturn = {
	dialogRef: RefObject<HTMLDivElement | null>;
	handleOverlayClick: () => void;
	handleDialogClick: (e: MouseEvent) => void;
	handleDialogKeyDown: (e: KeyboardEvent) => void;
};

export const useModal = ({
	isOpen,
	onClose,
	closeOnBackdropClick,
}: UseModalOptions): UseModalReturn => {
	const dialogRef = useRef<HTMLDivElement | null>(null);
	const previousFocusRef = useRef<HTMLElement | null>(null);

	// Scroll lock
	useEffect(() => {
		if (!isOpen) return;

		const previous = document.body.style.overflow;
		document.body.style.overflow = 'hidden';

		return () => {
			document.body.style.overflow = previous;
		};
	}, [isOpen]);

	// Initial focus + restore focus on close
	useEffect(() => {
		if (!isOpen) return;

		previousFocusRef.current = document.activeElement as HTMLElement;

		const firstFocusable =
			dialogRef.current?.querySelector<HTMLElement>(FOCUSABLE_SELECTORS);
		(firstFocusable ?? dialogRef.current)?.focus();

		return () => {
			previousFocusRef.current?.focus();
		};
	}, [isOpen]);

	// Escape key
	useEffect(() => {
		if (!isOpen) return;

		const handleKeyDown = (e: globalThis.KeyboardEvent) => {
			if (e.key === 'Escape') onClose();
		};

		document.addEventListener('keydown', handleKeyDown);
		return () => document.removeEventListener('keydown', handleKeyDown);
	}, [isOpen, onClose]);

	// Focus trap — cycle Tab/Shift+Tab within the dialog
	const handleDialogKeyDown = useCallback(
		(e: KeyboardEvent) => {
			if (e.key !== 'Tab') return;

			const focusable = Array.from(
				dialogRef.current?.querySelectorAll<HTMLElement>(
					FOCUSABLE_SELECTORS
				) ?? []
			);

			if (focusable.length === 0) {
				e.preventDefault();
				return;
			}

			const first = focusable[0];
			const last = focusable[focusable.length - 1];

			if (e.shiftKey && document.activeElement === first) {
				e.preventDefault();
				last.focus();
			} else if (!e.shiftKey && document.activeElement === last) {
				e.preventDefault();
				first.focus();
			}
		},
		[]
	);

	const handleOverlayClick = useCallback(() => {
		if (closeOnBackdropClick) onClose();
	}, [closeOnBackdropClick, onClose]);

	const handleDialogClick = useCallback((e: MouseEvent) => {
		e.stopPropagation();
	}, []);

	return {
		dialogRef,
		handleOverlayClick,
		handleDialogClick,
		handleDialogKeyDown,
	};
};
