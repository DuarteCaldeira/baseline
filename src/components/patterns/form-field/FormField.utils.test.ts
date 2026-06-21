import { describe, expect, it } from 'vitest';

import { OPTIONAL_FIELD_LABEL, isOptionalFieldLabel } from './FormField.utils';

describe('isOptionalFieldLabel', () => {
	it('returns true when a label exists and the field is not required', () => {
		expect(isOptionalFieldLabel('Email', false)).toBe(true);
		expect(isOptionalFieldLabel('Email')).toBe(true);
	});

	it('returns false when the field is required', () => {
		expect(isOptionalFieldLabel('Email', true)).toBe(false);
	});

	it('returns false when the label is omitted', () => {
		expect(isOptionalFieldLabel(undefined, false)).toBe(false);
	});
});

describe('OPTIONAL_FIELD_LABEL', () => {
	it('uses the Portuguese optional label', () => {
		expect(OPTIONAL_FIELD_LABEL).toBe('(opcional)');
	});
});
