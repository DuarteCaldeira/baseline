import { useEffect, useState } from 'react';

/**
 * Returns true after the component has mounted on the client.
 * Useful for guarding portal renders in SSR environments.
 */
export const useMounted = (): boolean => {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	return mounted;
};
