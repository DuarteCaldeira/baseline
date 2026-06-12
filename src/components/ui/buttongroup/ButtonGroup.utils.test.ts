import { createElement } from 'react';

import { describe, expect, it } from 'vitest';

import { Button } from '@/components/ui/button';

import { assignGroupItemAttributes } from './ButtonGroup.utils';

describe('ButtonGroup.utils', () => {
	it('assigns group item attributes to valid element children', () => {
		const children = assignGroupItemAttributes(
			[createElement(Button, { variant: 'secondary' }, 'One'), 'ignored'],
			'vertical'
		);

		expect(Array.isArray(children)).toBe(true);
		expect(
			(children as ReturnType<typeof assignGroupItemAttributes>)[0]
		).toMatchObject({
			props: {
				'data-button-group-item': 'vertical',
			},
		});
	});
});
