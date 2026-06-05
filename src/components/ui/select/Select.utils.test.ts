import { describe, expect, it } from 'vitest';

import {
	getDescribedBy,
	getErrorId,
	getHelperId,
	getLabelId,
	getListboxId,
	getOptionId,
	getTriggerId,
} from './Select.utils';

describe('Select.utils', () => {
	it('builds stable element ids', () => {
		expect(getTriggerId('fruit')).toBe('fruit');
		expect(getLabelId('fruit')).toBe('fruit-label');
		expect(getListboxId('fruit')).toBe('fruit-listbox');
		expect(getOptionId('fruit', 'apple')).toBe('fruit-option-apple');
		expect(getHelperId('fruit')).toBe('fruit-helper');
		expect(getErrorId('fruit')).toBe('fruit-error');
	});

	it('joins described-by ids and omits empty values', () => {
		expect(getDescribedBy(['fruit-helper', undefined])).toBe('fruit-helper');
		expect(getDescribedBy(['fruit-helper', 'fruit-error'])).toBe(
			'fruit-helper fruit-error'
		);
		expect(getDescribedBy([undefined, undefined])).toBeUndefined();
	});
});
