import { act, renderHook } from '@testing-library/react';
import type { AnimationEvent } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useDrawer } from './useDrawer';

describe('useDrawer', () => {
	beforeEach(() => {
		document.body.style.overflow = '';
	});

	afterEach(() => {
		document.body.style.overflow = '';
	});

	it('starts present when isOpen is true', () => {
		const { result } = renderHook(() =>
			useDrawer({
				isOpen: true,
				onClose: vi.fn(),
				closeOnBackdropClick: true,
			})
		);

		expect(result.current.present).toBe(true);
		expect(result.current.closing).toBe(false);
	});

	it('enters closing state when isOpen becomes false', () => {
		const { result, rerender } = renderHook(
			({ isOpen }) =>
				useDrawer({
					isOpen,
					onClose: vi.fn(),
					closeOnBackdropClick: true,
				}),
			{ initialProps: { isOpen: true } }
		);

		rerender({ isOpen: false });

		expect(result.current.present).toBe(true);
		expect(result.current.closing).toBe(true);
	});

	it('unmounts after the panel exit animation ends', () => {
		const dialog = document.createElement('div');

		const { result, rerender } = renderHook(
			({ isOpen }) =>
				useDrawer({
					isOpen,
					onClose: vi.fn(),
					closeOnBackdropClick: true,
				}),
			{ initialProps: { isOpen: true } }
		);

		Object.defineProperty(result.current.dialogRef, 'current', {
			configurable: true,
			value: dialog,
		});

		rerender({ isOpen: false });

		act(() => {
			result.current.handlePanelAnimationEnd({
				target: dialog,
				currentTarget: dialog,
			} as unknown as AnimationEvent<HTMLDivElement>);
		});

		expect(result.current.present).toBe(false);
		expect(result.current.closing).toBe(false);
	});

	it('keeps body scroll locked while closing', () => {
		const { rerender } = renderHook(
			({ isOpen }) =>
				useDrawer({
					isOpen,
					onClose: vi.fn(),
					closeOnBackdropClick: true,
				}),
			{ initialProps: { isOpen: true } }
		);

		expect(document.body.style.overflow).toBe('hidden');

		rerender({ isOpen: false });

		expect(document.body.style.overflow).toBe('hidden');
	});

	it('calls onClose when Escape is pressed', () => {
		const onClose = vi.fn();

		renderHook(() =>
			useDrawer({
				isOpen: true,
				onClose,
				closeOnBackdropClick: true,
			})
		);

		act(() => {
			document.dispatchEvent(
				new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
			);
		});

		expect(onClose).toHaveBeenCalledOnce();
	});

	it('reopens without getting stuck in exiting phase', () => {
		const { result, rerender } = renderHook(
			({ isOpen }) =>
				useDrawer({
					isOpen,
					onClose: vi.fn(),
					closeOnBackdropClick: true,
				}),
			{ initialProps: { isOpen: true } }
		);

		rerender({ isOpen: false });
		expect(result.current.closing).toBe(true);

		rerender({ isOpen: true });

		expect(result.current.present).toBe(true);
		expect(result.current.closing).toBe(false);
	});
});
