export type FloatingPlacement = 'top' | 'bottom' | 'left' | 'right';
export type FloatingAlign = 'start' | 'end' | 'center';

export type FloatingRect = {
	top: number;
	left: number;
	width: number;
	height: number;
};

export type FloatingViewport = {
	width: number;
	height: number;
};

export type ComputedFloatingPosition = {
	top: number;
	left: number;
	width: number;
	maxHeight: number;
	placement: FloatingPlacement;
};

export const FLOATING_GAP = 4;
export const FLOATING_VIEWPORT_PADDING = 8;

const OPPOSITE_PLACEMENT: Record<FloatingPlacement, FloatingPlacement> = {
	top: 'bottom',
	bottom: 'top',
	left: 'right',
	right: 'left',
};

const isSidePlacement = (
	placement: FloatingPlacement
): placement is 'left' | 'right' =>
	placement === 'left' || placement === 'right';

const computeSideFloatingPosition = ({
	triggerRect,
	floatingRect,
	viewport,
	preferredPlacement,
	gap,
	padding,
}: {
	triggerRect: FloatingRect;
	floatingRect: FloatingRect;
	viewport: FloatingViewport;
	preferredPlacement: 'left' | 'right';
	gap: number;
	padding: number;
}): ComputedFloatingPosition => {
	const width = Math.min(floatingRect.width, viewport.width - padding * 2);
	const rightLeft = triggerRect.left + triggerRect.width + gap;
	const fitsRight = rightLeft + floatingRect.width <= viewport.width - padding;
	const fitsLeft = triggerRect.left - floatingRect.width - gap >= padding;

	let placement: 'left' | 'right' = preferredPlacement;
	let left: number;

	if (preferredPlacement === 'right') {
		if (fitsRight) {
			left = rightLeft;
		} else {
			placement = 'left';
			left = triggerRect.left - floatingRect.width - gap;
		}
	} else if (fitsLeft) {
		left = triggerRect.left - floatingRect.width - gap;
	} else {
		placement = 'right';
		left = rightLeft;
	}

	const maxTop = viewport.height - floatingRect.height - padding;
	const top = clamp(triggerRect.top, padding, Math.max(padding, maxTop));

	return {
		top,
		left: clamp(
			left,
			padding,
			Math.max(padding, viewport.width - width - padding)
		),
		width,
		maxHeight: viewport.height - padding * 2,
		placement,
	};
};

const clamp = (value: number, min: number, max: number) =>
	Math.min(Math.max(value, min), max);

const getSpaceAbove = (trigger: FloatingRect, padding: number) =>
	trigger.top - padding;

const getSpaceBelow = (
	trigger: FloatingRect,
	viewport: FloatingViewport,
	padding: number
) => viewport.height - (trigger.top + trigger.height) - padding;

const hasRoomForPlacement = (
	placement: FloatingPlacement,
	trigger: FloatingRect,
	floating: FloatingRect,
	viewport: FloatingViewport,
	gap: number,
	padding: number
): boolean => {
	const space =
		placement === 'bottom'
			? getSpaceBelow(trigger, viewport, padding)
			: getSpaceAbove(trigger, padding);

	return space >= floating.height + gap;
};

const pickPlacement = (
	preferredPlacement: FloatingPlacement,
	trigger: FloatingRect,
	floating: FloatingRect,
	viewport: FloatingViewport,
	gap: number,
	padding: number
): { placement: FloatingPlacement; maxHeight: number } => {
	const candidates = [
		preferredPlacement,
		OPPOSITE_PLACEMENT[preferredPlacement],
	];

	for (const placement of candidates) {
		if (
			hasRoomForPlacement(placement, trigger, floating, viewport, gap, padding)
		) {
			const space =
				placement === 'bottom'
					? getSpaceBelow(trigger, viewport, padding)
					: getSpaceAbove(trigger, padding);

			return { placement, maxHeight: space - gap };
		}
	}

	const below = getSpaceBelow(trigger, viewport, padding);
	const above = getSpaceAbove(trigger, padding);

	if (below >= above) {
		return { placement: 'bottom', maxHeight: Math.max(0, below - gap) };
	}

	return { placement: 'top', maxHeight: Math.max(0, above - gap) };
};

const getTop = (
	placement: FloatingPlacement,
	trigger: FloatingRect,
	floating: FloatingRect,
	gap: number
): number => {
	if (placement === 'bottom') {
		return trigger.top + trigger.height + gap;
	}

	return trigger.top - floating.height - gap;
};

const getLeft = (
	align: FloatingAlign,
	trigger: FloatingRect,
	width: number,
	viewport: FloatingViewport,
	padding: number
): number => {
	let left: number;

	if (align === 'start') {
		left = trigger.left;
	} else if (align === 'end') {
		left = trigger.left + trigger.width - width;
	} else {
		left = trigger.left + trigger.width / 2 - width / 2;
	}

	return clamp(
		left,
		padding,
		Math.max(padding, viewport.width - width - padding)
	);
};

const getPlacementHeight = (
	floatingRect: FloatingRect,
	maxHeightLimit?: number
): number =>
	maxHeightLimit !== undefined
		? Math.min(floatingRect.height, maxHeightLimit)
		: floatingRect.height;

