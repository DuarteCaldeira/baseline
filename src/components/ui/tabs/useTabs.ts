import { useCallback } from 'react';

import { useControllableState } from '@/hooks/useControllableState';

import type { TabItem } from './Tabs.types';

type UseTabsOptions = {
	items: TabItem[];
	value?: string;
	defaultValue?: string;
	onChange?: (id: string) => void;
};

type UseTabsReturn = {
	activeId: string;
	select: (id: string) => void;
};

const getFirstEnabledId = (items: TabItem[]): string =>
	items.find((item) => !item.disabled)?.id ?? items[0]?.id ?? '';

export const useTabs = ({
	items,
	value,
	defaultValue,
	onChange,
}: UseTabsOptions): UseTabsReturn => {
	const { value: activeId = getFirstEnabledId(items), setValue } =
		useControllableState({
			value,
			defaultValue: defaultValue ?? getFirstEnabledId(items),
			onChange,
		});

	const select = useCallback(
		(id: string) => {
			const item = items.find((tab) => tab.id === id);
			if (!item || item.disabled) return;

			setValue(id);
		},
		[items, setValue]
	);

	return { activeId, select };
};
