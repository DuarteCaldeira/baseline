import { memo } from 'react';

import { ChevronDown } from 'lucide-react';

import { Stack } from '@/components/layout/stack';
import { Icon } from '@/components/ui/icon';
import { cn } from '@/utils/cn';

import styles from './Accordion.module.scss';
import type { AccordionItemProps } from './Accordion.types';

export const AccordionItem = memo(
	({ item, open, onToggle, onKeyDown }: AccordionItemProps) => {
		const triggerId = `accordion-trigger-${item.id}`;
		const panelId = `accordion-panel-${item.id}`;

		return (
			<div
				className={cn(
					styles['accordion__item'],
					open && styles['accordion__item--open'],
					item.disabled && styles['accordion__item--disabled']
				)}
			>
				<Stack
					direction="row"
					align="stretch"
					gap="none"
					width="full"
					className={styles['accordion__header']}
				>
					<h3 className={styles['accordion__heading']}>
						<button
							id={triggerId}
							type="button"
							data-accordion-trigger
							disabled={item.disabled}
							aria-expanded={open}
							aria-controls={panelId}
							className={styles['accordion__trigger']}
							onClick={() => onToggle(item.id)}
							onKeyDown={onKeyDown}
						>
							<Stack
								direction="row"
								align="center"
								justify="between"
								gap="md"
								padding={{ y: 'xl', x: 'lg' }}
								width="full"
							>
								<Stack
									direction="row"
									align="center"
									gap="sm"
									width="auto"
									className={styles['accordion__trigger-label']}
								>
									{item.header}
								</Stack>
								<Icon
									icon={ChevronDown}
									size="sm"
									className={styles['accordion__icon']}
								/>
							</Stack>
						</button>
					</h3>
					{item.actions ? (
						<Stack
							direction="row"
							align="center"
							gap="xs"
							padding={{ x: 'sm' }}
							width="auto"
							className={styles['accordion__actions']}
						>
							{item.actions}
						</Stack>
					) : null}
				</Stack>
				<div
					id={panelId}
					role="region"
					aria-labelledby={triggerId}
					aria-hidden={!open}
					className={cn(
						styles['accordion__panel'],
						open && styles['accordion__panel--open']
					)}
				>
					<Stack
						padding={{ x: 'lg' }}
						width="full"
						className={styles['accordion__content']}
					>
						{item.content}
					</Stack>
				</div>
			</div>
		);
	}
);

AccordionItem.displayName = 'AccordionItem';
