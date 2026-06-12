import { useId } from 'react';

import { useMenuContext } from '../MenuContext';

type UseMenuItemHighlightOptions = {
	keepSubmenuMenuId?: string;
	isSubmenuTrigger?: boolean;
};

export const useMenuItemHighlight = (
	disabled?: boolean,
	options?: UseMenuItemHighlightOptions
) => {
	const itemId = useId();
	const {
		inContent,
		highlightedId,
		setHighlightedId,
		closePeerSubmenus,
		hasPeerSubmenus,
	} = useMenuContext();

	const isHighlighted = inContent && highlightedId === itemId;

	const setHighlight = () => {
		if (disabled || !inContent) return;
		if (options?.isSubmenuTrigger === true || hasPeerSubmenus()) {
			closePeerSubmenus(options?.keepSubmenuMenuId ?? null);
		}
		setHighlightedId(itemId);
	};

	const clearHighlight = () => {
		if (highlightedId === itemId) setHighlightedId(null);
	};

	const canHighlight = inContent && !disabled;

	return {
		highlightData: isHighlighted ? ('true' as const) : undefined,
		onMouseEnter: canHighlight ? setHighlight : undefined,
		onMouseLeave: canHighlight ? clearHighlight : undefined,
	};
};
