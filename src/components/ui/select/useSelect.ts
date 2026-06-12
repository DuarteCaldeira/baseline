import {
	type KeyboardEvent,
	type RefObject,
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react';

type UseSelectOptions = {
	optionsCount: number;
	isDisabled?: boolean;
	initialActiveIndex?: number;
	closeOnSelect?: boolean;
	onOptionConfirm?: (index: number) => void;
	onScrollIntoView?: (index: number) => void;
	overlayRef?: RefObject<HTMLElement | null>;
};

export type UseSelectReturn<T extends HTMLElement = HTMLElement> = {
	isOpen: boolean;
	activeIndex: number;
	containerRef: RefObject<HTMLDivElement>;
	triggerRef: RefObject<T>;
	open: (startIndex?: number) => void;
	close: () => void;
	setActiveIndex: (index: number) => void;
	handleTriggerKeyDown: (e: KeyboardEvent<T>) => void;
};

export const useSelect = <T extends HTMLElement = HTMLElement>({
	optionsCount,
	isDisabled,
	initialActiveIndex = 0,
	closeOnSelect = true,
	onOptionConfirm,
	onScrollIntoView,
	overlayRef,
}: UseSelectOptions): UseSelectReturn<T> => {
	const [isOpen, setIsOpen] = useState(false);
	const [activeIndex, setActiveIndex] = useState(initialActiveIndex);
	const containerRef = useRef<HTMLDivElement>(null);
	const triggerRef = useRef<T>(null);

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

	useEffect(() => {
		if (!isOpen) return;

		const handlePointerDown = (e: PointerEvent) => {
			const target = e.target as Node;
			if (containerRef.current?.contains(target)) return;
			if (overlayRef?.current?.contains(target)) return;
			close();
		};

		document.addEventListener('pointerdown', handlePointerDown);
		return () => document.removeEventListener('pointerdown', handlePointerDown);
	}, [isOpen, close, overlayRef]);

	const moveTo = useCallback(
		(index: number) => {
			const clamped = Math.max(0, Math.min(index, optionsCount - 1));
			setActiveIndex(clamped);
			onScrollIntoView?.(clamped);
		},
		[optionsCount, onScrollIntoView]
	);

	const handleTriggerKeyDown = useCallback(
		(e: KeyboardEvent<T>) => {
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
		[
			isOpen,
			activeIndex,
			optionsCount,
			open,
			close,
			moveTo,
			closeOnSelect,
			onOptionConfirm,
		]
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
