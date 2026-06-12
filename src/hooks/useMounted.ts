import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};

/**
 * Returns true on the client and false during SSR.
 * Uses useSyncExternalStore so portals can render in the same commit as open state.
 */
export const useMounted = (): boolean =>
	useSyncExternalStore(
		subscribe,
		() => true,
		() => false
	);
