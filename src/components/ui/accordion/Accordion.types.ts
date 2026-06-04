import type { ReactNode } from 'react';

export type AccordionType = 'single' | 'multiple';

export type AccordionItem = {
	id: string;
	title: string;
	content: ReactNode;
	disabled?: boolean;
};
