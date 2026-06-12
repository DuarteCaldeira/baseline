import type { CSSProperties, RefObject } from 'react';
import { createPortal } from 'react-dom';

import { Check } from 'lucide-react';

import { Icon } from '@/components/ui/icon';
import { cn } from '@/utils/cn';
import type { FloatingPlacement } from '@/utils/floatingPosition';

import type { SelectOption } from './Select.types';
import { getListboxId, getOptionId } from './Select.utils';
import styles from './SelectListbox.module.scss';

export type SelectListboxProps = {
	id: string;
	labelId?: string;
	options: SelectOption[];
	activeIndex: number;
	listboxRef: RefObject<HTMLUListElement>;
	style: CSSProperties;
	placement: FloatingPlacement;
	multi?: boolean;
	isSelected: (value: string) => boolean;
	onSelect: (option: SelectOption) => void;
	onHighlight: (index: number) => void;
	mounted: boolean;
	isOpen: boolean;
};

export const SelectListbox = ({
	id,
	labelId,
	options,
	activeIndex,
	listboxRef,
	style,
	placement,
	multi = false,
	isSelected,
	onSelect,
	onHighlight,
	mounted,
	isOpen,
}: SelectListboxProps) => {
	if (!mounted || !isOpen) return null;

	return createPortal(
		<ul
			ref={listboxRef}
			id={getListboxId(id)}
			role="listbox"
			aria-labelledby={labelId}
			aria-multiselectable={multi || undefined}
			style={style}
			className={cn(
				styles['select-listbox'],
				styles[`select-listbox--placement-${placement}`]
			)}
		>
			{options.map((option, index) => {
				const selected = isSelected(option.value);

				return (
					<li
						key={option.value}
						id={getOptionId(id, option.value)}
						role="option"
						aria-selected={selected}
						aria-disabled={option.disabled}
						className={cn(
							styles['select-listbox__option'],
							selected && styles['select-listbox__option--selected'],
							index === activeIndex && styles['select-listbox__option--active'],
							option.disabled && styles['select-listbox__option--disabled']
						)}
						onPointerDown={(event) => event.preventDefault()}
						onClick={() => onSelect(option)}
						onMouseEnter={() => !option.disabled && onHighlight(index)}
					>
						{option.icon && (
							<span
								className={styles['select-listbox__option-icon']}
								aria-hidden="true"
							>
								<Icon
									icon={option.icon}
									size="sm"
									variant={option.iconVariant}
								/>
							</span>
						)}
						<span className={styles['select-listbox__option-content']}>
							<span className={styles['select-listbox__option-label']}>
								{option.label}
							</span>
							{option.description && (
								<span className={styles['select-listbox__option-description']}>
									{option.description}
								</span>
							)}
						</span>
						{selected && (
							<Icon
								icon={Check}
								size="sm"
								className={styles['select-listbox__option-check']}
							/>
						)}
					</li>
				);
			})}
		</ul>,
		document.body
	);
};
