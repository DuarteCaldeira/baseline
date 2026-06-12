import {
	type ChangeEvent,
	type DragEvent,
	useCallback,
	useId,
	useRef,
	useState,
} from 'react';

import { Upload, X } from 'lucide-react';

import { Stack } from '@/components/layout/stack';
import { FormField } from '@/components/patterns/form-field';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { cn } from '@/utils/cn';
import { resolveFieldIds } from '@/utils/fieldIds';

import styles from './FileUpload.module.scss';
import type { FileUploadProps } from './FileUpload.types';
import {
	assignFilesToInput,
	filesToArray,
	formatFileSize,
} from './FileUpload.utils';

const DEFAULT_PLACEHOLDER = 'Drag files here or click to select';

const defaultRemoveFileLabel = (fileName: string) => `Remove ${fileName}`;

export const FileUpload = ({
	label,
	helperText,
	error,
	placeholder = DEFAULT_PLACEHOLDER,
	getRemoveFileLabel = defaultRemoveFileLabel,
	className,
	id,
	disabled,
	multiple,
	accept,
	onChange,
	...rest
}: FileUploadProps) => {
	const generatedId = useId();
	const inputId = id ?? generatedId;
	const inputRef = useRef<HTMLInputElement>(null);
	const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
	const [isDragOver, setIsDragOver] = useState(false);

	const { describedBy } = resolveFieldIds(inputId, { helperText, error });

	const updateFiles = useCallback(
		(files: File[], options?: { syncInput?: boolean }) => {
			setSelectedFiles(files);

			if (options?.syncInput && inputRef.current) {
				assignFilesToInput(inputRef.current, files);
			}

			onChange?.(files.length > 0 ? (inputRef.current?.files ?? null) : null);
		},
		[onChange]
	);

	const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
		const files = filesToArray(event.target.files);
		setSelectedFiles(files);
		onChange?.(event.target.files);
	};

	const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		if (!disabled) setIsDragOver(true);
	};

	const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		setIsDragOver(false);
	};

	const handleDrop = (event: DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		setIsDragOver(false);

		if (disabled) return;

		const dropped = filesToArray(event.dataTransfer.files);
		if (dropped.length === 0) return;

		updateFiles(multiple ? dropped : dropped.slice(0, 1), { syncInput: true });
	};

	const handleRemove = (index: number) => {
		updateFiles(
			selectedFiles.filter((_, i) => i !== index),
			{ syncInput: true }
		);
	};

	return (
		<div className={cn(styles['file-upload'], className)}>
			<FormField
				fieldId={inputId}
				label={label}
				helperText={helperText}
				error={error}
			>
				<Stack
					gap="2"
					align="center"
					justify="center"
					className={cn(
						styles['file-upload__zone'],
						isDragOver && styles['file-upload__zone--dragover'],
						disabled && styles['file-upload__zone--disabled'],
						error && styles['file-upload__zone--error']
					)}
					onDragOver={handleDragOver}
					onDragLeave={handleDragLeave}
					onDrop={handleDrop}
				>
					<input
						ref={inputRef}
						id={inputId}
						type="file"
						className={styles['file-upload__input']}
						disabled={disabled}
						multiple={multiple}
						accept={accept}
						aria-label={label ? undefined : placeholder}
						aria-invalid={error ? true : undefined}
						aria-describedby={describedBy}
						onChange={handleInputChange}
						{...rest}
					/>
					<Icon
						icon={Upload}
						size="lg"
						variant="subtle"
						className={styles['file-upload__icon']}
					/>
					<span className={styles['file-upload__hint']}>{placeholder}</span>
					{accept && (
						<span className={styles['file-upload__accept']}>{accept}</span>
					)}
				</Stack>

				{selectedFiles.length > 0 && (
					<Stack
						as="ul"
						gap="1"
						className={styles['file-upload__list']}
						aria-live="polite"
					>
						{selectedFiles.map((file, index) => (
							<Stack
								as="li"
								key={`${file.name}-${file.lastModified}`}
								className={styles['file-upload__file']}
							>
								<Stack
									direction="row"
									gap="2"
									align="center"
									className={styles['file-upload__file-inner']}
								>
									<Stack gap="1" className={styles['file-upload__file-info']}>
										<span className={styles['file-upload__file-name']}>
											{file.name}
										</span>
										<span className={styles['file-upload__file-size']}>
											{formatFileSize(file.size)}
										</span>
									</Stack>
									<Button
										type="button"
										variant="ghost"
										size="sm"
										iconOnly
										onClick={() => handleRemove(index)}
										disabled={disabled}
										aria-label={getRemoveFileLabel(file.name)}
									>
										<Icon icon={X} size="sm" />
									</Button>
								</Stack>
							</Stack>
						))}
					</Stack>
				)}
			</FormField>
		</div>
	);
};
