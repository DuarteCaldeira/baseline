import { describe, expect, it } from 'vitest';

import { computeTabIndicator } from './useTabIndicator.utils';

describe('computeTabIndicator', () => {
	it('positions the indicator relative to the tab list', () => {
		const result = computeTabIndicator({
			listLeft: 100,
			listScrollLeft: 0,
			tabLeft: 160,
			tabWidth: 80,
		});

		expect(result).toEqual({ left: 60, width: 80 });
	});

	it('accounts for horizontal scroll on the tab list', () => {
		const result = computeTabIndicator({
			listLeft: 100,
			listScrollLeft: 40,
			tabLeft: 260,
			tabWidth: 96,
		});

		expect(result).toEqual({ left: 200, width: 96 });
	});

	it('returns zero offset when the tab aligns with the list edge', () => {
		const result = computeTabIndicator({
			listLeft: 48,
			listScrollLeft: 0,
			tabLeft: 48,
			tabWidth: 72,
		});

		expect(result).toEqual({ left: 0, width: 72 });
	});
});
