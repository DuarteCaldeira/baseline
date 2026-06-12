import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Stepper } from './Stepper';

const STEPS = [
	{ label: 'Account' },
	{ label: 'Profile' },
	{ label: 'Review' },
];

const STEPS_WITH_DESC = [
	{ label: 'Account', description: 'Create your account' },
	{ label: 'Profile', description: 'Add your details' },
	{ label: 'Review', description: 'Confirm everything' },
];

describe('Stepper', () => {
	// ── Step indicators ──────────────────────────────────────────────────────

	it('renders a check icon for completed steps', () => {
		const { container } = render(
			<Stepper steps={STEPS} currentStep={2} />
		);

		expect(container.querySelectorAll('.step--complete svg')).toHaveLength(2);
	});

	it('renders step numbers for current and upcoming steps', () => {
		render(<Stepper steps={STEPS} currentStep={1} />);

		expect(screen.getByText('2')).toBeInTheDocument();
		expect(screen.getByText('3')).toBeInTheDocument();
	});

	it('renders all step labels', () => {
		render(<Stepper steps={STEPS} currentStep={0} />);

		expect(screen.getByText('Account')).toBeInTheDocument();
		expect(screen.getByText('Profile')).toBeInTheDocument();
		expect(screen.getByText('Review')).toBeInTheDocument();
	});

	it('renders step descriptions when provided', () => {
		render(<Stepper steps={STEPS_WITH_DESC} currentStep={0} />);

		expect(screen.getByText('Create your account')).toBeInTheDocument();
		expect(screen.getByText('Add your details')).toBeInTheDocument();
		expect(screen.getByText('Confirm everything')).toBeInTheDocument();
	});

	it('does not render descriptions when not provided', () => {
		const { container } = render(<Stepper steps={STEPS} currentStep={0} />);

		expect(container.querySelectorAll('.step__description')).toHaveLength(0);
	});

	// ── ARIA ─────────────────────────────────────────────────────────────────

	it('marks only the current step with aria-current="step"', () => {
		render(<Stepper steps={STEPS} currentStep={1} />);

		const items = screen.getAllByRole('listitem');
		expect(items[0]).not.toHaveAttribute('aria-current');
		expect(items[1]).toHaveAttribute('aria-current', 'step');
		expect(items[2]).not.toHaveAttribute('aria-current');
	});

	it('marks no step with aria-current when beyond the last step', () => {
		render(<Stepper steps={STEPS} currentStep={3} />);

		const items = screen.getAllByRole('listitem');
		items.forEach((item) => expect(item).not.toHaveAttribute('aria-current'));
	});

	// ── Navigation buttons ───────────────────────────────────────────────────

	it('disables the Previous button on the first step', () => {
		render(<Stepper steps={STEPS} currentStep={0} />);

		expect(screen.getByRole('button', { name: /previous/i })).toBeDisabled();
	});

	it('disables the Next button on the last step', () => {
		render(<Stepper steps={STEPS} currentStep={2} />);

		expect(screen.getByRole('button', { name: /next/i })).toBeDisabled();
	});

	it('enables both buttons on a middle step', () => {
		render(<Stepper steps={STEPS} currentStep={1} />);

		expect(screen.getByRole('button', { name: /previous/i })).toBeEnabled();
		expect(screen.getByRole('button', { name: /next/i })).toBeEnabled();
	});

	// ── Uncontrolled navigation ──────────────────────────────────────────────

	it('advances to the next step when Next is clicked', () => {
		render(<Stepper steps={STEPS} />);

		fireEvent.click(screen.getByRole('button', { name: /next/i }));

		const items = screen.getAllByRole('listitem');
		expect(items[1]).toHaveAttribute('aria-current', 'step');
	});

	it('goes back to the previous step when Previous is clicked', () => {
		render(<Stepper steps={STEPS} defaultStep={2} />);

		fireEvent.click(screen.getByRole('button', { name: /previous/i }));

		const items = screen.getAllByRole('listitem');
		expect(items[1]).toHaveAttribute('aria-current', 'step');
	});

	it('does not go below step 0', () => {
		render(<Stepper steps={STEPS} />);

		// Previous is disabled at step 0, but verify internal clamping via Next/Previous
		fireEvent.click(screen.getByRole('button', { name: /next/i }));
		fireEvent.click(screen.getByRole('button', { name: /previous/i }));
		fireEvent.click(screen.getByRole('button', { name: /previous/i }));

		const items = screen.getAllByRole('listitem');
		expect(items[0]).toHaveAttribute('aria-current', 'step');
	});

	it('does not go above the last step', () => {
		render(<Stepper steps={STEPS} defaultStep={2} />);

		fireEvent.click(screen.getByRole('button', { name: /next/i }));
		fireEvent.click(screen.getByRole('button', { name: /next/i }));

		const items = screen.getAllByRole('listitem');
		// last step (index 2) stays active
		expect(items[2]).toHaveAttribute('aria-current', 'step');
	});

	// ── Callbacks ────────────────────────────────────────────────────────────

	it('calls onStepChange with the next step index when Next is clicked', () => {
		const onStepChange = vi.fn();
		render(<Stepper steps={STEPS} defaultStep={0} onStepChange={onStepChange} />);

		fireEvent.click(screen.getByRole('button', { name: /next/i }));

		expect(onStepChange).toHaveBeenCalledOnce();
		expect(onStepChange).toHaveBeenCalledWith(1);
	});

	it('calls onStepChange with the previous step index when Previous is clicked', () => {
		const onStepChange = vi.fn();
		render(<Stepper steps={STEPS} defaultStep={2} onStepChange={onStepChange} />);

		fireEvent.click(screen.getByRole('button', { name: /previous/i }));

		expect(onStepChange).toHaveBeenCalledWith(1);
	});

	// ── Controlled mode ──────────────────────────────────────────────────────

	it('respects the defaultStep prop as the initial active step', () => {
		render(<Stepper steps={STEPS} defaultStep={2} />);

		const items = screen.getAllByRole('listitem');
		expect(items[2]).toHaveAttribute('aria-current', 'step');
	});

	it('respects the controlled currentStep prop', () => {
		render(<Stepper steps={STEPS} currentStep={2} />);

		const items = screen.getAllByRole('listitem');
		expect(items[2]).toHaveAttribute('aria-current', 'step');
	});

	it('does not change step internally when controlled', () => {
		render(<Stepper steps={STEPS} currentStep={0} />);

		fireEvent.click(screen.getByRole('button', { name: /next/i }));

		// Still on step 0 — the consumer owns the state
		const items = screen.getAllByRole('listitem');
		expect(items[0]).toHaveAttribute('aria-current', 'step');
	});

	// ── Children / step content ──────────────────────────────────────────────

	it('renders the content for the active step', () => {
		render(
			<Stepper steps={STEPS} currentStep={1}>
				<div>Panel A</div>
				<div>Panel B</div>
				<div>Panel C</div>
			</Stepper>
		);

		expect(screen.getByText('Panel B')).toBeInTheDocument();
		expect(screen.queryByText('Panel A')).not.toBeInTheDocument();
		expect(screen.queryByText('Panel C')).not.toBeInTheDocument();
	});

	it('switches the displayed panel when navigating', () => {
		render(
			<Stepper steps={STEPS}>
				<div>Panel A</div>
				<div>Panel B</div>
				<div>Panel C</div>
			</Stepper>
		);

		expect(screen.getByText('Panel A')).toBeInTheDocument();

		fireEvent.click(screen.getByRole('button', { name: /next/i }));

		expect(screen.queryByText('Panel A')).not.toBeInTheDocument();
		expect(screen.getByText('Panel B')).toBeInTheDocument();
	});

	it('renders custom navigation labels', () => {
		render(
			<Stepper
				steps={STEPS}
				previousLabel="Back"
				nextLabel="Continue"
			/>
		);

		expect(screen.getByRole('button', { name: 'Back' })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Continue' })).toBeInTheDocument();
	});

	it('renders duplicate labels when steps have distinct ids', () => {
		const steps = [
			{ id: 'account-step', label: 'Details' },
			{ id: 'profile-step', label: 'Details' },
		];

		render(<Stepper steps={steps} currentStep={0} />);

		expect(screen.getAllByText('Details')).toHaveLength(2);
	});
});
