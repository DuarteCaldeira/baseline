import { useRef } from 'react';
import type { CSSProperties, RefObject } from 'react';

import { useFloatingPosition } from '@/hooks/useFloatingPosition';
import { useMounted } from '@/hooks/useMounted';
import type { FloatingPlacement } from '@/utils/floatingPosition';

import type { SelectOption } from '../select';
import { useSelect } from '../select/useSelect';
import { getOptionId, scrollOptionIntoView } from './Listbox.utils';

type UseListboxFieldOptions = {
	id: string;
	options: SelectOption[];
	initialActiveIndex: number;
	disabled?: boolean;
	closeOnSelect?: boolean;
	onOptionConfirm?: (index: number) => void;
};

type UseListboxFieldReturn<T extends HTMLElement> = ReturnType<
	typeof useSelect<T>
> & {
	listboxRef: RefObject<HTMLUListElement | null>;
	mounted: boolean;
	style: CSSProperties;
	placement: FloatingPlacement;
	handleToggleOpen: () => void;
	activeDescendant: string | undefined;
};

export const useListboxField = <T extends HTMLElement>({
	id,
	options,
	initialActiveIndex,
	disabled,
	closeOnSelect = true,
	onOptionConfirm,
}: UseListboxFieldOptions): UseListboxFieldReturn<T> => {
	const listboxRef = useRef<HTMLUListElement>(null);
	const mounted = useMounted();

	const select = useSelect<T>({
		optionsCount: options.length,
		isDisabled: disabled,
		initialActiveIndex,
		closeOnSelect,
		onOptionConfirm,
		overlayRef: listboxRef,
		onScrollIntoView: (index) =>
			scrollOptionIntoView(getOptionId(id, options[index].value)),
	});

	const { style, placement } = useFloatingPosition({
		isOpen: select.isOpen,
		triggerRef: select.triggerRef,
		floatingRef: listboxRef,
		matchTriggerWidth: true,
		maxHeightLimit: 240,
	});

	const handleToggleOpen = () => {
		if (disabled) return;

		if (select.isOpen) {
			select.close();
			return;
		}

		select.open(initialActiveIndex);
	};

	return {
		...select,
		listboxRef,
		mounted,
		style,
		placement,
		handleToggleOpen,
		activeDescendant: select.isOpen
			? getOptionId(id, options[select.activeIndex]?.value ?? '')
			: undefined,
	};
};
