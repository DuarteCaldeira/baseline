import { describe, expect, it } from 'vitest';

import {
	getDescribedBy,
	getErrorId,
	getFieldControlProps,
	getHelperId,
	getLabelId,
	resolveFieldIds,
} from './fieldIds';

describe('fieldIds', () => {
	it('builds stable element ids', () => {
		expect(getLabelId('email')).toBe('email-label');
		expect(getHelperId('email')).toBe('email-helper');
		expect(getErrorId('email')).toBe('email-error');
	});

	it('joins described-by ids and omits empty values', () => {
		expect(getDescribedBy(['email-helper', undefined])).toBe('email-helper');
		expect(getDescribedBy(['email-helper', 'email-error'])).toBe(
			'email-helper email-error'
		);
		expect(getDescribedBy([undefined, undefined])).toBeUndefined();
	});

	it('resolves helper, error, and described-by ids from field id', () => {
		expect(
			resolveFieldIds('email', {
				helperText: 'Help',
				error: 'Required',
			})
		).toEqual({
			helperId: 'email-helper',
			errorId: 'email-error',
			describedBy: 'email-helper email-error',
		});
	});

	it('omits ids when field id is missing', () => {
		expect(
			resolveFieldIds(undefined, {
				helperText: 'Help',
				error: 'Required',
			})
		).toEqual({
			helperId: undefined,
			errorId: undefined,
			describedBy: undefined,
		});
	});

	it('omits helper id when helper text is missing', () => {
		expect(resolveFieldIds('email', { error: 'Required' })).toEqual({
			helperId: undefined,
			errorId: 'email-error',
			describedBy: 'email-error',
		});
	});

	it('builds shared field control aria props', () => {
		expect(
			getFieldControlProps('email', {
				helperText: 'Help',
				error: 'Required',
			})
		).toEqual({
			'aria-describedby': 'email-helper email-error',
			'aria-invalid': true,
		});
	});
});
