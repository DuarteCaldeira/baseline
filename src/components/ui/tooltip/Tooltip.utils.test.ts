import { describe, expect, it } from 'vitest';

import { computeTooltipPosition } from './Tooltip.utils';

describe('computeTooltipPosition', () => {
	const trigger = { top: 200, left: 200, width: 40, height: 40 };
	const bubble = { top: 0, left: 0, width: 120, height: 32 };
	const viewport = { width: 800, height: 600 };

	it('positions the tooltip above the trigger by default', () => {
		const result = computeTooltipPosition({
			triggerRect: trigger,
			bubbleRect: bubble,
			preferredPlacement: 'top',
			viewport,
		});

		expect(result.placement).toBe('top');
		expect(result.top).toBeLessThan(trigger.top);
		expect(result.left).toBeGreaterThanOrEqual(8);
		expect(result.left + bubble.width).toBeLessThanOrEqual(viewport.width - 8);
	});

	it('flips to the bottom when there is no room above', () => {
		const result = computeTooltipPosition({
			triggerRect: { top: 12, left: 200, width: 40, height: 40 },
			bubbleRect: bubble,
			preferredPlacement: 'top',
			viewport,
		});

		expect(result.placement).toBe('bottom');
		expect(result.top).toBeGreaterThan(52);
	});

	it('flips to the right when there is no room on the left', () => {
		const result = computeTooltipPosition({
			triggerRect: { top: 200, left: 12, width: 40, height: 40 },
			bubbleRect: bubble,
			preferredPlacement: 'left',
			viewport,
		});

		expect(result.placement).toBe('right');
		expect(result.left).toBeGreaterThan(52);
	});

	it('keeps the tooltip inside the viewport when centered placement overflows', () => {
		const result = computeTooltipPosition({
			triggerRect: { top: 200, left: 760, width: 40, height: 40 },
			bubbleRect: bubble,
			preferredPlacement: 'top',
			viewport,
		});

		expect(result.left).toBeGreaterThanOrEqual(8);
		expect(result.left + bubble.width).toBeLessThanOrEqual(viewport.width - 8);
		expect(result.top).toBeGreaterThanOrEqual(8);
		expect(result.top + bubble.height).toBeLessThanOrEqual(viewport.height - 8);
	});

	it('aligns the arrow toward the trigger center', () => {
		const result = computeTooltipPosition({
			triggerRect: trigger,
			bubbleRect: bubble,
			preferredPlacement: 'top',
			viewport,
		});

		const triggerCenterX = trigger.left + trigger.width / 2;
		expect(result.arrowOffset).toBeCloseTo(triggerCenterX - result.left, 0);
	});

	it('clamps the arrow when the bubble is shifted against the viewport edge', () => {
		const result = computeTooltipPosition({
			triggerRect: { top: 200, left: 760, width: 40, height: 40 },
			bubbleRect: bubble,
			preferredPlacement: 'top',
			viewport,
		});

		expect(result.arrowOffset).toBeGreaterThanOrEqual(10);
		expect(result.arrowOffset).toBeLessThanOrEqual(bubble.width - 10);
	});
});
