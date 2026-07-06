import { useRef } from 'react';

import { useRovingFocus } from '@/hooks/useRovingFocus';

import styles from './Accordion.module.scss';
import type { AccordionProps } from './Accordion.types';
import { AccordionItem } from './AccordionItem';
import { useAccordion } from './useAccordion';

export const Accordion = ({
	items,
	type = 'single',
	defaultValue,
	value,
	onChange,
}: AccordionProps) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const { isOpen, toggle } = useAccordion({
		type,
		defaultValue,
		value,
		onChange,
	});

	const handleKeyDown = useRovingFocus<HTMLButtonElement>({
		containerRef,
		itemSelector: '[data-accordion-trigger]:not([disabled])',
		keyMap: {
			next: 'ArrowDown',
			prev: 'ArrowUp',
			first: 'Home',
			last: 'End',
		},
	});

	return (
		<div ref={containerRef} className={styles.accordion}>
			{items.map((item) => (
				<AccordionItem
					key={item.id}
					item={item}
					open={isOpen(item.id)}
					onToggle={toggle}
					onKeyDown={handleKeyDown}
				/>
			))}
		</div>
	);
};
