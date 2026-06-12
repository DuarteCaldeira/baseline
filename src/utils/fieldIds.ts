export const getLabelId = (fieldId: string) => `${fieldId}-label`;

export const getHelperId = (fieldId: string) => `${fieldId}-helper`;

export const getErrorId = (fieldId: string) => `${fieldId}-error`;

export const getDescribedBy = (ids: Array<string | undefined>) =>
	ids.filter(Boolean).join(' ') || undefined;

export type FieldIdsOptions = {
	helperText?: string;
	error?: string;
};

export type FieldIds = {
	helperId: string | undefined;
	errorId: string | undefined;
	describedBy: string | undefined;
};

export const resolveFieldIds = (
	fieldId: string | undefined,
	{ helperText, error }: FieldIdsOptions = {}
): FieldIds => {
	const helperId =
		fieldId && helperText ? getHelperId(fieldId) : undefined;
	const errorId = fieldId && error ? getErrorId(fieldId) : undefined;
	const describedBy = getDescribedBy([helperId, errorId]);

	return { helperId, errorId, describedBy };
};
