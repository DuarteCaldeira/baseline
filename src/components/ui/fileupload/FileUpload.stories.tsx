import type { Meta, StoryObj } from '@storybook/react';

import { FileUpload } from './FileUpload';

const meta: Meta<typeof FileUpload> = {
	title: 'UI/FileUpload',
	component: FileUpload,
	tags: ['autodocs'],
	argTypes: {
		label: { control: 'text' },
		placeholder: { control: 'text' },
		helperText: { control: 'text' },
		error: { control: 'text' },
		accept: { control: 'text' },
		disabled: { control: 'boolean' },
		multiple: { control: 'boolean' },
	},
	args: {
		id: 'fileupload-story',
		label: 'Ficheiro',
		disabled: false,
		multiple: false,
	},
};

export default meta;

type Story = StoryObj<typeof FileUpload>;

export const Default: Story = {};

export const Multiple: Story = {
	args: {
		multiple: true,
		helperText: 'Pode selecionar vários ficheiros.',
	},
};

export const WithAccept: Story = {
	args: {
		accept: '.pdf,.png,.jpg',
		helperText: 'Apenas PDF e imagens.',
	},
};

export const WithHelperText: Story = {
	args: {
		helperText: 'Tamanho máximo: 5 MB.',
	},
};

export const WithError: Story = {
	args: {
		error: 'Selecione um ficheiro.',
	},
};

export const Disabled: Story = {
	args: {
		disabled: true,
	},
};

export const CustomPlaceholder: Story = {
	args: {
		placeholder: 'Clique para escolher um documento',
	},
};

export const AllStates: Story = {
	render: () => (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				gap: '1.5rem',
				maxWidth: '28rem',
			}}
		>
			<FileUpload id="fu-1" label="Predefinido" />
			<FileUpload
				id="fu-2"
				label="Com ajuda"
				helperText="Formatos aceites: PDF, PNG, JPG."
				accept=".pdf,.png,.jpg"
			/>
			<FileUpload id="fu-3" label="Erro" error="O ficheiro é obrigatório." />
			<FileUpload id="fu-4" label="Desativado" disabled />
		</div>
	),
};
