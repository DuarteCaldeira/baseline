export const formatFileSize = (bytes: number): string => {
	if (bytes === 0) return '0 B';

	const units = ['B', 'KB', 'MB', 'GB'] as const;
	const unitIndex = Math.min(
		Math.floor(Math.log(bytes) / Math.log(1024)),
		units.length - 1
	);
	const size = bytes / 1024 ** unitIndex;

	return `${unitIndex === 0 ? size : size.toFixed(1)} ${units[unitIndex]}`;
};

export const filesToArray = (files: FileList | null): File[] =>
	files ? Array.from(files) : [];

export const assignFilesToInput = (
	input: HTMLInputElement,
	files: File[]
): void => {
	if (files.length === 0) {
		input.value = '';
		return;
	}

	if (typeof DataTransfer === 'undefined') return;

	try {
		const dataTransfer = new DataTransfer();
		files.forEach((file) => dataTransfer.items.add(file));
		input.files = dataTransfer.files;
	} catch {
		// jsdom and some environments cannot assign files programmatically
	}
};
