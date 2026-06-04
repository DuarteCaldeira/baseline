import type { InputHTMLAttributes } from 'react';

export type FileUploadProps = Omit<
	InputHTMLAttributes<HTMLInputElement>,
	'type' | 'value' | 'onChange'
> & {
	label?: string;
	helperText?: string;
	error?: string;
	/** Drop zone hint. Defaults to a generic Portuguese message. */
	placeholder?: string;
	onChange?: (files: FileList | null) => void;
};
