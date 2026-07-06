import { ChevronDown } from 'lucide-react';

import { Icon } from '@/components/ui/icon';
import { ListboxField, useListboxField } from '@/components/ui/listbox';
import { cn } from '@/utils/cn';

import styles from './Select.module.scss';
import type { SelectOption } from './Select.types';

type SelectProps = {
	id: string;
	label?: string;
	options: SelectOption[];
	value?: string;
	onChange?: (value: string) => void;
	placeholder?: string;
	helperText?: string;
	error?: string;
	disabled?: boolean;
	required?: boolean;
};

export const Select = ({
	id,
	label,
	options,
	value,
	onChange,
	placeholder = 'Select an option',
	helperText,
	error,
	disabled,
	required,
}: SelectProps) => {
	const selectedIndex = options.findIndex((o) => o.value === value);
	const selectedOption = selectedIndex >= 0 ? options[selectedIndex] : null;

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
	} = useListboxField<HTMLButtonElement>({
		id,
		options,
		disabled,
		initialActiveIndex: selectedIndex >= 0 ? selectedIndex : 0,
	});

	const handleSelect = (option: SelectOption) => {
		if (option.disabled) return;
		onChange?.(option.value);
		close();
	};

	return (
		<ListboxField
			id={id}
			label={label}
			required={required}
			helperText={helperText}
			error={error}
			containerRef={containerRef}
			controlClassName={styles['select__control']}
			renderTrigger={({ labelId, listboxId, fieldControlProps }) => (
				<button
					ref={triggerRef}
					id={id}
					type="button"
					role="combobox"
					aria-haspopup="listbox"
					aria-expanded={isOpen}
					aria-controls={listboxId}
					aria-labelledby={labelId}
					aria-activedescendant={activeDescendant}
					{...fieldControlProps}
					disabled={disabled}
					className={cn(
						styles['select__trigger'],
						error && styles['select__trigger--error'],
						isOpen && styles['select__trigger--open']
					)}
					onClick={handleToggleOpen}
					onKeyDown={handleTriggerKeyDown}
				>
					<span className={styles['select__trigger-value']}>
						{selectedOption ? (
							<>
								{selectedOption.icon && (
									<span
										className={styles['select__trigger-icon']}
										aria-hidden="true"
									>
										<Icon
											icon={selectedOption.icon}
											size="sm"
											variant={selectedOption.iconVariant}
										/>
									</span>
								)}
								<span>{selectedOption.label}</span>
							</>
						) : (
							<span className={styles['select__placeholder']}>
								{placeholder}
							</span>
						)}
					</span>

					<Icon
						icon={ChevronDown}
						size="sm"
						className={cn(
							styles['select__chevron'],
							isOpen && styles['select__chevron--open']
						)}
					/>
				</button>
			)}
			listboxProps={{
				options,
				activeIndex,
				listboxRef,
				style,
				placement,
				isSelected: (optionValue) => optionValue === value,
				onSelect: handleSelect,
				onHighlight: setActiveIndex,
				mounted,
				isOpen,
			}}
		/>
	);
};
