import { useCallback, useState } from 'react';

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
	const [internalId, setInternalId] = useState(
		() => defaultValue ?? getFirstEnabledId(items)
	);

	const activeId = value ?? internalId;

	const select = useCallback(
		(id: string) => {
			const item = items.find((tab) => tab.id === id);
			if (!item || item.disabled) return;

			if (value === undefined) {
				setInternalId(id);
			}
			onChange?.(id);
		},
		[items, value, onChange]
	);

	return { activeId, select };
};
