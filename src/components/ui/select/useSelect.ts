import {
	useCallback,
	useEffect,
	useRef,
	useState,
	type KeyboardEvent,
	type RefObject,
} from 'react';

type UseSelectOptions = {
	optionsCount: number;
	isDisabled?: boolean;
	initialActiveIndex?: number;
	closeOnSelect?: boolean;
	onOptionConfirm?: (index: number) => void;
	onScrollIntoView?: (index: number) => void;
};

export type UseSelectReturn = {
	isOpen: boolean;
	activeIndex: number;
	containerRef: RefObject<HTMLDivElement>;
	triggerRef: RefObject<HTMLElement>;
	open: (startIndex?: number) => void;
	close: () => void;
	setActiveIndex: (index: number) => void;
	handleTriggerKeyDown: (e: KeyboardEvent<HTMLElement>) => void;
};

export const useSelect = ({
	optionsCount,
	isDisabled,
	initialActiveIndex = 0,
	closeOnSelect = true,
	onOptionConfirm,
	onScrollIntoView,
}: UseSelectOptions): UseSelectReturn => {
	const [isOpen, setIsOpen] = useState(false);
	const [activeIndex, setActiveIndex] = useState(initialActiveIndex);
	const containerRef = useRef<HTMLDivElement>(null);
	const triggerRef = useRef<HTMLElement>(null);

	const close = useCallback(() => {
		setIsOpen(false);
		triggerRef.current?.focus();
	}, []);

	const open = useCallback(
		(startIndex = initialActiveIndex) => {
			if (isDisabled) return;
			setActiveIndex(startIndex);
			setIsOpen(true);
		},
		[isDisabled, initialActiveIndex]
	);

	// Close on pointer-down outside the component
	useEffect(() => {
		if (!isOpen) return;

		const handlePointerDown = (e: PointerEvent) => {
			if (!containerRef.current?.contains(e.target as Node)) {
				close();
			}
		};

		document.addEventListener('pointerdown', handlePointerDown);
		return () => document.removeEventListener('pointerdown', handlePointerDown);
	}, [isOpen, close]);

	const moveTo = useCallback(
		(index: number) => {
			const clamped = Math.max(0, Math.min(index, optionsCount - 1));
			setActiveIndex(clamped);
			onScrollIntoView?.(clamped);
		},
		[optionsCount, onScrollIntoView]
	);

	const handleTriggerKeyDown = useCallback(
		(e: KeyboardEvent<HTMLElement>) => {
			switch (e.key) {
				case 'Enter':
				case ' ':
					e.preventDefault();
					if (isOpen) {
						if (closeOnSelect) {
							close();
						} else {
							onOptionConfirm?.(activeIndex);
						}
					} else {
						open();
					}
					break;
				case 'ArrowDown':
					e.preventDefault();
					if (!isOpen) {
						open();
					} else {
						moveTo(activeIndex + 1);
					}
					break;
				case 'ArrowUp':
					e.preventDefault();
					if (!isOpen) {
						open(optionsCount - 1);
					} else {
						moveTo(activeIndex - 1);
					}
					break;
				case 'Escape':
				case 'Tab':
					if (isOpen) close();
					break;
			}
		},
		[isOpen, activeIndex, optionsCount, open, close, moveTo, closeOnSelect, onOptionConfirm]
	);

	return {
		isOpen,
		activeIndex,
		containerRef,
		triggerRef,
		open,
		close,
		setActiveIndex,
		handleTriggerKeyDown,
	};
};
