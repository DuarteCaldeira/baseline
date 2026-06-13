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
	type ComputedTooltipPosition,
	type FloatingAlign,
	type FloatingPlacement,
	computeFloatingPosition,
	computeTooltipPosition,
} from '@/utils/floatingPosition';

type FloatingVariant = 'panel' | 'tooltip';

type UseFloatingPositionOptions = {
	isOpen: boolean;
	triggerRef: RefObject<HTMLElement | null>;
	floatingRef: RefObject<HTMLElement | null>;
	variant?: FloatingVariant;
	preferredPlacement?: FloatingPlacement;
	align?: FloatingAlign;
	gap?: number;
	matchTriggerWidth?: boolean;
	maxHeightLimit?: number;
};

type UseFloatingPositionReturn = {
	position: ComputedFloatingPosition | ComputedTooltipPosition | null;
	style: CSSProperties;
	placement: FloatingPlacement;
	arrowOffset?: number;
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
	variant = 'panel',
	preferredPlacement = 'bottom',
	align = 'start',
	gap,
	matchTriggerWidth = false,
	maxHeightLimit,
}: UseFloatingPositionOptions): UseFloatingPositionReturn => {
	const [position, setPosition] = useState<
		ComputedFloatingPosition | ComputedTooltipPosition | null
	>(null);

	const updatePosition = useCallback(() => {
		const trigger = triggerRef.current;
		const floating = floatingRef.current;

		if (!trigger || !floating) return;

		const triggerRect = getMeasuredRect(trigger);
		const floatingRect = getMeasuredRect(floating);
		const viewport = {
			width: window.innerWidth,
			height: window.innerHeight,
		};

		if (variant === 'tooltip') {
			if (floatingRect.width === 0 || floatingRect.height === 0) return;

			setPosition(
				computeTooltipPosition({
					triggerRect: {
						top: triggerRect.top,
						left: triggerRect.left,
						width: triggerRect.width,
						height: triggerRect.height,
					},
					bubbleRect: {
						top: floatingRect.top,
						left: floatingRect.left,
						width: floatingRect.width,
						height: floatingRect.height,
					},
					preferredPlacement,
					viewport,
				})
			);
			return;
		}

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
				viewport,
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
		variant,
	]);

	useLayoutEffect(() => {
		if (!isOpen) {
			setPosition(null);
			return;
		}

		updatePosition();

		if (variant === 'panel') {
			const frame = window.requestAnimationFrame(updatePosition);
			return () => window.cancelAnimationFrame(frame);
		}
	}, [isOpen, preferredPlacement, align, matchTriggerWidth, updatePosition, variant]);

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

	if (variant === 'tooltip') {
		const tooltipPosition = position as ComputedTooltipPosition | null;

		return {
			position: tooltipPosition,
			placement,
			arrowOffset: tooltipPosition?.arrowOffset,
			style: {
				position: 'fixed',
				top: tooltipPosition?.top ?? 0,
				left: tooltipPosition?.left ?? 0,
				'--tooltip-arrow-offset': `${tooltipPosition?.arrowOffset ?? 0}px`,
			} as CSSProperties,
		};
	}

	const panelPosition = position as ComputedFloatingPosition | null;

	const style: CSSProperties = panelPosition
		? {
				position: 'fixed',
				top: panelPosition.top,
				left: panelPosition.left,
				width: panelPosition.width,
				maxHeight: panelPosition.maxHeight,
			}
		: {
				position: 'fixed',
				top: 0,
				left: 0,
			};

	return { position: panelPosition, style, placement };
};
