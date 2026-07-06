import {
	type KeyboardEvent,
	type RefObject,
	useCallback,
	useRef,
	useState,
} from 'react';

import { useDismissibleLayer } from '@/hooks/useDismissibleLayer';

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
	containerRef: RefObject<HTMLDivElement | null>;
	triggerRef: RefObject<T | null>;
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

	const { restoreFocus } = useDismissibleLayer({
		isOpen,
		onDismiss: () => setIsOpen(false),
		refs: [containerRef, overlayRef].filter(Boolean) as Array<
			RefObject<HTMLElement | null>
		>,
		triggerRef: triggerRef as RefObject<HTMLElement | null>,
	});

	const close = useCallback(() => {
		setIsOpen(false);
		restoreFocus();
	}, [restoreFocus]);

	const open = useCallback(
		(startIndex = initialActiveIndex) => {
			if (isDisabled) return;
			setActiveIndex(startIndex);
			setIsOpen(true);
		},
		[isDisabled, initialActiveIndex]
	);

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
