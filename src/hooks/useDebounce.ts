import { useEffect, useState } from 'react';

/**
 * Returns a debounced copy of `value` that only updates after `delayMs`
 * of inactivity. Useful for deferring expensive computations (e.g. filtering
 * large datasets) until the user pauses typing.
 */
export const useDebounce = <T>(value: T, delayMs: number): T => {
	const [debounced, setDebounced] = useState<T>(value);

	useEffect(() => {
		const id = setTimeout(() => setDebounced(value), delayMs);
		return () => clearTimeout(id);
	}, [value, delayMs]);

	return debounced;
};
