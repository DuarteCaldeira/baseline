import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Toast } from './Toast';
import { ToastProvider } from './ToastProvider';
import { useToast } from './useToast';

// ─── Toast visual component ───────────────────────────────────────────────────

describe('Toast', () => {
	let user: ReturnType<typeof userEvent.setup>;

	beforeEach(() => {
		vi.useFakeTimers();
		user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
	});
	afterEach(() => vi.useRealTimers());

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

	it('calls onDismiss when the close button is clicked', async () => {
		const onDismiss = vi.fn();
		render(
			<Toast id="1" variant="success" message="Done." onDismiss={onDismiss} />
		);

		await user.click(
			screen.getByRole('button', { name: /dismiss notification/i })
		);

		act(() => vi.advanceTimersByTime(300));
		expect(onDismiss).toHaveBeenCalledWith('1');
	});

	it('auto-dismisses after 6 seconds', () => {
		const onDismiss = vi.fn();
		render(
			<Toast
				id="1"
				variant="info"
				message="Auto-dismiss."
				onDismiss={onDismiss}
			/>
		);

		act(() => vi.advanceTimersByTime(6000));
		expect(onDismiss).toHaveBeenCalledWith('1');
	});

	it('does not call onDismiss before 6 seconds', () => {
		const onDismiss = vi.fn();
		render(
			<Toast
				id="1"
				variant="info"
				message="Still here."
				onDismiss={onDismiss}
			/>
		);

		act(() => vi.advanceTimersByTime(5000));
		expect(onDismiss).not.toHaveBeenCalled();
	});

	it('adds dismissing class at 5700ms', () => {
		const { container } = render(
			<Toast id="1" variant="info" message="Fading." onDismiss={vi.fn()} />
		);

		act(() => vi.advanceTimersByTime(5700));
		expect(container.querySelector('.toast--dismissing')).toBeInTheDocument();
	});

	it('clears timers when unmounted', () => {
		const onDismiss = vi.fn();
		const { unmount } = render(
			<Toast id="1" variant="success" message="Gone." onDismiss={onDismiss} />
		);

		unmount();
		act(() => vi.advanceTimersByTime(6000));
		expect(onDismiss).not.toHaveBeenCalled();
	});
});

// ─── ToastProvider + useToast integration ────────────────────────────────────

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
	let user: ReturnType<typeof userEvent.setup>;

	beforeEach(() => {
		vi.useFakeTimers();
		user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
	});
	afterEach(() => vi.useRealTimers());

	it('renders children', () => {
		render(
			<ToastProvider>
				<p>Content</p>
			</ToastProvider>
		);
		expect(screen.getByText('Content')).toBeInTheDocument();
	});

	it('shows a toast when show() is called', async () => {
		render(
			<ToastProvider>
				<TestConsumer />
			</ToastProvider>
		);

		await user.click(screen.getByRole('button', { name: /show success/i }));
		expect(screen.getByText('Saved!')).toBeInTheDocument();
	});

	it('shows a toast with a title', async () => {
		render(
			<ToastProvider>
				<TestConsumer />
			</ToastProvider>
		);

		await user.click(screen.getByRole('button', { name: /show error/i }));
		expect(screen.getByText('Oops')).toBeInTheDocument();
		expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
	});

	it('removes a toast after 6 seconds', async () => {
		render(
			<ToastProvider>
				<TestConsumer />
			</ToastProvider>
		);

		await user.click(screen.getByRole('button', { name: /show success/i }));
		expect(screen.getByText('Saved!')).toBeInTheDocument();

		act(() => vi.advanceTimersByTime(6000));
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
