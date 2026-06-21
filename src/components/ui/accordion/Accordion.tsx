import { useRef } from 'react';
import type { KeyboardEvent } from 'react';

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

	const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
		const triggers = Array.from(
			containerRef.current?.querySelectorAll<HTMLButtonElement>(
				'[data-accordion-trigger]:not([disabled])'
			) ?? []
		);

		const current = triggers.indexOf(e.currentTarget);
		let next: number | null = null;

		switch (e.key) {
			case 'ArrowDown':
				e.preventDefault();
				next = (current + 1) % triggers.length;
				break;
			case 'ArrowUp':
				e.preventDefault();
				next = (current - 1 + triggers.length) % triggers.length;
				break;
			case 'Home':
				e.preventDefault();
				next = 0;
				break;
			case 'End':
				e.preventDefault();
				next = triggers.length - 1;
				break;
		}

		if (next !== null) triggers[next].focus();
	};

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
