import { createElement } from 'react';
import { describe, expect, it } from 'vitest';

import { enhanceGroupChildren } from './enhanceGroupChildren';

describe('enhanceGroupChildren', () => {
	it('merges item class names onto each child', () => {
		const enhanced = enhanceGroupChildren(
			[
				createElement('button', { type: 'button', className: 'child' }, 'One'),
				createElement('button', { type: 'button' }, 'Two'),
			],
			(index) => (index === 0 ? 'first' : 'last')
		);

		expect(enhanced).toHaveLength(2);
		expect(enhanced[0].props.className).toContain('child');
		expect(enhanced[0].props.className).toContain('first');
		expect(enhanced[1].props.className).toContain('last');
	});
});
