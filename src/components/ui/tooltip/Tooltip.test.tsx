import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

import { Button } from '@/components/ui/button';

import { Tooltip } from './Tooltip';

describe('Tooltip', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('renders the trigger child', () => {
		render(
			<Tooltip content="Helpful hint">
				<Button>Save</Button>
			</Tooltip>
		);

		expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
	});

	it('shows the tooltip on hover after the open delay', () => {
		render(
			<Tooltip content="Helpful hint" openDelay={200}>
				<Button>Save</Button>
			</Tooltip>
		);

		fireEvent.mouseEnter(screen.getByRole('button', { name: 'Save' }));
		expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

		act(() => {
			vi.advanceTimersByTime(200);
		});

		expect(screen.getByRole('tooltip')).toHaveTextContent('Helpful hint');
	});

	it('shows the tooltip on focus', () => {
		render(
			<Tooltip content="Keyboard accessible" openDelay={0}>
				<Button>Save</Button>
			</Tooltip>
		);

		fireEvent.focus(screen.getByRole('button', { name: 'Save' }));

		act(() => {
			vi.runAllTimers();
		});

		expect(screen.getByRole('tooltip')).toHaveTextContent(
			'Keyboard accessible'
		);
	});

	it('hides the tooltip on blur', () => {
		render(
			<Tooltip content="Temporary hint" openDelay={0} closeDelay={0}>
				<Button>Save</Button>
			</Tooltip>
		);

		const trigger = screen.getByRole('button', { name: 'Save' });

		fireEvent.focus(trigger);

		act(() => {
			vi.runAllTimers();
		});

		expect(screen.getByRole('tooltip')).toBeInTheDocument();

		fireEvent.blur(trigger);

		act(() => {
			vi.runAllTimers();
		});

		expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
	});

	it('links the trigger with aria-describedby when open', () => {
		render(
			<Tooltip content="Described action" openDelay={0}>
				<Button>Save</Button>
			</Tooltip>
		);

		const trigger = screen.getByRole('button', { name: 'Save' });
		fireEvent.focus(trigger);

		act(() => {
			vi.runAllTimers();
		});

		const tooltip = screen.getByRole('tooltip');
		expect(trigger).toHaveAttribute('aria-describedby', tooltip.id);
	});

	it('applies the arrow placement modifier class', () => {
		render(
			<Tooltip content="Below" placement="bottom" openDelay={0}>
				<Button>Save</Button>
			</Tooltip>
		);

		fireEvent.focus(screen.getByRole('button', { name: 'Save' }));

		act(() => {
			vi.runAllTimers();
		});

		const tooltip = screen.getByRole('tooltip');
		expect(
			tooltip.querySelector('[class*="tooltip__arrow--bottom"]')
		).toBeInTheDocument();
	});

	it('renders a visible arrow element aligned to the trigger', () => {
		render(
			<Tooltip content="With arrow" openDelay={0}>
				<Button>Save</Button>
			</Tooltip>
		);

		fireEvent.focus(screen.getByRole('button', { name: 'Save' }));

		act(() => {
			vi.runAllTimers();
		});

		const tooltip = screen.getByRole('tooltip');
		const arrow = tooltip.querySelector('[class*="tooltip__arrow--"]');

		expect(arrow).toBeInTheDocument();
	});

	it('merges custom className on the wrapper', () => {
		const { container } = render(
			<Tooltip content="Hint" className="custom-tooltip">
				<Button>Save</Button>
			</Tooltip>
		);

		expect(container.querySelector('.custom-tooltip')).toBeInTheDocument();
	});
});
