import type { TooltipPlacement } from './Tooltip.types';

export type TooltipRect = {
	top: number;
	left: number;
	width: number;
	height: number;
};

export type TooltipViewport = {
	width: number;
	height: number;
};

export type ComputedTooltipPosition = {
	top: number;
	left: number;
	placement: TooltipPlacement;
	arrowOffset: number;
};

export const TOOLTIP_GAP = 8;
export const TOOLTIP_ARROW_SIZE = 4;
export const TOOLTIP_VIEWPORT_PADDING = 8;
export const TOOLTIP_ARROW_EDGE_PADDING = 10;

const OPPOSITE_PLACEMENT: Record<TooltipPlacement, TooltipPlacement> = {
	top: 'bottom',
	bottom: 'top',
	left: 'right',
	right: 'left',
};

const clamp = (value: number, min: number, max: number) =>
	Math.min(Math.max(value, min), max);

const getTriggerCenter = (trigger: TooltipRect) => ({
	x: trigger.left + trigger.width / 2,
	y: trigger.top + trigger.height / 2,
});

const getPlacementCoords = (
	placement: TooltipPlacement,
	trigger: TooltipRect,
	bubble: TooltipRect,
	gap: number,
	arrow: number
): { top: number; left: number } => {
	const center = getTriggerCenter(trigger);

	switch (placement) {
		case 'top':
			return {
				top: trigger.top - bubble.height - gap - arrow,
				left: center.x - bubble.width / 2,
			};
		case 'bottom':
			return {
				top: trigger.top + trigger.height + gap + arrow,
				left: center.x - bubble.width / 2,
			};
		case 'left':
			return {
				top: center.y - bubble.height / 2,
				left: trigger.left - bubble.width - gap - arrow,
			};
		case 'right':
			return {
				top: center.y - bubble.height / 2,
				left: trigger.left + trigger.width + gap + arrow,
			};
	}
};

const hasRoomForPlacement = (
	placement: TooltipPlacement,
	trigger: TooltipRect,
	bubble: TooltipRect,
	viewport: TooltipViewport,
	gap: number,
	arrow: number,
	padding: number
): boolean => {
	switch (placement) {
		case 'top':
			return (
				trigger.top - padding >= bubble.height + gap + arrow
			);
		case 'bottom':
			return (
				viewport.height -
					(trigger.top + trigger.height) -
					padding >=
				bubble.height + gap + arrow
			);
		case 'left':
			return (
				trigger.left - padding >= bubble.width + gap + arrow
			);
		case 'right':
			return (
				viewport.width -
					(trigger.left + trigger.width) -
					padding >=
				bubble.width + gap + arrow
			);
	}
};

const clampToViewport = (
	top: number,
	left: number,
	bubble: TooltipRect,
	viewport: TooltipViewport,
	padding: number
) => ({
	top: clamp(top, padding, viewport.height - bubble.height - padding),
	left: clamp(left, padding, viewport.width - bubble.width - padding),
});

const getArrowOffset = (
	placement: TooltipPlacement,
	trigger: TooltipRect,
	position: { top: number; left: number },
	bubble: TooltipRect,
	arrowEdgePadding: number
): number => {
	const center = getTriggerCenter(trigger);

	if (placement === 'top' || placement === 'bottom') {
		return clamp(
			center.x - position.left,
			arrowEdgePadding,
			bubble.width - arrowEdgePadding
		);
	}

	return clamp(
		center.y - position.top,
		arrowEdgePadding,
		bubble.height - arrowEdgePadding
	);
};

export const computeTooltipPosition = ({
	triggerRect,
	bubbleRect,
	preferredPlacement,
	viewport,
}: {
	triggerRect: TooltipRect;
	bubbleRect: TooltipRect;
	preferredPlacement: TooltipPlacement;
	viewport: TooltipViewport;
}): ComputedTooltipPosition => {
	const gap = TOOLTIP_GAP;
	const arrow = TOOLTIP_ARROW_SIZE;
	const padding = TOOLTIP_VIEWPORT_PADDING;
	const arrowEdgePadding = TOOLTIP_ARROW_EDGE_PADDING;

	const candidates = [
		preferredPlacement,
		OPPOSITE_PLACEMENT[preferredPlacement],
	];

	let placement = preferredPlacement;
	let coords = getPlacementCoords(
		preferredPlacement,
		triggerRect,
		bubbleRect,
		gap,
		arrow
	);

	for (const candidate of candidates) {
		if (
			hasRoomForPlacement(
				candidate,
				triggerRect,
				bubbleRect,
				viewport,
				gap,
				arrow,
				padding
			)
		) {
			placement = candidate;
			coords = getPlacementCoords(
				candidate,
				triggerRect,
				bubbleRect,
				gap,
				arrow
			);
			break;
		}
	}

	const clamped = clampToViewport(
		coords.top,
		coords.left,
		bubbleRect,
		viewport,
		padding
	);

	return {
		...clamped,
		placement,
		arrowOffset: getArrowOffset(
			placement,
			triggerRect,
			clamped,
			bubbleRect,
			arrowEdgePadding
		),
	};
};
