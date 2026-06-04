import { useCallback, useState } from 'react';

import type { AccordionType } from './Accordion.types';

type UseAccordionOptions = {
	type: AccordionType;
	defaultValue?: string | string[];
};

type UseAccordionReturn = {
	isOpen: (id: string) => boolean;
	toggle: (id: string) => void;
};

export const useAccordion = ({
	type,
	defaultValue,
}: UseAccordionOptions): UseAccordionReturn => {
	const [openIds, setOpenIds] = useState<Set<string>>(() => {
		if (!defaultValue) return new Set();
		if (typeof defaultValue === 'string') return new Set([defaultValue]);
		return new Set(defaultValue);
	});

	const toggle = useCallback(
		(id: string) => {
			setOpenIds((prev) => {
				const next = new Set(prev);
				if (next.has(id)) {
					next.delete(id);
				} else {
					if (type === 'single') next.clear();
					next.add(id);
				}
				return next;
			});
		},
		[type]
	);

	const isOpen = useCallback((id: string) => openIds.has(id), [openIds]);

	return { isOpen, toggle };
};
