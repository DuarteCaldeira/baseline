import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { FileUpload } from './FileUpload';

const createFile = (name: string, size = 12) =>
	new File(['x'.repeat(size)], name, { type: 'text/plain' });

describe('FileUpload', () => {
	it('renders a file input', () => {
		render(<FileUpload id="file" />);
		expect(screen.getByLabelText(/arraste ficheiros/i)).toBeInTheDocument();
	});

	it('renders label text when label prop is provided', () => {
		render(<FileUpload id="file" label="Anexo" />);
		expect(screen.getByText('Anexo')).toBeInTheDocument();
	});

	it('associates label with input via htmlFor and id', () => {
		render(<FileUpload id="file" label="Anexo" />);
		expect(screen.getByLabelText('Anexo')).toBeInTheDocument();
	});

	it('shows the default placeholder', () => {
		render(<FileUpload id="file" />);
		expect(
			screen.getByText('Arraste ficheiros aqui ou clique para selecionar')
		).toBeInTheDocument();
	});

	it('shows a custom placeholder', () => {
		render(<FileUpload id="file" placeholder="Escolha um PDF" />);
		expect(screen.getByText('Escolha um PDF')).toBeInTheDocument();
	});

	it('calls onChange with selected files', async () => {
		const handleChange = vi.fn();
		render(<FileUpload id="file" onChange={handleChange} />);

		const input = screen.getByLabelText(/arraste ficheiros/i);
		const file = createFile('documento.pdf');
		await userEvent.upload(input, file);

		expect(handleChange).toHaveBeenCalled();
		expect(handleChange.mock.calls.at(-1)?.[0]?.[0].name).toBe('documento.pdf');
	});

	it('shows selected file name and size', async () => {
		render(<FileUpload id="file" />);

		const input = screen.getByLabelText(/arraste ficheiros/i);
		await userEvent.upload(input, createFile('foto.png', 2048));

		expect(screen.getByText('foto.png')).toBeInTheDocument();
		expect(screen.getByText('2.0 KB')).toBeInTheDocument();
	});

	it('removes a selected file when remove is clicked', async () => {
		render(<FileUpload id="file" />);

		const input = screen.getByLabelText(/arraste ficheiros/i);
		await userEvent.upload(input, createFile('foto.png'));

		await userEvent.click(
			screen.getByRole('button', { name: 'Remover foto.png' })
		);

		expect(screen.queryByText('foto.png')).not.toBeInTheDocument();
	});

	it('applies disabled state', () => {
		render(<FileUpload id="file" disabled />);
		expect(screen.getByLabelText(/arraste ficheiros/i)).toBeDisabled();
	});

	it('renders helper text', () => {
		render(<FileUpload id="file" helperText="Apenas ficheiros PDF." />);
		expect(screen.getByText('Apenas ficheiros PDF.')).toBeInTheDocument();
	});

	it('renders error message with role="alert"', () => {
		render(<FileUpload id="file" error="O ficheiro é obrigatório." />);
		expect(screen.getByRole('alert')).toHaveTextContent(
			'O ficheiro é obrigatório.'
		);
	});

	it('sets aria-invalid when error is provided', () => {
		render(<FileUpload id="file" error="Obrigatório" />);
		expect(screen.getByLabelText(/arraste ficheiros/i)).toHaveAttribute(
			'aria-invalid',
			'true'
		);
	});

	it('sets aria-describedby linking helper and error ids', () => {
		render(
			<FileUpload
				id="file"
				helperText="Máximo 5 MB."
				error="O ficheiro é obrigatório."
			/>
		);

		expect(screen.getByLabelText(/arraste ficheiros/i)).toHaveAttribute(
			'aria-describedby',
			'file-helper file-error'
		);
	});

	it('shows accepted file types when accept is provided', () => {
		render(<FileUpload id="file" accept=".pdf,.png" />);
		expect(screen.getByText('.pdf,.png')).toBeInTheDocument();
	});

	it('applies error modifier class when error is provided', () => {
		const { container } = render(<FileUpload id="file" error="Obrigatório" />);
		expect(container.querySelector('.fileupload__zone--error')).toBeInTheDocument();
	});
});
