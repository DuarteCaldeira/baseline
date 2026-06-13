import { type KeyboardEvent, type MouseEvent } from 'react';

import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { assignRefCurrent } from '@/test-utils/assignRefCurrent';

import { useModal } from './useModal';

describe('useModal', () => {
	beforeEach(() => {
		document.body.style.overflow = '';
	});

	afterEach(() => {
		document.body.style.overflow = '';
	});

	it('locks body scroll while open', () => {
		const { rerender } = renderHook(
			({ isOpen }) =>
				useModal({
					isOpen,
					onClose: vi.fn(),
					closeOnBackdropClick: true,
				}),
			{ initialProps: { isOpen: true } }
		);

		expect(document.body.style.overflow).toBe('hidden');

		rerender({ isOpen: false });

		expect(document.body.style.overflow).toBe('');
	});

	it('calls onClose when Escape is pressed', () => {
		const onClose = vi.fn();

		renderHook(() =>
			useModal({
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

	it('calls onClose on overlay click when enabled', () => {
		const onClose = vi.fn();
		const { result } = renderHook(() =>
			useModal({
				isOpen: true,
				onClose,
				closeOnBackdropClick: true,
			})
		);

		act(() => {
			result.current.handleOverlayClick();
		});

		expect(onClose).toHaveBeenCalledOnce();
	});

	it('does not call onClose on overlay click when disabled', () => {
		const onClose = vi.fn();
		const { result } = renderHook(() =>
			useModal({
				isOpen: true,
				onClose,
				closeOnBackdropClick: false,
			})
		);

		act(() => {
			result.current.handleOverlayClick();
		});

		expect(onClose).not.toHaveBeenCalled();
	});

	it('stops propagation on dialog click', () => {
		const { result } = renderHook(() =>
			useModal({
				isOpen: true,
				onClose: vi.fn(),
				closeOnBackdropClick: true,
			})
		);

		const stopPropagation = vi.fn();

		act(() => {
			result.current.handleDialogClick({
				stopPropagation,
			} as unknown as MouseEvent);
		});

		expect(stopPropagation).toHaveBeenCalledOnce();
	});

	it('traps focus within the dialog on Tab', () => {
		const dialog = document.createElement('div');
		const first = document.createElement('button');
		const last = document.createElement('button');
		dialog.append(first, last);
		document.body.append(dialog);

		last.focus();

		const { result } = renderHook(() =>
			useModal({
				isOpen: true,
				onClose: vi.fn(),
				closeOnBackdropClick: true,
			})
		);

		act(() => {
			assignRefCurrent(result.current.dialogRef, dialog);
		});

		const event = {
			key: 'Tab',
			shiftKey: false,
			preventDefault: vi.fn(),
		} as unknown as KeyboardEvent;

		act(() => {
			result.current.handleDialogKeyDown(event);
		});

		expect(event.preventDefault).toHaveBeenCalledOnce();
		expect(document.activeElement).toBe(first);

		dialog.remove();
	});
});
