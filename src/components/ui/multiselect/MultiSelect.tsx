import { useRef, type KeyboardEvent, type MouseEvent, type RefObject } from 'react';
import { ChevronDown } from 'lucide-react';

import { Stack } from '@/components/layout/stack';
import { Icon } from '@/components/ui/icon';
import type { SelectOption } from '@/components/ui/select';
import {
	getErrorId,
	getHelperId,
	getLabelId,
	getListboxId,
	getOptionId,
	getTriggerId,
	getDescribedBy,
	scrollOptionIntoView,
} from '@/components/ui/select/Select.utils';
import { SelectListbox } from '@/components/ui/select/SelectListbox';
import { Tag } from '@/components/ui/tag';
import { useSelect } from '@/components/ui/select/useSelect';
import { useFloatingPosition } from '@/hooks/useFloatingPosition';
import { useMounted } from '@/hooks/useMounted';
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
	helperText?: string;
	error?: string;
	disabled?: boolean;
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
}: MultiSelectProps) => {
	const listboxRef = useRef<HTMLUListElement>(null);
	const mounted = useMounted();
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
			overlayRef: listboxRef,
			onOptionConfirm: (index) => {
				const option = options[index];
				if (!option || option.disabled) return;
				toggleValue(option.value);
			},
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
	const helperId = helperText ? getHelperId(id) : undefined;
	const errorId = error ? getErrorId(id) : undefined;
	const describedBy = getDescribedBy([helperId, errorId]);

	return (
		<Stack
			ref={containerRef}
			gap="2"
			className={styles['multiselect__wrapper']}
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
				aria-describedby={describedBy}
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

			<SelectListbox
				id={id}
				labelId={label ? labelId : undefined}
				options={options}
				activeIndex={activeIndex}
				listboxRef={listboxRef}
				style={style}
				placement={placement}
				multi
				isSelected={(optionValue) => selectedValues.includes(optionValue)}
				onSelect={handleOptionSelect}
				onHighlight={setActiveIndex}
				mounted={mounted}
				isOpen={isOpen}
			/>

			{helperText && (
				<span id={helperId} className={styles['multiselect__helper']}>
					{helperText}
				</span>
			)}

			{error && (
				<span id={errorId} className={styles['multiselect__error']} role="alert">
					{error}
				</span>
			)}
		</Stack>
	);
};
