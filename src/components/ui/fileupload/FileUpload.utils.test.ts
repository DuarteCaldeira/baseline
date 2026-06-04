import { describe, expect, it } from 'vitest';

import { filesToArray, formatFileSize } from './FileUpload.utils';

describe('formatFileSize', () => {
	it('formats bytes', () => {
		expect(formatFileSize(0)).toBe('0 B');
		expect(formatFileSize(500)).toBe('500 B');
	});

	it('formats kilobytes', () => {
		expect(formatFileSize(1024)).toBe('1.0 KB');
	});

	it('formats megabytes', () => {
		expect(formatFileSize(1024 * 1024)).toBe('1.0 MB');
	});
});

describe('filesToArray', () => {
	it('returns an empty array for null', () => {
		expect(filesToArray(null)).toEqual([]);
	});

	it('converts a FileList to an array', () => {
		const file = new File(['content'], 'test.txt', { type: 'text/plain' });
		const list = {
			0: file,
			length: 1,
			item: (index: number) => (index === 0 ? file : null),
		} as unknown as FileList;

		expect(filesToArray(list)).toEqual([file]);
	});
});
