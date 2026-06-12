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
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { cn } from '@/utils/cn';

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

	const helperId = helperText ? `${inputId}-helper` : undefined;
	const errorId = error ? `${inputId}-error` : undefined;
	const describedBy =
		[helperId, errorId].filter(Boolean).join(' ') || undefined;

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
		<Stack gap="2" className={cn(styles.fileupload, className)}>
			{label && (
				<label className={styles['fileupload__label']} htmlFor={inputId}>
					{label}
				</label>
			)}

			<Stack
				gap="2"
				align="center"
				justify="center"
				className={cn(
					styles['fileupload__zone'],
					isDragOver && styles['fileupload__zone--dragover'],
					disabled && styles['fileupload__zone--disabled'],
					error && styles['fileupload__zone--error']
				)}
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}
			>
				<input
					ref={inputRef}
					id={inputId}
					type="file"
					className={styles['fileupload__input']}
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
					className={styles['fileupload__icon']}
				/>
				<span className={styles['fileupload__hint']}>{placeholder}</span>
				{accept && (
					<span className={styles['fileupload__accept']}>{accept}</span>
				)}
			</Stack>

			{selectedFiles.length > 0 && (
				<Stack
					as="ul"
					gap="1"
					className={styles['fileupload__list']}
					aria-live="polite"
				>
					{selectedFiles.map((file, index) => (
						<Stack
							as="li"
							key={`${file.name}-${file.lastModified}`}
							className={styles['fileupload__file']}
						>
							<Stack
								direction="row"
								gap="2"
								align="center"
								className={styles['fileupload__file-inner']}
							>
								<Stack gap="1" className={styles['fileupload__file-info']}>
									<span className={styles['fileupload__file-name']}>
										{file.name}
									</span>
									<span className={styles['fileupload__file-size']}>
										{formatFileSize(file.size)}
									</span>
								</Stack>
								<Button
									type="button"
									variant="ghost"
									size="sm"
									iconOnly
									className={styles['fileupload__remove']}
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

			{helperText && (
				<span id={helperId} className={styles['fileupload__helper']}>
					{helperText}
				</span>
			)}
			{error && (
				<span id={errorId} className={styles['fileupload__error']} role="alert">
					{error}
				</span>
			)}
		</Stack>
	);
};
