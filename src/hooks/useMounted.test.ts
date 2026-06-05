import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useMounted } from './useMounted';

describe('useMounted', () => {
	it('returns true after the component has mounted', async () => {
		const { result } = renderHook(() => useMounted());

		await waitFor(() => {
			expect(result.current).toBe(true);
		});
	});
});
