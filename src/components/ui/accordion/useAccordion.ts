import { useCallback, useState } from 'react';

import type { AccordionType } from './Accordion.types';

type UseAccordionOptions = {
	type: AccordionType;
	value?: string | string[];
	defaultValue?: string | string[];
	onChange?: (value: string | string[]) => void;
};

type UseAccordionReturn = {
	isOpen: (id: string) => boolean;
	toggle: (id: string) => void;
};

const toOpenIds = (value: string | string[] | undefined): Set<string> => {
	if (!value) return new Set();
	if (typeof value === 'string') return value ? new Set([value]) : new Set();
	return new Set(value);
};

const fromOpenIds = (ids: Set<string>, type: AccordionType): string | string[] => {
	if (type === 'single') return [...ids][0] ?? '';
	return [...ids];
};

export const useAccordion = ({
	type,
	value,
	defaultValue,
	onChange,
}: UseAccordionOptions): UseAccordionReturn => {
	const [internalOpenIds, setInternalOpenIds] = useState<Set<string>>(() =>
		toOpenIds(defaultValue)
	);

	const openIds = value !== undefined ? toOpenIds(value) : internalOpenIds;

	const toggle = useCallback(
		(id: string) => {
			const next = new Set(openIds);

			if (next.has(id)) {
				next.delete(id);
			} else {
				if (type === 'single') next.clear();
				next.add(id);
			}

			if (value === undefined) {
				setInternalOpenIds(next);
			}

			onChange?.(fromOpenIds(next, type));
		},
		[openIds, type, value, onChange]
	);

	const isOpen = useCallback((id: string) => openIds.has(id), [openIds]);

	return { isOpen, toggle };
};
