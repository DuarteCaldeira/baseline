import { afterEach, describe, expect, it, vi } from 'vitest';

import { getListboxId, getOptionId, scrollOptionIntoView } from './Listbox.utils';

describe('Listbox.utils', () => {
	describe('getListboxId', () => {
		it('appends -listbox to the field id', () => {
			expect(getListboxId('fruit')).toBe('fruit-listbox');
		});

		it('works with ids that already contain hyphens', () => {
			expect(getListboxId('user-role')).toBe('user-role-listbox');
		});
	});

	describe('getOptionId', () => {
		it('combines field id and option value', () => {
			expect(getOptionId('fruit', 'apple')).toBe('fruit-option-apple');
		});

		it('preserves special characters in option values', () => {
			expect(getOptionId('country', 'pt-PT')).toBe('country-option-pt-PT');
		});

		it('keeps ids unique per option value', () => {
			expect(getOptionId('fruit', 'apple')).not.toBe(
				getOptionId('fruit', 'banana')
			);
		});
	});

	describe('scrollOptionIntoView', () => {
		afterEach(() => {
			vi.restoreAllMocks();
		});

		it('scrolls the matching element into view', () => {
			const scrollIntoView = vi.fn();
			const element = { scrollIntoView } as unknown as HTMLElement;
			vi.spyOn(document, 'getElementById').mockReturnValue(element);

			scrollOptionIntoView('fruit-option-apple');

			expect(document.getElementById).toHaveBeenCalledWith('fruit-option-apple');
			expect(scrollIntoView).toHaveBeenCalledWith({ block: 'nearest' });
		});

		it('does nothing when the element is missing', () => {
			vi.spyOn(document, 'getElementById').mockReturnValue(null);

			expect(() => scrollOptionIntoView('missing-option')).not.toThrow();
		});
	});
});
