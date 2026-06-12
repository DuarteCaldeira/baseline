import type { InputHTMLAttributes } from 'react';

export type FileUploadProps = Omit<
	InputHTMLAttributes<HTMLInputElement>,
	'type' | 'value' | 'onChange'
> & {
	label?: string;
	helperText?: string;
	error?: string;
	/** Drop zone hint. Defaults to a generic English message. */
	placeholder?: string;
	/** Builds the aria-label for a file remove button. Default: `Remove ${fileName}`. */
	getRemoveFileLabel?: (fileName: string) => string;
	onChange?: (files: FileList | null) => void;
};
