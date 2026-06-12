'use client';

import { useSyncExternalStore } from 'react';

const getMediaQuerySnapshot = (query: string): boolean => {
	if (typeof window === 'undefined' || !window.matchMedia) return false;
	return window.matchMedia(query).matches;
};

const subscribeToMediaQuery = (query: string, onStoreChange: () => void) => {
	if (typeof window === 'undefined' || !window.matchMedia) return () => {};

	const media = window.matchMedia(query);
	media.addEventListener('change', onStoreChange);
	return () => media.removeEventListener('change', onStoreChange);
};

/** Subscribes to a CSS media query. Defaults to `false` during SSR. */
export const useMediaQuery = (query: string): boolean =>
	useSyncExternalStore(
		(onStoreChange) => subscribeToMediaQuery(query, onStoreChange),
		() => getMediaQuerySnapshot(query),
		() => false
	);
