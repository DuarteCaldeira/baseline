import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Stepper } from './Stepper';

const STEPS = [
	{ label: 'Account' },
	{ label: 'Profile' },
	{ label: 'Review' },
];

describe('Stepper', () => {
	it('renders an X icon for completed steps', () => {
		const { container } = render(
			<Stepper steps={STEPS} currentStep={2} />
		);

		expect(container.querySelectorAll('.step--complete svg')).toHaveLength(2);
	});

	it('renders step numbers for current and upcoming steps', () => {
		render(<Stepper steps={STEPS} currentStep={1} />);

		expect(document.body).toHaveTextContent('2');
		expect(document.body).toHaveTextContent('3');
	});
});
