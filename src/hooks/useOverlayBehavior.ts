import {
	type KeyboardEvent,
	type MouseEvent,
	type RefObject,
	useCallback,
	useEffect,
	useRef,
} from 'react';

const FOCUSABLE_SELECTORS = [
	'a[href]',
	'button:not([disabled])',
	'textarea:not([disabled])',
	'input:not([disabled])',
	'select:not([disabled])',
	'[tabindex]:not([tabindex="-1"])',
].join(', ');

type UseOverlayBehaviorOptions = {
	isOpen: boolean;
	onClose: () => void;
	closeOnBackdropClick: boolean;
};

type UseOverlayBehaviorReturn = {
	dialogRef: RefObject<HTMLDivElement | null>;
	handleOverlayClick: () => void;
	handleDialogClick: (event: MouseEvent) => void;
	handleDialogKeyDown: (event: KeyboardEvent) => void;
};

export const useOverlayBehavior = ({
	isOpen,
	onClose,
	closeOnBackdropClick,
}: UseOverlayBehaviorOptions): UseOverlayBehaviorReturn => {
	const dialogRef = useRef<HTMLDivElement>(null);
	const previousFocusRef = useRef<HTMLElement | null>(null);

	useEffect(() => {
		if (!isOpen) return;

		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = 'hidden';

		return () => {
			document.body.style.overflow = previousOverflow;
		};
	}, [isOpen]);

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

	useEffect(() => {
		if (!isOpen) return;

		const handleKeyDown = (event: globalThis.KeyboardEvent) => {
			if (event.key === 'Escape') onClose();
		};

		document.addEventListener('keydown', handleKeyDown);
		return () => document.removeEventListener('keydown', handleKeyDown);
	}, [isOpen, onClose]);

	const handleDialogKeyDown = useCallback((event: KeyboardEvent) => {
		if (event.key !== 'Tab') return;

		const focusable = Array.from(
			dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS) ??
				[]
		);

		if (focusable.length === 0) {
			event.preventDefault();
			return;
		}

		const first = focusable[0];
		const last = focusable[focusable.length - 1];

		if (event.shiftKey && document.activeElement === first) {
			event.preventDefault();
			last.focus();
		} else if (!event.shiftKey && document.activeElement === last) {
			event.preventDefault();
			first.focus();
		}
	}, []);

	const handleOverlayClick = useCallback(() => {
		if (closeOnBackdropClick) onClose();
	}, [closeOnBackdropClick, onClose]);

	const handleDialogClick = useCallback((event: MouseEvent) => {
		event.stopPropagation();
	}, []);

	return {
		dialogRef,
		handleOverlayClick,
		handleDialogClick,
		handleDialogKeyDown,
	};
};
