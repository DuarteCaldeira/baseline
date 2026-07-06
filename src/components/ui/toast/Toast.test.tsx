import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { setupFakeTimers } from '@/test-utils/setupFakeTimers';

import { Toast } from './Toast';
import { TOAST_DISMISS_DELAY, TOAST_EXIT_DURATION } from './Toast.constants';
import { ToastProvider } from './ToastProvider';
import { useToast } from './useToast';

setupFakeTimers();

describe('Toast', () => {
	it('renders the message', () => {
		render(
			<Toast
				id="1"
				variant="success"
				message="Saved successfully."
				onDismiss={vi.fn()}
			/>
		);
		expect(screen.getByText('Saved successfully.')).toBeInTheDocument();
	});

	it('renders the title when provided', () => {
		render(
			<Toast
				id="1"
				variant="success"
				title="Done"
				message="Saved successfully."
				onDismiss={vi.fn()}
			/>
		);
		expect(screen.getByText('Done')).toBeInTheDocument();
	});

	it('does not render a title element when title is omitted', () => {
		render(
			<Toast
				id="1"
				variant="info"
				message="Info message."
				onDismiss={vi.fn()}
			/>
		);
		expect(screen.queryByText('Done')).not.toBeInTheDocument();
	});

	it('applies the correct variant class', () => {
		const { container } = render(
			<Toast id="1" variant="error" message="Error." onDismiss={vi.fn()} />
		);
		expect(container.querySelector('.toast--error')).toBeInTheDocument();
	});

	it.each([
		['error', 'alert'],
		['warning', 'alert'],
		['success', 'status'],
		['info', 'status'],
	] as const)('uses role="%s" for %s variant', (variant, role) => {
		render(
			<Toast id="1" variant={variant} message="Message." onDismiss={vi.fn()} />
		);
		expect(screen.getByRole(role)).toBeInTheDocument();
	});

	it('calls onDismiss when the close button is clicked', () => {
		const onDismiss = vi.fn();
		render(
			<Toast id="1" variant="success" message="Done." onDismiss={onDismiss} />
		);

		fireEvent.click(
			screen.getByRole('button', { name: /dismiss notification/i })
		);

		expect(onDismiss).toHaveBeenCalledWith('1');
	});

	it('adds dismissing class when requested by the provider', () => {
		const { container } = render(
			<Toast
				id="1"
				variant="info"
				message="Fading."
				dismissing
				onDismiss={vi.fn()}
			/>
		);

		expect(container.querySelector('.toast--dismissing')).toBeInTheDocument();
	});
});

const TestConsumer = () => {
	const { show, dismiss } = useToast();
	return (
		<>
			<button onClick={() => show({ variant: 'success', message: 'Saved!' })}>
				show success
			</button>
			<button
				onClick={() =>
					show({
						variant: 'error',
						title: 'Oops',
						message: 'Something went wrong.',
					})
				}
			>
				show error
			</button>
			<button onClick={() => dismiss('1')}>dismiss</button>
		</>
	);
};

describe('ToastProvider', () => {
	it('renders children', () => {
		render(
			<ToastProvider>
				<p>Content</p>
			</ToastProvider>
		);
		expect(screen.getByText('Content')).toBeInTheDocument();
	});

	it('shows a toast when show() is called', () => {
		render(
			<ToastProvider>
				<TestConsumer />
			</ToastProvider>
		);

		fireEvent.click(screen.getByRole('button', { name: /show success/i }));
		expect(screen.getByText('Saved!')).toBeInTheDocument();
	});

	it('shows a toast with a title', () => {
		render(
			<ToastProvider>
				<TestConsumer />
			</ToastProvider>
		);

		fireEvent.click(screen.getByRole('button', { name: /show error/i }));
		expect(screen.getByText('Oops')).toBeInTheDocument();
		expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
	});

	it('starts the dismissing state before auto-removal', () => {
		render(
			<ToastProvider>
				<TestConsumer />
			</ToastProvider>
		);

		fireEvent.click(screen.getByRole('button', { name: /show success/i }));
		act(() =>
			vi.advanceTimersByTime(TOAST_DISMISS_DELAY - TOAST_EXIT_DURATION)
		);

		expect(
			document.body.querySelector('.toast--dismissing')
		).toBeInTheDocument();
	});

	it('removes a toast after 6 seconds', () => {
		render(
			<ToastProvider>
				<TestConsumer />
			</ToastProvider>
		);

		fireEvent.click(screen.getByRole('button', { name: /show success/i }));
		expect(screen.getByText('Saved!')).toBeInTheDocument();

		act(() => vi.advanceTimersByTime(TOAST_DISMISS_DELAY));
		expect(screen.queryByText('Saved!')).not.toBeInTheDocument();
	});

	it('removes a toast shortly after dismiss() is called', () => {
		render(
			<ToastProvider>
				<TestConsumer />
			</ToastProvider>
		);

		fireEvent.click(screen.getByRole('button', { name: /show success/i }));
		expect(screen.getByText('Saved!')).toBeInTheDocument();

		fireEvent.click(screen.getByRole('button', { name: /^dismiss$/i }));
		act(() => vi.advanceTimersByTime(TOAST_EXIT_DURATION));

		expect(screen.queryByText('Saved!')).not.toBeInTheDocument();
	});

	it('throws when useToast is used outside ToastProvider', () => {
		const consoleError = vi
			.spyOn(console, 'error')
			.mockImplementation(() => {});

		expect(() => render(<TestConsumer />)).toThrow(
			'useToast must be used within a <ToastProvider>'
		);

		consoleError.mockRestore();
	});
});
