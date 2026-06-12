import type { ReactNode } from 'react';

import type { Size } from '@/types/common';

export type DrawerSide = 'left' | 'right';

export type DrawerProps = {
	isOpen: boolean;
	onClose: () => void;
	title?: string;
	footer?: ReactNode;
	children: ReactNode;
	side?: DrawerSide;
	size?: Size;
	closeOnBackdropClick?: boolean;
};
