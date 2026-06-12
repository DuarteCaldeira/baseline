export type TabIndicatorRects = {
	listLeft: number;
	listScrollLeft: number;
	tabLeft: number;
	tabWidth: number;
};

export type TabIndicatorStyle = {
	left: number;
	width: number;
};

export const computeTabIndicator = ({
	listLeft,
	listScrollLeft,
	tabLeft,
	tabWidth,
}: TabIndicatorRects): TabIndicatorStyle => ({
	left: tabLeft - listLeft + listScrollLeft,
	width: tabWidth,
});
