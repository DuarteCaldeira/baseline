import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Progress } from './Progress';

describe('Progress', () => {
	it('renders a determinate progressbar by default', () => {
		render(<Progress value={40} label="Upload progress" />);
		const progressbar = screen.getByRole('progressbar', {
			name: 'Upload progress',
		});

		expect(progressbar).toHaveAttribute('aria-valuenow', '40');
		expect(progressbar).toHaveAttribute('aria-valuemax', '100');
		expect(progressbar).toHaveAttribute('aria-valuetext', '40%');
	});

	it('clamps values outside the allowed range', () => {
		render(<Progress value={120} max={80} label="Upload progress" />);
		expect(
			screen.getByRole('progressbar', { name: 'Upload progress' })
		).toHaveAttribute('aria-valuenow', '80');
	});

	it('omits aria-valuenow for indeterminate progress', () => {
		render(<Progress indeterminate label="Loading content" />);
		const progressbar = screen.getByRole('progressbar', {
			name: 'Loading content',
		});

		expect(progressbar).not.toHaveAttribute('aria-valuenow');
		expect(progressbar).toHaveAttribute('aria-valuetext', 'Loading');
	});

	it('applies size and variant classes', () => {
		const { container } = render(<Progress size="lg" variant="success" />);
		expect(container.querySelector('.progress--lg')).toBeInTheDocument();
		expect(container.querySelector('.progress--success')).toBeInTheDocument();
	});

	it('merges a custom className', () => {
		render(<Progress className="custom" />);
		expect(screen.getByRole('progressbar')).toHaveClass('custom');
	});
});
