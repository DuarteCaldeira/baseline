'use client';

import {
	type CSSProperties,
	type RefObject,
	useCallback,
	useEffect,
	useLayoutEffect,
	useState,
} from 'react';

import {
	type ComputedFloatingPosition,
	type FloatingAlign,
	type FloatingPlacement,
	computeFloatingPosition,
} from '@/utils/floatingPosition';

type UseFloatingPositionOptions = {
	isOpen: boolean;
	triggerRef: RefObject<HTMLElement | null>;
	floatingRef: RefObject<HTMLElement | null>;
	preferredPlacement?: FloatingPlacement;
	align?: FloatingAlign;
	gap?: number;
	matchTriggerWidth?: boolean;
	maxHeightLimit?: number;
};

type UseFloatingPositionReturn = {
	position: ComputedFloatingPosition | null;
	style: CSSProperties;
	placement: FloatingPlacement;
};

const getMeasuredRect = (element: HTMLElement) => {
	const rect = element.getBoundingClientRect();

	return {
		top: rect.top,
		left: rect.left,
		width: rect.width || element.offsetWidth || element.scrollWidth,
		height: rect.height || element.offsetHeight || element.scrollHeight,
	};
};

export const useFloatingPosition = ({
	isOpen,
	triggerRef,
	floatingRef,
	preferredPlacement = 'bottom',
	align = 'start',
	gap,
	matchTriggerWidth = false,
	maxHeightLimit,
}: UseFloatingPositionOptions): UseFloatingPositionReturn => {
	const [position, setPosition] = useState<ComputedFloatingPosition | null>(
		null
	);

	const updatePosition = useCallback(() => {
		const trigger = triggerRef.current;
		const floating = floatingRef.current;

		if (!trigger || !floating) return;

		const triggerRect = getMeasuredRect(trigger);
		const floatingRect = getMeasuredRect(floating);

		setPosition(
			computeFloatingPosition({
				triggerRect: {
					top: triggerRect.top,
					left: triggerRect.left,
					width: Math.max(triggerRect.width, trigger.offsetWidth, 1),
					height: Math.max(triggerRect.height, trigger.offsetHeight, 1),
				},
				floatingRect: {
					top: floatingRect.top,
					left: floatingRect.left,
					width: Math.max(
						floatingRect.width,
						floating.offsetWidth,
						floating.scrollWidth,
						1
					),
					height: Math.max(
						floatingRect.height,
						floating.offsetHeight,
						floating.scrollHeight,
						1
					),
				},
				preferredPlacement,
				align,
				gap,
				matchTriggerWidth,
				maxHeightLimit,
				viewport: {
					width: window.innerWidth,
					height: window.innerHeight,
				},
			})
		);
	}, [
		align,
		floatingRef,
		gap,
		matchTriggerWidth,
		maxHeightLimit,
		preferredPlacement,
		triggerRef,
	]);

	useLayoutEffect(() => {
		if (!isOpen) {
			setPosition(null);
			return;
		}

		updatePosition();

		const frame = window.requestAnimationFrame(updatePosition);

		return () => window.cancelAnimationFrame(frame);
	}, [isOpen, preferredPlacement, align, matchTriggerWidth, updatePosition]);

	useEffect(() => {
		if (!isOpen) return;

		window.addEventListener('resize', updatePosition);
		window.addEventListener('scroll', updatePosition, true);

		const floating = floatingRef.current;
		const observer =
			floating && typeof ResizeObserver !== 'undefined'
				? new ResizeObserver(updatePosition)
				: null;

		if (floating && observer) {
			observer.observe(floating);
		}

		return () => {
			window.removeEventListener('resize', updatePosition);
			window.removeEventListener('scroll', updatePosition, true);
			observer?.disconnect();
		};
	}, [floatingRef, isOpen, updatePosition]);

	const placement = position?.placement ?? preferredPlacement;

	const style: CSSProperties = position
		? {
				position: 'fixed',
				top: position.top,
				left: position.left,
				width: position.width,
				maxHeight: position.maxHeight,
			}
		: {
				position: 'fixed',
				top: 0,
				left: 0,
			};

	return { position, style, placement };
};
