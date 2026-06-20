import type { KeyboardEvent, ReactNode } from 'react';

export type AccordionType = 'single' | 'multiple';

export type AccordionItem = {
	id: string;
	header: ReactNode;
	content: ReactNode;
	actions?: ReactNode;
	disabled?: boolean;
};

export type AccordionProps = {
	items: AccordionItem[];
	type?: AccordionType;
	/** Id(s) of items open on first render. */
	defaultValue?: string | string[];
	/** Controlled open state — mirrors Tabs `value`. */
	value?: string | string[];
	onChange?: (value: string | string[]) => void;
};

export type AccordionItemProps = {
	item: AccordionItem;
	open: boolean;
	onToggle: (id: string) => void;
	onKeyDown: (e: KeyboardEvent<HTMLButtonElement>) => void;
};
