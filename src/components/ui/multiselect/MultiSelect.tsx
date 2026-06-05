import type { MouseEvent, RefObject } from 'react';
import { Check, ChevronDown } from 'lucide-react';

import { Stack } from '@/components/layout/stack';
import { Icon } from '@/components/ui/icon';
import type { SelectOption } from '@/components/ui/select';
import {
	getErrorId,
	getLabelId,
	getListboxId,
	getOptionId,
	getTriggerId,
	scrollOptionIntoView,
} from '@/components/ui/select/Select.utils';
import { Tag } from '@/components/ui/tag';
import { useSelect } from '@/components/ui/select/useSelect';
import { cn } from '@/utils/cn';

import styles from './MultiSelect.module.scss';
import { useMultiSelect } from './useMultiSelect';

export type MultiSelectProps = {
	id: string;
	label?: string;
	options: SelectOption[];
	value?: string[];
	defaultValue?: string[];
	onChange?: (value: string[]) => void;
	placeholder?: string;
	error?: string;
	disabled?: boolean;
	className?: string;
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
	error,
	disabled,
	className,
}: MultiSelectProps) => {
	const { selectedValues, toggleValue, removeValue } = useMultiSelect({
		value,
		defaultValue,
		onChange,
	});

	const selectedOptions = options.filter((option) =>
		selectedValues.includes(option.value)
	);

	const firstSelectedIndex = options.findIndex((option) =>
		selectedValues.includes(option.value)
	);

	const { isOpen, activeIndex, containerRef, triggerRef, open, close, setActiveIndex, handleTriggerKeyDown } =
		useSelect({
			optionsCount: options.length,
			isDisabled: disabled,
			initialActiveIndex: firstSelectedIndex >= 0 ? firstSelectedIndex : 0,
			closeOnSelect: false,
			onOptionConfirm: (index) => {
				const option = options[index];
				if (!option || option.disabled) return;
				toggleValue(option.value);
			},
			onScrollIntoView: (index) =>
				scrollOptionIntoView(getOptionId(id, options[index].value)),
		});

	const handleToggleOpen = () => {
		if (disabled) return;

		if (isOpen) {
			close();
			return;
		}

		open(firstSelectedIndex >= 0 ? firstSelectedIndex : 0);
	};

	const handleTriggerClick = (event: MouseEvent<HTMLDivElement>) => {
		if (isRemoveButton(event.target)) return;
		handleToggleOpen();
	};

	const handleOptionSelect = (option: SelectOption) => {
		if (option.disabled) return;
		toggleValue(option.value);
	};

	const triggerId = getTriggerId(id);
	const labelId = getLabelId(id);
	const listboxId = getListboxId(id);
	const errorId = error ? getErrorId(id) : undefined;

	return (
		<Stack
			ref={containerRef}
			gap="2"
			className={cn(styles['multiselect__wrapper'], className)}
		>
			{label && (
				<label id={labelId} className={styles['multiselect__label']} htmlFor={triggerId}>
					{label}
				</label>
			)}

			<div
				ref={triggerRef as RefObject<HTMLDivElement>}
				id={triggerId}
				role="combobox"
				tabIndex={disabled ? -1 : 0}
				aria-haspopup="listbox"
				aria-expanded={isOpen}
				aria-controls={listboxId}
				aria-labelledby={label ? labelId : undefined}
				aria-activedescendant={
					isOpen ? getOptionId(id, options[activeIndex]?.value ?? '') : undefined
				}
				aria-invalid={error ? true : undefined}
				aria-describedby={errorId}
				aria-disabled={disabled || undefined}
				className={cn(
					styles['multiselect__trigger'],
					error && styles['multiselect__trigger--error'],
					isOpen && styles['multiselect__trigger--open']
				)}
				onClick={handleTriggerClick}
				onKeyDown={handleTriggerKeyDown}
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
					aria-hidden
				/>
			</div>

			{isOpen && (
				<ul
					id={listboxId}
					role="listbox"
					aria-labelledby={label ? labelId : undefined}
					aria-multiselectable
					className={styles['multiselect__listbox']}
				>
					{options.map((option, index) => {
						const isSelected = selectedValues.includes(option.value);

						return (
							<li
								key={option.value}
								id={getOptionId(id, option.value)}
								role="option"
								aria-selected={isSelected}
								aria-disabled={option.disabled}
								className={cn(
									styles['multiselect__option'],
									isSelected && styles['multiselect__option--selected'],
									index === activeIndex &&
										styles['multiselect__option--active'],
									option.disabled &&
										styles['multiselect__option--disabled']
								)}
								onPointerDown={(event) => event.preventDefault()}
								onClick={() => handleOptionSelect(option)}
								onMouseEnter={() =>
									!option.disabled && setActiveIndex(index)
								}
							>
								{option.icon && (
									<span
										className={styles['multiselect__option-icon']}
										aria-hidden="true"
									>
										<Icon
											icon={option.icon}
											size="sm"
											variant={option.iconVariant}
										/>
									</span>
								)}
								<span className={styles['multiselect__option-content']}>
									<span className={styles['multiselect__option-label']}>
										{option.label}
									</span>
									{option.description && (
										<span
											className={styles['multiselect__option-description']}
										>
											{option.description}
										</span>
									)}
								</span>
								{isSelected && (
									<Icon
										icon={Check}
										size="sm"
										className={styles['multiselect__option-check']}
										aria-hidden
									/>
								)}
							</li>
						);
					})}
				</ul>
			)}

			{error && (
				<span id={errorId} className={styles['multiselect__error']} role="alert">
					{error}
				</span>
			)}
		</Stack>
	);
};
