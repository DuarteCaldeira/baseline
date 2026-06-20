const STYLE_ID = 'table-test-viewport-styles';

const getStyleElement = (): HTMLStyleElement => {
	const existing = document.getElementById(STYLE_ID);
	if (existing instanceof HTMLStyleElement) return existing;

	const style = document.createElement('style');
	style.id = STYLE_ID;
	document.head.appendChild(style);
	return style;
};

/** Mirrors the default desktop table layout in jsdom (CSS media queries are not evaluated). */
export const setTableDesktopViewport = (): void => {
	getStyleElement().textContent = `
		.table__mobile { display: none !important; }
		.table__grid { display: table !important; }
	`;
};

/** Mirrors the mobile card layout in jsdom for responsive table tests. */
export const setTableMobileViewport = (): void => {
	getStyleElement().textContent = `
		.table__grid { display: none !important; }
		.table__mobile { display: flex !important; flex-direction: column; }
	`;
};
