import { describe, expect, it } from 'vitest';

import { getInitials } from './Avatar.utils';

describe('getInitials', () => {
	it('returns first and last initials for multi-word names', () => {
		expect(getInitials('Alice Martin')).toBe('AM');
	});

	it('returns up to two characters for a single word', () => {
		expect(getInitials('Alice')).toBe('AL');
	});

	it('returns an empty string for blank names', () => {
		expect(getInitials('   ')).toBe('');
	});
});
