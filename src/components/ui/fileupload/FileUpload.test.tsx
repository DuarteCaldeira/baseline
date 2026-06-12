import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { FileUpload } from './FileUpload';

const createFile = (name: string, size = 12) =>
	new File(['x'.repeat(size)], name, { type: 'text/plain' });

describe('FileUpload', () => {
	it('renders a file input', () => {
		render(<FileUpload id="file" />);
		expect(screen.getByLabelText(/drag files here/i)).toBeInTheDocument();
	});

	it('renders label text when label prop is provided', () => {
		render(<FileUpload id="file" label="Attachment" />);
		expect(screen.getByText('Attachment')).toBeInTheDocument();
	});

	it('associates label with input via htmlFor and id', () => {
		render(<FileUpload id="file" label="Attachment" />);
		expect(screen.getByLabelText('Attachment')).toBeInTheDocument();
	});

	it('shows the default placeholder', () => {
		render(<FileUpload id="file" />);
		expect(
			screen.getByText('Drag files here or click to select')
		).toBeInTheDocument();
	});

	it('shows a custom placeholder', () => {
		render(<FileUpload id="file" placeholder="Choose a PDF" />);
		expect(screen.getByText('Choose a PDF')).toBeInTheDocument();
	});

	it('calls onChange with selected files', async () => {
		const handleChange = vi.fn();
		render(<FileUpload id="file" onChange={handleChange} />);

		const input = screen.getByLabelText(/drag files here/i);
		const file = createFile('document.pdf');
		await userEvent.upload(input, file);

		expect(handleChange).toHaveBeenCalled();
		expect(handleChange.mock.calls.at(-1)?.[0]?.[0].name).toBe('document.pdf');
	});

	it('shows selected file name and size', async () => {
		render(<FileUpload id="file" />);

		const input = screen.getByLabelText(/drag files here/i);
		await userEvent.upload(input, createFile('photo.png', 2048));

		expect(screen.getByText('photo.png')).toBeInTheDocument();
		expect(screen.getByText('2.0 KB')).toBeInTheDocument();
	});

	it('removes a selected file when remove is clicked', async () => {
		render(<FileUpload id="file" />);

		const input = screen.getByLabelText(/drag files here/i);
		await userEvent.upload(input, createFile('photo.png'));

		await userEvent.click(
			screen.getByRole('button', { name: 'Remove photo.png' })
		);

		expect(screen.queryByText('photo.png')).not.toBeInTheDocument();
	});

	it('uses a custom remove file label', async () => {
		render(
			<FileUpload
				id="file"
				getRemoveFileLabel={(name) => `Delete ${name}`}
			/>
		);

		const input = screen.getByLabelText(/drag files here/i);
		await userEvent.upload(input, createFile('photo.png'));

		expect(
			screen.getByRole('button', { name: 'Delete photo.png' })
		).toBeInTheDocument();
	});

	it('applies disabled state', () => {
		render(<FileUpload id="file" disabled />);
		expect(screen.getByLabelText(/drag files here/i)).toBeDisabled();
	});

	it('renders helper text', () => {
		render(<FileUpload id="file" helperText="PDF files only." />);
		expect(screen.getByText('PDF files only.')).toBeInTheDocument();
	});

	it('renders error message with role="alert"', () => {
		render(<FileUpload id="file" error="A file is required." />);
		expect(screen.getByRole('alert')).toHaveTextContent('A file is required.');
	});

	it('sets aria-invalid when error is provided', () => {
		render(<FileUpload id="file" error="Required" />);
		expect(screen.getByLabelText(/drag files here/i)).toHaveAttribute(
			'aria-invalid',
			'true'
		);
	});

	it('sets aria-describedby linking helper and error ids', () => {
		render(
			<FileUpload
				id="file"
				helperText="Maximum 5 MB."
				error="A file is required."
			/>
		);

		expect(screen.getByLabelText(/drag files here/i)).toHaveAttribute(
			'aria-describedby',
			'file-helper file-error'
		);
	});

	it('shows accepted file types when accept is provided', () => {
		render(<FileUpload id="file" accept=".pdf,.png" />);
		expect(screen.getByText('.pdf,.png')).toBeInTheDocument();
	});

	it('applies error modifier class when error is provided', () => {
		const { container } = render(<FileUpload id="file" error="Required" />);
		expect(
			container.querySelector('.fileupload__zone--error')
		).toBeInTheDocument();
	});
});
