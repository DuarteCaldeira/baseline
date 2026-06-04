import { useSelect } from './useSelect';
import { Stack } from '@/components/layout/stack';
import { cn } from '@/utils/cn';

import type { SelectOption } from './Select.types';
import {
	getErrorId,
	getLabelId,
	getListboxId,
	getOptionId,
	getTriggerId,
	scrollOptionIntoView,
} from './Select.utils';
import styles from './Select.module.scss';

export type SelectProps = {
	id: string;
	label?: string;
	options: SelectOption[];
	value?: string;
	onChange?: (value: string) => void;
	placeholder?: string;
	error?: string;
	disabled?: boolean;
	className?: string;
};

export const Select = ({
	id,
	label,
	options,
	value,
	onChange,
	placeholder = 'Select an option',
	error,
	disabled,
	className,
}: SelectProps) => {
	const selectedIndex = options.findIndex((o) => o.value === value);
	const selectedOption = selectedIndex >= 0 ? options[selectedIndex] : null;

	const { isOpen, activeIndex, containerRef, triggerRef, open, close, setActiveIndex, handleTriggerKeyDown } =
		useSelect({
			optionsCount: options.length,
			isDisabled: disabled,
			initialActiveIndex: selectedIndex >= 0 ? selectedIndex : 0,
			onScrollIntoView: (index) =>
				scrollOptionIntoView(getOptionId(id, options[index].value)),
		});

	const handleSelect = (option: SelectOption) => {
		if (option.disabled) return;
		onChange?.(option.value);
		close();
	};

	const triggerId = getTriggerId(id);
	const labelId = getLabelId(id);
	const listboxId = getListboxId(id);
	const errorId = error ? getErrorId(id) : undefined;

	return (
		<Stack
			ref={containerRef}
			gap="1"
			className={cn(styles['select__wrapper'], className)}
		>
			{label && (
				<label id={labelId} className={styles['select__label']} htmlFor={triggerId}>
					{label}
				</label>
			)}

			<button
				ref={triggerRef}
				id={triggerId}
				type="button"
				role="combobox"
				aria-haspopup="listbox"
				aria-expanded={isOpen}
				aria-controls={listboxId}
				aria-labelledby={label ? labelId : undefined}
				aria-activedescendant={
					isOpen ? getOptionId(id, options[activeIndex]?.value ?? '') : undefined
				}
				aria-invalid={error ? true : undefined}
				aria-describedby={errorId}
				disabled={disabled}
				className={cn(
					styles['select__trigger'],
					error && styles['select__trigger--error'],
					isOpen && styles['select__trigger--open']
				)}
				onClick={() => (isOpen ? close() : open(selectedIndex >= 0 ? selectedIndex : 0))}
				onKeyDown={handleTriggerKeyDown}
			>
				<span className={styles['select__trigger-value']}>
					{selectedOption ? (
						<>
							{selectedOption.icon && (
								<span className={styles['select__trigger-icon']} aria-hidden="true">
									{selectedOption.icon}
								</span>
							)}
							<span>{selectedOption.label}</span>
						</>
					) : (
						<span className={styles['select__placeholder']}>{placeholder}</span>
					)}
				</span>

				<svg
					className={cn(
						styles['select__chevron'],
						isOpen && styles['select__chevron--open']
					)}
					aria-hidden="true"
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<path d="M6 9l6 6 6-6" />
				</svg>
			</button>

			{isOpen && (
				<ul
					id={listboxId}
					role="listbox"
					aria-labelledby={label ? labelId : undefined}
					className={styles['select__listbox']}
				>
					{options.map((option, index) => (
						<li
							key={option.value}
							id={getOptionId(id, option.value)}
							role="option"
							aria-selected={option.value === value}
							aria-disabled={option.disabled}
							className={cn(
								styles['select__option'],
								option.value === value && styles['select__option--selected'],
								index === activeIndex && styles['select__option--active'],
								option.disabled && styles['select__option--disabled']
							)}
							// Prevent trigger blur before onClick fires
							onPointerDown={(e) => e.preventDefault()}
							onClick={() => handleSelect(option)}
							onMouseEnter={() => !option.disabled && setActiveIndex(index)}
						>
							{option.icon && (
								<span className={styles['select__option-icon']} aria-hidden="true">
									{option.icon}
								</span>
							)}
							<span className={styles['select__option-content']}>
								<span className={styles['select__option-label']}>{option.label}</span>
								{option.description && (
									<span className={styles['select__option-description']}>
										{option.description}
									</span>
								)}
							</span>
							{option.value === value && (
								<svg
									className={styles['select__option-check']}
									aria-hidden="true"
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2.5"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path d="M20 6L9 17l-5-5" />
								</svg>
							)}
						</li>
					))}
				</ul>
			)}

			{error && (
				<span id={errorId} className={styles['select__error']} role="alert">
					{error}
				</span>
			)}
		</Stack>
	);
};
