import { render, screen } from '@testing-library/react';
import { CheckCircle } from 'lucide-react';
import { describe, expect, it } from 'vitest';

import { Badge } from './Badge';

describe('Badge', () => {
	it('renders the text prop', () => {
		render(<Badge variant="success" text="Approved" />);
		expect(screen.getByText('Approved')).toBeInTheDocument();
	});

	it('renders without text when text is omitted', () => {
		const { container } = render(
			<Badge variant="success" icon={CheckCircle} aria-label="Approved" />
		);
		expect(container.querySelector('.badge')).toBeInTheDocument();
	});

	it('exposes an accessible name for icon-only badges', () => {
		render(
			<Badge variant="success" icon={CheckCircle} aria-label="Approved" />
		);
		expect(screen.getByRole('img', { name: 'Approved' })).toBeInTheDocument();
	});

	it('renders as an inline span', () => {
		render(<Badge variant="info" text="Info" />);
		expect(screen.getByText('Info').tagName).toBe('SPAN');
	});

	it.each(['success', 'error', 'warning', 'info', 'neutral'] as const)(
		'applies the %s variant class',
		(variant) => {
			const { container } = render(
				<Badge variant={variant} text={variant} />
			);
			expect(
				container.querySelector(`.badge--${variant}`)
			).toBeInTheDocument();
		}
	);

	it('applies the outlined modifier class when type is outlined', () => {
		const { container } = render(
			<Badge variant="success" type="outlined" text="Approved" />
		);
		expect(container.querySelector('.badge--outlined')).toBeInTheDocument();
	});

	it('does not apply the outlined class when type is filled', () => {
		const { container } = render(
			<Badge variant="success" type="filled" text="Approved" />
		);
		expect(
			container.querySelector('.badge--outlined')
		).not.toBeInTheDocument();
	});

	it('renders an icon when the icon prop is provided', () => {
		const { container } = render(
			<Badge variant="success" icon={CheckCircle} text="Done" />
		);
		expect(container.querySelector('svg')).toBeInTheDocument();
	});

	it('does not render an icon element when icon prop is omitted', () => {
		const { container } = render(<Badge variant="success" text="Done" />);
		expect(container.querySelector('svg')).not.toBeInTheDocument();
	});

	it('marks the icon as aria-hidden', () => {
		const { container } = render(
			<Badge variant="success" icon={CheckCircle} text="Done" />
		);
		expect(container.querySelector('.icon')).toHaveAttribute('aria-hidden', 'true');
	});

});
