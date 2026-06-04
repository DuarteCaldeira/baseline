import { useRef } from 'react';
import type { KeyboardEvent } from 'react';
import { ChevronDown } from 'lucide-react';

import { Icon } from '@/components/ui/icon';
import { cn } from '@/utils/cn';

import type { AccordionItem, AccordionType } from './Accordion.types';
import { useAccordion } from './useAccordion';
import styles from './Accordion.module.scss';

export type AccordionProps = {
	items: AccordionItem[];
	type?: AccordionType;
	/** Id(s) of items open on first render. */
	defaultValue?: string | string[];
	className?: string;
};

export const Accordion = ({
	items,
	type = 'single',
	defaultValue,
	className,
}: AccordionProps) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const { isOpen, toggle } = useAccordion({ type, defaultValue });

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
		<div ref={containerRef} className={cn(styles.accordion, className)}>
			{items.map((item) => {
				const open = isOpen(item.id);
				const triggerId = `accordion-trigger-${item.id}`;
				const panelId = `accordion-panel-${item.id}`;

				return (
					<div
						key={item.id}
						className={cn(
							styles['accordion__item'],
							open && styles['accordion__item--open'],
							item.disabled && styles['accordion__item--disabled']
						)}
					>
						<h3>
							<button
								id={triggerId}
								type="button"
								data-accordion-trigger
								disabled={item.disabled}
								aria-expanded={open}
								aria-controls={panelId}
								className={styles['accordion__trigger']}
								onClick={() => toggle(item.id)}
								onKeyDown={handleKeyDown}
							>
								<span className={styles['accordion__trigger-label']}>
									{item.title}
								</span>
								<Icon
									icon={ChevronDown}
									size="sm"
									className={styles['accordion__icon']}
								/>
							</button>
						</h3>
						<div
							id={panelId}
							role="region"
							aria-labelledby={triggerId}
							hidden={!open}
							className={cn(
								styles['accordion__panel'],
								open && styles['accordion__panel--open']
							)}
						>
							<div className={styles['accordion__content']}>
								{item.content}
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
};
