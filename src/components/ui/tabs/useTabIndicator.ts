import {
	type RefObject,
	useCallback,
	useEffect,
	useLayoutEffect,
	useState,
} from 'react';

import { computeTabIndicator } from './useTabIndicator.utils';

type IndicatorStyle = {
	left: number;
	width: number;
};

type UseTabIndicatorOptions = {
	listRef: RefObject<HTMLElement | null>;
	tabRefs: RefObject<Map<string, HTMLButtonElement> | null>;
	activeId: string;
};

export const useTabIndicator = ({
	listRef,
	tabRefs,
	activeId,
}: UseTabIndicatorOptions): IndicatorStyle => {
	const [indicator, setIndicator] = useState<IndicatorStyle>({
		left: 0,
		width: 0,
	});

	const updateIndicator = useCallback(() => {
		const list = listRef.current;
		const tab = tabRefs.current?.get(activeId);

		if (!list || !tab) return;

		const listRect = list.getBoundingClientRect();
		const tabRect = tab.getBoundingClientRect();

		setIndicator(
			computeTabIndicator({
				listLeft: listRect.left,
				listScrollLeft: list.scrollLeft,
				tabLeft: tabRect.left,
				tabWidth: tabRect.width,
			})
		);
	}, [activeId, listRef, tabRefs]);

	useLayoutEffect(() => {
		updateIndicator();
	}, [updateIndicator]);

	useEffect(() => {
		const list = listRef.current;
		if (!list) return;

		const observer = new ResizeObserver(updateIndicator);
		observer.observe(list);

		tabRefs.current?.forEach((tab) => observer.observe(tab));

		window.addEventListener('resize', updateIndicator);

		return () => {
			observer.disconnect();
			window.removeEventListener('resize', updateIndicator);
		};
	}, [activeId, listRef, tabRefs, updateIndicator]);

	return indicator;
};
