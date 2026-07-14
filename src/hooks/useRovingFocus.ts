import { useCallback } from 'react';
import type { KeyboardEvent, RefObject } from 'react';

type UseRovingFocusOptions = {
	containerRef: RefObject<HTMLElement | null>;
	itemSelector: string;
	keyMap: {
		next: string;
		prev: string;
		first: string;
		last: string;
	};
};

export const useRovingFocus = <T extends HTMLElement>({
	containerRef,
	itemSelector,
	keyMap,
}: UseRovingFocusOptions) =>
	useCallback(
		(event: KeyboardEvent<T>) => {
			const items = Array.from(
				containerRef.current?.querySelectorAll<T>(itemSelector) ?? []
			);

			if (items.length === 0) return;

			const currentIndex = items.indexOf(event.currentTarget);
			let nextIndex: number | null = null;

			switch (event.key) {
				case keyMap.next:
					event.preventDefault();
					nextIndex = (currentIndex + 1) % items.length;
					break;
				case keyMap.prev:
					event.preventDefault();
					nextIndex = (currentIndex - 1 + items.length) % items.length;
					break;
				case keyMap.first:
					event.preventDefault();
					nextIndex = 0;
					break;
				case keyMap.last:
					event.preventDefault();
					nextIndex = items.length - 1;
					break;
			}

			if (nextIndex !== null) {
				items[nextIndex]?.focus();
			}
		},
		[containerRef, itemSelector, keyMap]
	);
