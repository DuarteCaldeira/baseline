import { useCallback, useEffect, useRef, useState } from 'react';

type UseDelayedVisibilityOptions = {
	openDelay?: number;
	closeDelay?: number;
};

type UseDelayedVisibilityReturn = {
	isVisible: boolean;
	show: () => void;
	hide: () => void;
	hideNow: () => void;
};

export const useDelayedVisibility = ({
	openDelay = 0,
	closeDelay = 0,
}: UseDelayedVisibilityOptions = {}): UseDelayedVisibilityReturn => {
	const [isVisible, setIsVisible] = useState(false);
	const openTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
		undefined
	);
	const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
		undefined
	);

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
			setIsVisible(true);
		}, openDelay);
	}, [clearTimers, openDelay]);

	const hide = useCallback(() => {
		clearTimers();
		closeTimeoutRef.current = setTimeout(() => {
			setIsVisible(false);
		}, closeDelay);
	}, [clearTimers, closeDelay]);

	const hideNow = useCallback(() => {
		clearTimers();
		setIsVisible(false);
	}, [clearTimers]);

	useEffect(() => clearTimers, [clearTimers]);

	return { isVisible, show, hide, hideNow };
};
