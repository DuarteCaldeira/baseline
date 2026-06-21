export const OPTIONAL_FIELD_LABEL = '(opcional)';

export const isOptionalFieldLabel = (
	label: string | undefined,
	required?: boolean
): boolean => Boolean(label) && !required;
