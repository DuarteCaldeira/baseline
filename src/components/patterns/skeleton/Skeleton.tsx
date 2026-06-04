import type { HTMLAttributes } from 'react';

import { Stack } from '@/components/layout/stack';
import type { Size } from '@/types/common';
import { cn } from '@/utils/cn';

import type { SkeletonVariant, SkeletonWidth } from './Skeleton.types';
import styles from './Skeleton.module.scss';

export type SkeletonProps = HTMLAttributes<HTMLElement> & {
	variant?: SkeletonVariant;
	size?: Size;
	width?: SkeletonWidth;
	/** Line count when `variant="paragraph"`. Defaults to 3. */
	lines?: number;
	/** Shimmer animation. Defaults to true. */
	animate?: boolean;
	/** Use `span` for inline placeholders inside running text. */
	as?: 'span' | 'div';
	className?: string;
};

const WIDTH_CLASS: Record<SkeletonWidth, string | undefined> = {
	full: styles['skeleton--width-full'],
	'3/4': styles['skeleton--width-3/4'],
	'2/3': styles['skeleton--width-2/3'],
	'1/2': styles['skeleton--width-1/2'],
	'1/3': styles['skeleton--width-1/3'],
	'1/4': styles['skeleton--width-1/4'],
	auto: styles['skeleton--width-auto'],
};

const resolveVariantClass = (variant: SkeletonVariant): string => {
	if (variant === 'paragraph') return styles['skeleton--text'];
	return styles[`skeleton--${variant}`];
};

const buildSkeletonClassName = ({
	variant,
	size,
	width,
	animate,
	inline,
	className,
}: {
	variant: SkeletonVariant;
	size: Size;
	width: SkeletonWidth;
	animate: boolean;
	inline: boolean;
	className?: string;
}) => {
	const usesWidth =
		variant === 'text' ||
		variant === 'heading' ||
		variant === 'paragraph' ||
		variant === 'rectangular';

	return cn(
		styles.skeleton,
		resolveVariantClass(variant),
		styles[`skeleton--${size}`],
		usesWidth && WIDTH_CLASS[width],
		!animate && styles['skeleton--static'],
		inline && styles['skeleton--inline'],
		className
	);
};

export const Skeleton = ({
	variant = 'text',
	size = 'md',
	width = 'full',
	lines = 3,
	animate = true,
	as: Component = 'div',
	className,
	...rest
}: SkeletonProps) => {
	if (variant === 'paragraph' && lines > 1) {
		return (
			<Stack
				gap="2"
				className={cn(styles['skeleton__lines'], className)}
				aria-hidden="true"
				{...(rest as HTMLAttributes<HTMLDivElement>)}
			>
				{Array.from({ length: lines }, (_, index) => (
					<Component
						key={index}
						className={buildSkeletonClassName({
							variant: 'paragraph',
							size,
							width: index === lines - 1 ? '2/3' : width,
							animate,
							inline: Component === 'span',
						})}
					/>
				))}
			</Stack>
		);
	}

	return (
		<Component
			className={buildSkeletonClassName({
				variant,
				size,
				width,
				animate,
				inline: Component === 'span',
				className,
			})}
			aria-hidden="true"
			{...rest}
		/>
	);
};

export type { SkeletonVariant, SkeletonWidth } from './Skeleton.types';
