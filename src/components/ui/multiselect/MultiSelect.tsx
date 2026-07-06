import { type MouseEvent, useMemo } from 'react';

import { ChevronDown } from 'lucide-react';

import { Icon } from '@/components/ui/icon';
import { ListboxField, useListboxField } from '@/components/ui/listbox';
import type { SelectOption } from '@/components/ui/select';
import { Tag } from '@/components/ui/tag';
import { cn } from '@/utils/cn';

import styles from './MultiSelect.module.scss';
import { useMultiSelect } from './useMultiSelect';

type MultiSelectProps = {
	id: string;
	label?: string;
	options: SelectOption[];
	value?: string[];
	defaultValue?: string[];
	onChange?: (value: string[]) => void;
	placeholder?: string;
	helperText?: string;
	error?: string;
	disabled?: boolean;
	required?: boolean;
};

const isRemoveButton = (target: EventTarget | null) =>
	target instanceof HTMLElement && Boolean(target.closest('button'));

export const MultiSelect = ({
	id,
	label,
	options,
	value,
	defaultValue,
	onChange,
	placeholder = 'Select options',
	helperText,
	error,
	disabled,
	required,
}: MultiSelectProps) => {
	const { selectedValues, toggleValue, removeValue } = useMultiSelect({
		value,
		defaultValue,
		onChange,
	});

	const selectedValueSet = useMemo(
		() => new Set(selectedValues),
		[selectedValues]
	);

	const selectedOptions = options.filter((option) =>
		selectedValueSet.has(option.value)
	);

	const firstSelectedIndex = options.findIndex((option) =>
		selectedValueSet.has(option.value)
	);

	const {
		isOpen,
		activeIndex,
		containerRef,
		triggerRef,
		close,
		listboxRef,
		mounted,
		placement,
		setActiveIndex,
		style,
		handleTriggerKeyDown,
		handleToggleOpen,
		activeDescendant,
	} = useListboxField<HTMLDivElement>({
		id,
		options,
		disabled,
		initialActiveIndex: firstSelectedIndex >= 0 ? firstSelectedIndex : 0,
		closeOnSelect: false,
		onOptionConfirm: (index) => {
			const option = options[index];
			if (!option || option.disabled) return;
			toggleValue(option.value);
		},
	});

	const handleTriggerClick = (event: MouseEvent<HTMLDivElement>) => {
		if (isRemoveButton(event.target)) return;
		handleToggleOpen();
	};

	const handleOptionSelect = (option: SelectOption) => {
		if (option.disabled) return;
		toggleValue(option.value);
	};

	return (
		<ListboxField
			id={id}
			label={label}
			required={required}
			helperText={helperText}
			error={error}
			containerRef={containerRef}
			controlClassName={styles['multiselect__control']}
			renderTrigger={({ labelId, listboxId, fieldControlProps }) => (
				<div
					ref={triggerRef}
					id={id}
					role="combobox"
					tabIndex={disabled ? -1 : 0}
					aria-haspopup="listbox"
					aria-expanded={isOpen}
					aria-controls={listboxId}
					aria-labelledby={labelId}
					aria-activedescendant={activeDescendant}
					{...fieldControlProps}
					aria-disabled={disabled || undefined}
					className={cn(
						styles['multiselect__trigger'],
						error && styles['multiselect__trigger--error'],
						isOpen && styles['multiselect__trigger--open']
					)}
					onClick={handleTriggerClick}
					onKeyDown={(event) => {
						if (
							!isOpen &&
							event.key === 'Backspace' &&
							selectedValues.length > 0
						) {
							const lastValue = selectedValues[selectedValues.length - 1];
							removeValue(lastValue);
							event.preventDefault();
							return;
						}

						handleTriggerKeyDown(event);
					}}
				>
					<span className={styles['multiselect__values']}>
						{selectedOptions.length === 0 ? (
							<span className={styles['multiselect__placeholder']}>
								{placeholder}
							</span>
						) : (
							selectedOptions.map((option) => (
								<Tag
									key={option.value}
									size="sm"
									onRemove={() => removeValue(option.value)}
									removeLabel={`Remove ${option.label}`}
								>
									{option.label}
								</Tag>
							))
						)}
					</span>

					<Icon
						icon={ChevronDown}
						size="sm"
						className={cn(
							styles['multiselect__chevron'],
							isOpen && styles['multiselect__chevron--open']
						)}
					/>
				</div>
			)}
			listboxProps={{
				options,
				activeIndex,
				listboxRef,
				style,
				placement,
				multi: true,
				isSelected: (optionValue) => selectedValueSet.has(optionValue),
				onSelect: handleOptionSelect,
				onHighlight: setActiveIndex,
				mounted,
				isOpen,
			}}
		/>
	);
};
