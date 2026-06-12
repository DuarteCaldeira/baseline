import {
	type HTMLAttributes,
	useCallback,
	useEffect,
	useId,
	useRef,
	useState,
} from 'react';

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
	const [isOpen, setIsOpen] = useState(false);
	const openTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
	const closeTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

	const clearTimers = useCallback(() => {
		if (openTimeoutRef.current) {
			clearTimeout(openTimeoutRef.current);
			openTimeoutRef.current = undefined;
		}
		if (closeTimeoutRef.current) {
			clearTimeout(closeTimeoutRef.current);
			closeTimeoutRef.current = undefined;
		}
	}, []);

	const show = useCallback(() => {
		clearTimers();
		openTimeoutRef.current = setTimeout(() => {
			setIsOpen(true);
		}, OPEN_DELAY);
	}, [clearTimers]);

	const hide = useCallback(() => {
		clearTimers();
		closeTimeoutRef.current = setTimeout(() => {
			setIsOpen(false);
		}, CLOSE_DELAY);
	}, [clearTimers]);

	useEffect(() => {
		if (!isOpen) return;

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				clearTimers();
				setIsOpen(false);
			}
		};

		document.addEventListener('keydown', handleKeyDown);
		return () => document.removeEventListener('keydown', handleKeyDown);
	}, [clearTimers, isOpen]);

	useEffect(() => clearTimers, [clearTimers]);

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
