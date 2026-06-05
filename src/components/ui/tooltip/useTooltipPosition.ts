import {
	useCallback,
	useEffect,
	useLayoutEffect,
	useState,
	type RefObject,
} from 'react';

import type { TooltipPlacement } from './Tooltip.types';
import {
	computeTooltipPosition,
	type ComputedTooltipPosition,
} from './Tooltip.utils';

type UseTooltipPositionOptions = {
	isOpen: boolean;
	triggerRef: RefObject<HTMLElement | null>;
	bubbleRef: RefObject<HTMLElement | null>;
	preferredPlacement: TooltipPlacement;
};

type UseTooltipPositionReturn = {
	position: ComputedTooltipPosition | null;
};

export const useTooltipPosition = ({
	isOpen,
	triggerRef,
	bubbleRef,
	preferredPlacement,
}: UseTooltipPositionOptions): UseTooltipPositionReturn => {
	const [position, setPosition] = useState<ComputedTooltipPosition | null>(
		null
	);

	const updatePosition = useCallback(() => {
		const trigger = triggerRef.current;
		const bubble = bubbleRef.current;

		if (!trigger || !bubble) return;

		const triggerRect = trigger.getBoundingClientRect();
		const bubbleRect = bubble.getBoundingClientRect();

		if (bubbleRect.width === 0 || bubbleRect.height === 0) return;

		setPosition(
			computeTooltipPosition({
				triggerRect: {
					top: triggerRect.top,
					left: triggerRect.left,
					width: triggerRect.width,
					height: triggerRect.height,
				},
				bubbleRect: {
					top: bubbleRect.top,
					left: bubbleRect.left,
					width: bubbleRect.width,
					height: bubbleRect.height,
				},
				preferredPlacement,
				viewport: {
					width: window.innerWidth,
					height: window.innerHeight,
				},
			})
		);
	}, [bubbleRef, preferredPlacement, triggerRef]);

	useLayoutEffect(() => {
		if (!isOpen) {
			setPosition(null);
			return;
		}

		updatePosition();
	}, [isOpen, preferredPlacement, updatePosition]);

	useEffect(() => {
		if (!isOpen) return;

		window.addEventListener('resize', updatePosition);
		window.addEventListener('scroll', updatePosition, true);

		const bubble = bubbleRef.current;
		const observer =
			bubble && typeof ResizeObserver !== 'undefined'
				? new ResizeObserver(updatePosition)
				: null;

		if (bubble && observer) {
			observer.observe(bubble);
		}

		return () => {
			window.removeEventListener('resize', updatePosition);
			window.removeEventListener('scroll', updatePosition, true);
			observer?.disconnect();
		};
	}, [bubbleRef, isOpen, updatePosition]);

	return { position };
};
