import { createElement } from 'react';
import type { ComponentProps, ReactElement } from 'react';

import { describe, expect, it } from 'vitest';

import { Button } from '@/components/ui/button';

import { assignGroupItemAttributes } from './ButtonGroup.utils';

describe('ButtonGroup.utils', () => {
	it('assigns group item attributes to valid element children', () => {
		const children = assignGroupItemAttributes(
			[
				createElement(Button, {
					variant: 'secondary',
					children: 'One',
				} satisfies ComponentProps<typeof Button>),
				'ignored',
			],
			'vertical'
		);

		const elements = children as ReactElement[];

		expect(Array.isArray(children)).toBe(true);
		expect(elements[0]).toMatchObject({
			props: {
				'data-button-group-item': 'vertical',
			},
		});
	});
});
