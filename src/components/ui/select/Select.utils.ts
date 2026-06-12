export const getTriggerId = (id: string) => id;
export const getLabelId = (id: string) => `${id}-label`;
export const getListboxId = (id: string) => `${id}-listbox`;
export const getOptionId = (id: string, value: string) =>
	`${id}-option-${value}`;
export const getHelperId = (id: string) => `${id}-helper`;
export const getErrorId = (id: string) => `${id}-error`;

export const getDescribedBy = (ids: Array<string | undefined>) =>
	ids.filter(Boolean).join(' ') || undefined;

export const scrollOptionIntoView = (optionId: string) => {
	const el = document.getElementById(optionId);
	el?.scrollIntoView({ block: 'nearest' });
};
