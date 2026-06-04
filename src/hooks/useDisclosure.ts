import { useCallback, useState } from 'react';

interface UseDisclosureReturn {
	isOpen: boolean;
	open: () => void;
	close: () => void;
	toggle: () => void;
}

/**
 * Manages open/closed boolean state — useful for modals, drawers, and menus.
 */
export function useDisclosure(defaultOpen = false): UseDisclosureReturn {
	const [isOpen, setIsOpen] = useState(defaultOpen);

	const open = useCallback(() => setIsOpen(true), []);
	const close = useCallback(() => setIsOpen(false), []);
	const toggle = useCallback(() => setIsOpen((v) => !v), []);

	return { isOpen, open, close, toggle };
}
