import { type RefObject, useCallback, useEffect, useRef } from 'react';

type UseDismissibleLayerOptions = {
	isOpen: boolean;
	onDismiss: () => void;
	refs: Array<RefObject<HTMLElement | null>>;
	triggerRef?: RefObject<HTMLElement | null>;
	dismissOnEscape?: boolean;
	dismissOnPointerDownOutside?: boolean;
};

const containsTarget = (
	refs: Array<RefObject<HTMLElement | null>>,
	target: Node
) => refs.some((ref) => ref.current?.contains(target));

export const useDismissibleLayer = ({
	isOpen,
	onDismiss,
	refs,
	triggerRef,
	dismissOnEscape = true,
	dismissOnPointerDownOutside = true,
}: UseDismissibleLayerOptions) => {
	const previousFocusRef = useRef<HTMLElement | null>(null);

	useEffect(() => {
		if (!isOpen) return;
		previousFocusRef.current = document.activeElement as HTMLElement | null;
	}, [isOpen]);

	useEffect(() => {
		if (!isOpen || !dismissOnPointerDownOutside) return;

		const handlePointerDown = (event: PointerEvent) => {
			const target = event.target;
			if (!(target instanceof Node)) return;
			if (containsTarget(refs, target)) return;
			onDismiss();
		};

		document.addEventListener('pointerdown', handlePointerDown);
		return () => document.removeEventListener('pointerdown', handlePointerDown);
	}, [dismissOnPointerDownOutside, isOpen, onDismiss, refs]);

	useEffect(() => {
		if (!isOpen || !dismissOnEscape) return;

		const handleKeyDown = (event: globalThis.KeyboardEvent) => {
			if (event.key !== 'Escape') return;
			onDismiss();
		};

		document.addEventListener('keydown', handleKeyDown);
		return () => document.removeEventListener('keydown', handleKeyDown);
	}, [dismissOnEscape, isOpen, onDismiss]);

	const restoreFocus = useCallback(() => {
		triggerRef?.current?.focus();
		if (triggerRef?.current) return;
		previousFocusRef.current?.focus();
	}, [triggerRef]);

	return { restoreFocus };
};
