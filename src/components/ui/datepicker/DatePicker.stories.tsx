import type { Meta, StoryObj } from '@storybook/react';

import { DatePicker } from './DatePicker';

const meta: Meta<typeof DatePicker> = {
	title: 'UI/DatePicker',
	component: DatePicker,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component:
					'Date field with a popover calendar. Supports controlled and uncontrolled value, min/max bounds, and multiple display formats.\n\n' +
					'**Keyboard — trigger (closed):** `Enter`, `Space`, or `ArrowDown` opens the calendar; `Escape` closes when open.\n\n' +
					'**Keyboard — calendar grid:** arrow keys move by day; `ArrowUp` / `ArrowDown` move by week; `Home` / `End` jump to the start/end of the current week; `PageUp` / `PageDown` change month; `Enter` or `Space` selects the focused day; `Escape` or `Tab` closes the calendar.\n\n' +
					'**Pointer:** click a day to select; use the month navigation buttons for paging.',
			},
		},
	},
	argTypes: {
		format: {
			control: 'select',
			options: ['DD/MM/YYYY', 'DD-MM-YYYY', 'YYYY-MM-DD'],
		},
		label: { control: 'text' },
		placeholder: { control: 'text' },
		helperText: { control: 'text' },
		error: { control: 'text' },
		disabled: { control: 'boolean' },
		value: { control: false },
		defaultValue: { control: false },
		min: { control: false },
		max: { control: false },
	},
	args: {
		id: 'datepicker-story',
		format: 'DD/MM/YYYY',
		disabled: false,
	},
};

export default meta;

type Story = StoryObj<typeof DatePicker>;

export const Default: Story = {
	args: {
		label: 'Data',
		helperText: 'A semana começa à segunda-feira.',
		defaultValue: new Date(2024, 1, 15),
	},
};

export const FormatDDMMYYYY: Story = {
	name: 'Formato — DD/MM/YYYY',
	args: { format: 'DD/MM/YYYY', defaultValue: new Date(2024, 2, 14) },
};

export const FormatDDMMYYYYDash: Story = {
	name: 'Formato — DD-MM-YYYY',
	args: { format: 'DD-MM-YYYY', defaultValue: new Date(2024, 2, 14) },
};

export const FormatYYYYMMDD: Story = {
	name: 'Formato — YYYY-MM-DD',
	args: { format: 'YYYY-MM-DD', defaultValue: new Date(2024, 2, 14) },
};

export const WithLabel: Story = {
	args: {
		label: 'Data de nascimento',
		helperText: 'Tem de ter 18 anos ou mais.',
	},
};

export const WithInitialValue: Story = {
	args: {
		label: 'Data da consulta',
		defaultValue: new Date(2024, 2, 14),
	},
};

export const WithError: Story = {
	args: {
		label: 'Data de nascimento',
		error: 'Selecione uma data válida.',
	},
};

export const WithMinMax: Story = {
	args: {
		label: 'Selecione uma data',
		helperText: 'Entre o dia 10 e o dia 20 do mês atual.',
		min: new Date(new Date().getFullYear(), new Date().getMonth(), 10),
		max: new Date(new Date().getFullYear(), new Date().getMonth(), 20),
	},
};

export const Disabled: Story = {
	args: {
		label: 'Data bloqueada',
		defaultValue: new Date(2024, 2, 14),
		disabled: true,
	},
};
