import { createRef } from 'react';

import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useFloatingPosition } from './useFloatingPosition';

const setElementRect = (
	element: HTMLElement,
	rect: { top: number; left: number; width: number; height: number }
) => {
	element.getBoundingClientRect = () => ({
		top: rect.top,
		left: rect.left,
		width: rect.width,
		height: rect.height,
		bottom: rect.top + rect.height,
		right: rect.left + rect.width,
		x: rect.left,
		y: rect.top,
		toJSON: () => ({}),
	});

	Object.defineProperty(element, 'offsetWidth', {
		value: rect.width,
		configurable: true,
	});
	Object.defineProperty(element, 'offsetHeight', {
		value: rect.height,
		configurable: true,
	});
	Object.defineProperty(element, 'scrollWidth', {
		value: rect.width,
		configurable: true,
	});
	Object.defineProperty(element, 'scrollHeight', {
		value: rect.height,
		configurable: true,
	});
};

describe('useFloatingPosition', () => {
	beforeEach(() => {
		vi.stubGlobal('innerWidth', 800);
		vi.stubGlobal('innerHeight', 600);
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('returns null position and preferred placement when closed', () => {
		const triggerRef = createRef<HTMLDivElement>();
		const floatingRef = createRef<HTMLDivElement>();

		const { result } = renderHook(() =>
			useFloatingPosition({
				isOpen: false,
				triggerRef,
				floatingRef,
				preferredPlacement: 'right',
			})
		);

		expect(result.current.position).toBeNull();
		expect(result.current.placement).toBe('right');
		expect(result.current.style).toEqual({
			position: 'fixed',
			top: 0,
			left: 0,
		});
	});

	it('computes a panel position below the trigger when open', () => {
		const trigger = document.createElement('div');
		const floating = document.createElement('div');

		setElementRect(trigger, { top: 200, left: 100, width: 200, height: 40 });
		setElementRect(floating, { top: 0, left: 0, width: 200, height: 150 });

		const triggerRef = { current: trigger };
		const floatingRef = { current: floating };

		const { result } = renderHook(() =>
			useFloatingPosition({
				isOpen: true,
				triggerRef,
				floatingRef,
				matchTriggerWidth: true,
			})
		);

		expect(result.current.placement).toBe('bottom');
		expect(result.current.position?.top).toBeGreaterThan(240);
		expect(result.current.style.width).toBe(200);
	});

	it('returns tooltip styles and arrow offset in tooltip mode', () => {
		const trigger = document.createElement('div');
		const floating = document.createElement('div');

		setElementRect(trigger, { top: 100, left: 100, width: 80, height: 32 });
		setElementRect(floating, { top: 0, left: 0, width: 120, height: 40 });

		const triggerRef = { current: trigger };
		const floatingRef = { current: floating };

		const { result } = renderHook(() =>
			useFloatingPosition({
				isOpen: true,
				triggerRef,
				floatingRef,
				variant: 'tooltip',
				preferredPlacement: 'top',
			})
		);

		expect(result.current.placement).toBe('top');
		expect(result.current.style.position).toBe('fixed');
		expect(result.current.style).toHaveProperty('--tooltip-arrow-offset');
		expect(result.current.arrowOffset).toBeTypeOf('number');
	});

	it('waits for tooltip measurements before returning a position', () => {
		const trigger = document.createElement('div');
		const floating = document.createElement('div');

		setElementRect(trigger, { top: 100, left: 100, width: 80, height: 32 });
		setElementRect(floating, { top: 0, left: 0, width: 0, height: 0 });

		const triggerRef = { current: trigger };
		const floatingRef = { current: floating };

		const { result } = renderHook(() =>
			useFloatingPosition({
				isOpen: true,
				triggerRef,
				floatingRef,
				variant: 'tooltip',
			})
		);

		expect(result.current.position).toBeNull();
	});
});
