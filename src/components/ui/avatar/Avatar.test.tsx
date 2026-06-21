import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Avatar } from './Avatar';

describe('Avatar', () => {
	it('renders an image when src is provided', () => {
		render(<Avatar name="Alice Martin" src="/alice.jpg" />);

		const image = screen.getByRole('img', { name: 'Alice Martin' });
		expect(image).toHaveAttribute('src', '/alice.jpg');
	});

	it('uses a custom alt for the image when provided', () => {
		render(
			<Avatar
				name="Alice Martin"
				src="/alice.jpg"
				alt="Profile photo of Alice Martin"
			/>
		);

		expect(
			screen.getByRole('img', { name: 'Profile photo of Alice Martin' })
		).toBeInTheDocument();
	});

	it('renders initials when src is omitted', () => {
		render(<Avatar name="Alice Martin" />);

		expect(screen.getByRole('img', { name: 'Alice Martin' })).toHaveTextContent(
			'AM'
		);
	});

	it('renders initials when the image fails to load', () => {
		render(<Avatar name="Bob Chen" src="/missing.jpg" />);

		const image = screen.getByRole('img', { name: 'Bob Chen' });
		fireEvent.error(image);

		expect(screen.getByRole('img', { name: 'Bob Chen' })).toHaveTextContent(
			'BC'
		);
		expect(document.querySelector('img')).not.toBeInTheDocument();
	});

	it('renders a user icon when initials cannot be derived', () => {
		const { container } = render(<Avatar name="  " />);

		expect(container.querySelector('.avatar')).toHaveAttribute(
			'aria-label',
			'  '
		);
		expect(container.querySelector('svg')).toBeInTheDocument();
	});

	it.each(['xs', 'sm', 'md', 'lg'] as const)(
		'applies the %s size class',
		(size) => {
			const { container } = render(<Avatar name="Alice Martin" size={size} />);
			expect(container.querySelector(`.avatar--${size}`)).toBeInTheDocument();
		}
	);

	it('defaults to the md size class', () => {
		const { container } = render(<Avatar name="Alice Martin" />);
		expect(container.querySelector('.avatar--md')).toBeInTheDocument();
	});

	it('merges a custom className', () => {
		const { container } = render(
			<Avatar name="Alice Martin" className="profile-avatar" />
		);
		expect(container.querySelector('.profile-avatar')).toBeInTheDocument();
	});
});
