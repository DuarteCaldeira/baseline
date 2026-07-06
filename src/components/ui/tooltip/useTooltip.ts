import { type HTMLAttributes, useCallback, useEffect, useId } from 'react';

import { useDelayedVisibility } from '@/hooks/useDelayedVisibility';

const OPEN_DELAY = 200;
const CLOSE_DELAY = 0;

type TriggerProps = Pick<
	HTMLAttributes<HTMLElement>,
	'onMouseEnter' | 'onMouseLeave' | 'onFocus' | 'onBlur' | 'aria-describedby'
>;

type UseTooltipReturn = {
	isOpen: boolean;
	tooltipId: string;
	getTriggerProps: (existing?: HTMLAttributes<HTMLElement>) => TriggerProps;
};

export const useTooltip = (): UseTooltipReturn => {
	const tooltipId = useId();
	const {
		isVisible: isOpen,
		show,
		hide,
		hideNow,
	} = useDelayedVisibility({
		openDelay: OPEN_DELAY,
		closeDelay: CLOSE_DELAY,
	});

	useEffect(() => {
		if (!isOpen) return;

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				hideNow();
			}
		};

		document.addEventListener('keydown', handleKeyDown);
		return () => document.removeEventListener('keydown', handleKeyDown);
	}, [hideNow, isOpen]);

	const getTriggerProps = useCallback(
		(existing: HTMLAttributes<HTMLElement> = {}): TriggerProps => ({
			onMouseEnter: (event) => {
				existing.onMouseEnter?.(event);
				show();
			},
			onMouseLeave: (event) => {
				existing.onMouseLeave?.(event);
				hide();
			},
			onFocus: (event) => {
				existing.onFocus?.(event);
				show();
			},
			onBlur: (event) => {
				existing.onBlur?.(event);
				hide();
			},
			'aria-describedby': isOpen
				? [existing['aria-describedby'], tooltipId].filter(Boolean).join(' ') ||
					tooltipId
				: existing['aria-describedby'],
		}),
		[hide, isOpen, show, tooltipId]
	);

	return { isOpen, tooltipId, getTriggerProps };
};
