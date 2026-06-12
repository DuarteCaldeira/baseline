import { Check, ChevronDown } from 'lucide-react';
import { useRef } from 'react';
import { createPortal } from 'react-dom';

import { Stack } from '@/components/layout/stack';
import { Icon } from '@/components/ui/icon';
import { useFloatingPosition } from '@/hooks/useFloatingPosition';
import { useMounted } from '@/hooks/useMounted';
import { cn } from '@/utils/cn';

import type { SelectOption } from './Select.types';
import {
	getErrorId,
	getHelperId,
	getLabelId,
	getListboxId,
	getOptionId,
	getTriggerId,
	getDescribedBy,
	scrollOptionIntoView,
} from './Select.utils';
import styles from './Select.module.scss';
import { useSelect } from './useSelect';

export type SelectProps = {
	id: string;
	label?: string;
	options: SelectOption[];
	value?: string;
	onChange?: (value: string) => void;
	placeholder?: string;
	helperText?: string;
	error?: string;
	disabled?: boolean;
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
}: SelectProps) => {
	const listboxRef = useRef<HTMLUListElement>(null);
	const mounted = useMounted();
	const selectedIndex = options.findIndex((o) => o.value === value);
	const selectedOption = selectedIndex >= 0 ? options[selectedIndex] : null;

	const { isOpen, activeIndex, containerRef, triggerRef, open, close, setActiveIndex, handleTriggerKeyDown } =
		useSelect({
			optionsCount: options.length,
			isDisabled: disabled,
			initialActiveIndex: selectedIndex >= 0 ? selectedIndex : 0,
			overlayRef: listboxRef,
			onScrollIntoView: (index) =>
				scrollOptionIntoView(getOptionId(id, options[index].value)),
		});

	const { style, placement } = useFloatingPosition({
		isOpen,
		triggerRef,
		floatingRef: listboxRef,
		matchTriggerWidth: true,
		maxHeightLimit: 240,
	});

	const handleSelect = (option: SelectOption) => {
		if (option.disabled) return;
		onChange?.(option.value);
		close();
	};

	const handleToggleOpen = () => {
		if (disabled) return;

		if (isOpen) {
			close();
			return;
		}

		open(selectedIndex >= 0 ? selectedIndex : 0);
	};

	const triggerId = getTriggerId(id);
	const labelId = getLabelId(id);
	const listboxId = getListboxId(id);
	const helperId = helperText ? getHelperId(id) : undefined;
	const errorId = error ? getErrorId(id) : undefined;
	const describedBy = getDescribedBy([helperId, errorId]);

	return (
		<Stack
			ref={containerRef}
			gap="2"
			className={styles['select__wrapper']}
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
				aria-describedby={describedBy}
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
						<span className={styles['select__placeholder']}>{placeholder}</span>
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

			{mounted &&
				isOpen &&
				createPortal(
					<ul
						ref={listboxRef}
						id={listboxId}
						role="listbox"
						aria-labelledby={label ? labelId : undefined}
						style={style}
						className={cn(
							styles['select__listbox'],
							styles[`select__listbox--placement-${placement}`]
						)}
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
								onPointerDown={(e) => e.preventDefault()}
								onClick={() => handleSelect(option)}
								onMouseEnter={() => !option.disabled && setActiveIndex(index)}
							>
								{option.icon && (
									<span
										className={styles['select__option-icon']}
										aria-hidden="true"
									>
										<Icon
											icon={option.icon}
											size="sm"
											variant={option.iconVariant}
										/>
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
									<Icon
										icon={Check}
										size="sm"
										className={styles['select__option-check']}
									/>
								)}
							</li>
						))}
					</ul>,
					document.body
				)}

			{helperText && (
				<span id={helperId} className={styles['select__helper']}>
					{helperText}
				</span>
			)}

			{error && (
				<span id={errorId} className={styles['select__error']} role="alert">
					{error}
				</span>
			)}
		</Stack>
	);
};
