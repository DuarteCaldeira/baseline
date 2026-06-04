import { useCallback, useRef } from 'react';
import type { KeyboardEvent } from 'react';

import { Stack } from '@/components/layout/stack';
import { cn } from '@/utils/cn';

import type { TabItem } from './Tabs.types';
import { useTabIndicator } from './useTabIndicator';
import { useTabs } from './useTabs';
import styles from './Tabs.module.scss';

export type TabsProps = {
	items: TabItem[];
	value?: string;
	defaultValue?: string;
	onChange?: (id: string) => void;
	className?: string;
};

export const Tabs = ({
	items,
	value,
	defaultValue,
	onChange,
	className,
}: TabsProps) => {
	const listRef = useRef<HTMLDivElement>(null);
	const tabRefs = useRef(new Map<string, HTMLButtonElement>());

	const { activeId, select } = useTabs({ items, value, defaultValue, onChange });

	const indicator = useTabIndicator({ listRef, tabRefs, activeId });

	const setTabRef = useCallback(
		(id: string) => (element: HTMLButtonElement | null) => {
			if (element) {
				tabRefs.current.set(id, element);
			} else {
				tabRefs.current.delete(id);
			}
		},
		[]
	);

	const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
		const enabledTabs = items.filter((item) => !item.disabled);
		const currentIndex = enabledTabs.findIndex((item) => item.id === activeId);
		let nextIndex: number | null = null;

		switch (event.key) {
			case 'ArrowRight':
				event.preventDefault();
				nextIndex = (currentIndex + 1) % enabledTabs.length;
				break;
			case 'ArrowLeft':
				event.preventDefault();
				nextIndex =
					(currentIndex - 1 + enabledTabs.length) % enabledTabs.length;
				break;
			case 'Home':
				event.preventDefault();
				nextIndex = 0;
				break;
			case 'End':
				event.preventDefault();
				nextIndex = enabledTabs.length - 1;
				break;
		}

		if (nextIndex === null) return;

		const nextTab = enabledTabs[nextIndex];
		select(nextTab.id);
		tabRefs.current.get(nextTab.id)?.focus();
	};

	return (
		<div className={cn(styles.tabs, className)}>
			<div ref={listRef} className={styles['tabs__list']}>
				<Stack direction="row" gap="1" role="tablist" aria-orientation="horizontal">
					{items.map((item) => {
						const selected = item.id === activeId;
						const tabId = `tab-${item.id}`;
						const panelId = `tabpanel-${item.id}`;

						return (
							<button
								key={item.id}
								ref={setTabRef(item.id)}
								type="button"
								role="tab"
								id={tabId}
								aria-selected={selected}
								aria-controls={panelId}
								tabIndex={selected ? 0 : -1}
								disabled={item.disabled}
								className={cn(
									styles['tabs__tab'],
									selected && styles['tabs__tab--selected']
								)}
								onClick={() => select(item.id)}
								onKeyDown={handleKeyDown}
							>
								{item.label}
							</button>
						);
					})}
				</Stack>
				<span
					className={styles['tabs__indicator']}
					aria-hidden="true"
					style={{
						transform: `translateX(${indicator.left}px)`,
						width: indicator.width,
					}}
				/>
			</div>

			{items.map((item) => {
				const selected = item.id === activeId;
				const tabId = `tab-${item.id}`;
				const panelId = `tabpanel-${item.id}`;

				return (
					<div
						key={item.id}
						role="tabpanel"
						id={panelId}
						aria-labelledby={tabId}
						hidden={!selected}
						className={styles['tabs__panel']}
					>
						{item.content}
					</div>
				);
			})}
		</div>
	);
};
