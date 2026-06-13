import type { RefObject } from 'react';

/** Assigns a DOM node to a hook ref in tests — RefObject.current is readonly in types. */
export const assignRefCurrent = <T>(ref: RefObject<T | null>, value: T) => {
	(ref as { current: T | null }).current = value;
};
