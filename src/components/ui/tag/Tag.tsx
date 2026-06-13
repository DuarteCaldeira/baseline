import type { HTMLAttributes, ReactNode } from 'react';

import type { LucideIcon } from 'lucide-react';
import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { cn } from '@/utils/cn';

import styles from './Tag.module.scss';
import type { TagSize, TagVariant } from './Tag.types';

type TagProps = Omit<HTMLAttributes<HTMLSpanElement>, 'className'> & {
	children: ReactNode;
	variant?: TagVariant;
	size?: TagSize;
	icon?: LucideIcon;
	onRemove?: () => void;
	removeLabel?: string;
};

const ICON_SIZE: Record<TagSize, 'sm' | 'md'> = {
	sm: 'sm',
	md: 'sm',
};

export const Tag = ({
	children,
	variant = 'default',
	size = 'md',
	icon,
	onRemove,
	removeLabel = 'Remove tag',
	...rest
}: TagProps) => (
	<span
		className={cn(
			styles.tag,
			styles[`tag--${variant}`],
			styles[`tag--${size}`],
			onRemove && styles['tag--removable']
		)}
		{...rest}
	>
		{icon && (
			<Icon icon={icon} size={ICON_SIZE[size]} variant="muted" aria-hidden />
		)}

		<span className={styles['tag__label']}>{children}</span>

		{onRemove && (
			<Button
				type="button"
				variant="ghost"
				size="sm"
				iconOnly
				icon={X}
				aria-label={removeLabel}
				onClick={onRemove}
			/>
		)}
	</span>
);
