import { describe, expect, it } from 'vitest';

import {
	computeFloatingPosition,
	computeTooltipPosition,
} from './floatingPosition';

describe('computeFloatingPosition', () => {
	const trigger = { top: 200, left: 200, width: 240, height: 40 };
	const floating = { top: 0, left: 0, width: 240, height: 200 };
	const viewport = { width: 800, height: 600 };

	it('opens below the trigger by default', () => {
		const result = computeFloatingPosition({
			triggerRect: trigger,
			floatingRect: floating,
			viewport,
		});

		expect(result.placement).toBe('bottom');
		expect(result.top).toBeGreaterThan(trigger.top + trigger.height);
		expect(result.left).toBe(trigger.left);
		expect(result.width).toBe(trigger.width);
	});

	it('flips above the trigger when there is no room below', () => {
		const result = computeFloatingPosition({
			triggerRect: { top: 500, left: 200, width: 240, height: 40 },
			floatingRect: floating,
			viewport,
		});

		expect(result.placement).toBe('top');
		expect(result.top).toBeLessThan(500);
	});

	it('aligns to the end of the trigger', () => {
		const result = computeFloatingPosition({
			triggerRect: trigger,
			floatingRect: { top: 0, left: 0, width: 160, height: 120 },
			viewport,
			align: 'end',
			matchTriggerWidth: false,
		});

		expect(result.left).toBe(trigger.left + trigger.width - 160);
	});

	it('keeps the panel inside the viewport horizontally', () => {
		const result = computeFloatingPosition({
			triggerRect: { top: 200, left: 720, width: 240, height: 40 },
			floatingRect: floating,
			viewport,
		});

		expect(result.left).toBeGreaterThanOrEqual(8);
		expect(result.left + result.width).toBeLessThanOrEqual(viewport.width - 8);
	});

	it('opens to the right of the trigger for submenu placement', () => {
		const result = computeFloatingPosition({
			triggerRect: trigger,
			floatingRect: { top: 0, left: 0, width: 160, height: 120 },
			viewport,
			preferredPlacement: 'right',
			gap: 0,
		});

		expect(result.placement).toBe('right');
		expect(result.left).toBe(trigger.left + trigger.width);
		expect(result.top).toBe(trigger.top);
	});

	it('caps maxHeight to the provided limit', () => {
		const result = computeFloatingPosition({
			triggerRect: trigger,
			floatingRect: floating,
			viewport,
			maxHeightLimit: 120,
		});

		expect(result.maxHeight).toBeLessThanOrEqual(120);
	});
});

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
