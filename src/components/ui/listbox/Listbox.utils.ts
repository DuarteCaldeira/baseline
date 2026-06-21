export const getListboxId = (id: string) => `${id}-listbox`;

export const getOptionId = (id: string, value: string) =>
	`${id}-option-${value}`;

export const scrollOptionIntoView = (optionId: string) => {
	document.getElementById(optionId)?.scrollIntoView({ block: 'nearest' });
};