export const computeFloatingPosition = ({
	triggerRect,
	floatingRect,
	viewport,
	preferredPlacement = 'bottom',
	align = 'start',
	matchTriggerWidth = false,
	gap = FLOATING_GAP,
	padding = FLOATING_VIEWPORT_PADDING,
	maxHeightLimit,
}: {
	triggerRect: FloatingRect;
	floatingRect: FloatingRect;
	viewport: FloatingViewport;
	preferredPlacement?: FloatingPlacement;
	align?: FloatingAlign;
	matchTriggerWidth?: boolean;
	gap?: number;
	padding?: number;
	maxHeightLimit?: number;
}): ComputedFloatingPosition => {
	if (isSidePlacement(preferredPlacement)) {
		return computeSideFloatingPosition({
			triggerRect,
			floatingRect,
			viewport,
			preferredPlacement,
			gap,
			padding,
		});
	}

	const width = matchTriggerWidth
		? Math.min(triggerRect.width, viewport.width - padding * 2)
		: Math.min(floatingRect.width, viewport.width - padding * 2);

	const placementHeight = getPlacementHeight(floatingRect, maxHeightLimit);
	const placementFloatingRect = {
		...floatingRect,
		height: placementHeight,
	};

	const { placement, maxHeight: availableHeight } = pickPlacement(
		preferredPlacement,
		triggerRect,
		placementFloatingRect,
		viewport,
		gap,
		padding
	);

	const top = getTop(placement, triggerRect, placementFloatingRect, gap);
	const left = getLeft(align, triggerRect, width, viewport, padding);

	let maxHeight = availableHeight;
	if (maxHeightLimit !== undefined) {
		maxHeight = Math.min(maxHeightLimit, availableHeight);
	}

	const clampedTop = clamp(
		top,
		padding,
		Math.max(padding, viewport.height - placementHeight - padding)
	);

	return {
		top: clampedTop,
		left,
		width,
		maxHeight,
		placement,
	};
};

// ─── Tooltip positioning (centered, with arrow offset) ────────────────────────

export type ComputedTooltipPosition = {
	top: number;
	left: number;
	placement: FloatingPlacement;
	arrowOffset: number;
};

export const TOOLTIP_GAP = 8;
export const TOOLTIP_ARROW_SIZE = 4;
export const TOOLTIP_ARROW_EDGE_PADDING = 10;

const getTriggerCenter = (trigger: FloatingRect) => ({
	x: trigger.left + trigger.width / 2,
	y: trigger.top + trigger.height / 2,
});

const getTooltipPlacementCoords = (
	placement: FloatingPlacement,
	trigger: FloatingRect,
	bubble: FloatingRect,
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

const hasRoomForTooltipPlacement = (
	placement: FloatingPlacement,
	trigger: FloatingRect,
	bubble: FloatingRect,
	viewport: FloatingViewport,
	gap: number,
	arrow: number,
	padding: number
): boolean => {
	switch (placement) {
		case 'top':
			return trigger.top - padding >= bubble.height + gap + arrow;
		case 'bottom':
			return (
				viewport.height - (trigger.top + trigger.height) - padding >=
				bubble.height + gap + arrow
			);
		case 'left':
			return trigger.left - padding >= bubble.width + gap + arrow;
		case 'right':
			return (
				viewport.width - (trigger.left + trigger.width) - padding >=
				bubble.width + gap + arrow
			);
	}
};

const clampTooltipToViewport = (
	top: number,
	left: number,
	bubble: FloatingRect,
	viewport: FloatingViewport,
	padding: number
) => ({
	top: clamp(top, padding, viewport.height - bubble.height - padding),
	left: clamp(left, padding, viewport.width - bubble.width - padding),
});

const getTooltipArrowOffset = (
	placement: FloatingPlacement,
	trigger: FloatingRect,
	position: { top: number; left: number },
	bubble: FloatingRect,
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
	triggerRect: FloatingRect;
	bubbleRect: FloatingRect;
	preferredPlacement: FloatingPlacement;
	viewport: FloatingViewport;
}): ComputedTooltipPosition => {
	const gap = TOOLTIP_GAP;
	const arrow = TOOLTIP_ARROW_SIZE;
	const padding = FLOATING_VIEWPORT_PADDING;
	const arrowEdgePadding = TOOLTIP_ARROW_EDGE_PADDING;

	const candidates = [
		preferredPlacement,
		OPPOSITE_PLACEMENT[preferredPlacement],
	];

	let placement = preferredPlacement;
	let coords = getTooltipPlacementCoords(
		preferredPlacement,
		triggerRect,
		bubbleRect,
		gap,
		arrow
	);

	for (const candidate of candidates) {
		if (
			hasRoomForTooltipPlacement(
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
			coords = getTooltipPlacementCoords(
				candidate,
				triggerRect,
				bubbleRect,
				gap,
				arrow
			);
			break;
		}
	}

	const clamped = clampTooltipToViewport(
		coords.top,
		coords.left,
		bubbleRect,
		viewport,
		padding
	);

	return {
		...clamped,
		placement,
		arrowOffset: getTooltipArrowOffset(
			placement,
			triggerRect,
			clamped,
			bubbleRect,
			arrowEdgePadding
		),
	};
};
