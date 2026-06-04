import type { ReactNode } from 'react';

export type TabItem = {
	id: string;
	label: string;
	content: ReactNode;
	disabled?: boolean;
};
