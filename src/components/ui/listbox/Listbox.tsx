import type { CSSProperties, RefObject } from 'react';

import { Check } from 'lucide-react';

import { FloatingPortal } from '@/components/patterns/floating-portal';
import { Icon } from '@/components/ui/icon';
import type { SelectOption } from '@/components/ui/select';
import { cn } from '@/utils/cn';
import type { FloatingPlacement } from '@/utils/floatingPosition';

import styles from './Listbox.module.scss';
import { getListboxId, getOptionId } from './Listbox.utils';

type ListboxProps = {
	id: string;
	labelId?: string;
	options: SelectOption[];
	activeIndex: number;
	listboxRef: RefObject<HTMLUListElement | null>;
	style: CSSProperties;
	placement: FloatingPlacement;
	multi?: boolean;
	isSelected: (value: string) => boolean;
	onSelect: (option: SelectOption) => void;
	onHighlight: (index: number) => void;
	mounted: boolean;
	isOpen: boolean;
};

export const Listbox = ({
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
}: ListboxProps) => (
	<FloatingPortal mounted={mounted} isOpen={isOpen}>
		<ul
			ref={listboxRef}
			id={getListboxId(id)}
			role="listbox"
			aria-labelledby={labelId}
			aria-multiselectable={multi || undefined}
			style={style}
			className={cn(styles.listbox, styles[`listbox--placement-${placement}`])}
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
							styles['listbox__option'],
							selected && styles['listbox__option--selected'],
							index === activeIndex && styles['listbox__option--active'],
							option.disabled && styles['listbox__option--disabled']
						)}
						onPointerDown={(event) => event.preventDefault()}
						onClick={() => onSelect(option)}
						onMouseEnter={() => !option.disabled && onHighlight(index)}
					>
						{option.icon && (
							<span
								className={styles['listbox__option-icon']}
								aria-hidden="true"
							>
								<Icon
									icon={option.icon}
									size="sm"
									variant={option.iconVariant}
								/>
							</span>
						)}
						<span className={styles['listbox__option-content']}>
							<span className={styles['listbox__option-label']}>
								{option.label}
							</span>
							{option.description && (
								<span className={styles['listbox__option-description']}>
									{option.description}
								</span>
							)}
						</span>
						{selected && (
							<Icon
								icon={Check}
								size="sm"
								className={styles['listbox__option-check']}
							/>
						)}
					</li>
				);
			})}
		</ul>
	</FloatingPortal>
);
