import { describe, expect, it } from 'vitest';

import { computeFloatingPosition } from './floatingPosition';

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
