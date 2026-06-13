import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';

type FloatingPortalProps = {
	isOpen: boolean;
	mounted: boolean;
	children: ReactNode;
};

export const FloatingPortal = ({
	isOpen,
	mounted,
	children,
}: FloatingPortalProps) => {
	if (!mounted || !isOpen) return null;

	return createPortal(children, document.body);
};
