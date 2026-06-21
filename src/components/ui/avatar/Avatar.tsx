import { useState } from 'react';

import { User } from 'lucide-react';

import { Icon } from '@/components/ui/icon';
import type { Size } from '@/types/common';
import { cn } from '@/utils/cn';

import styles from './Avatar.module.scss';
import type { AvatarSize } from './Avatar.types';
import { getInitials } from './Avatar.utils';

type AvatarProps = {
	/** Person name — used for initials, accessible name, and default image alt text. */
	name: string;
	src?: string;
	/** Image alt text. Defaults to `name` when omitted. */
	alt?: string;
	size?: AvatarSize;
	className?: string;
};

const ICON_SIZE: Record<AvatarSize, Size> = {
	xs: 'sm',
	sm: 'sm',
	md: 'sm',
	lg: 'md',
};

export const Avatar = ({
	name,
	src,
	alt,
	size = 'md',
	className,
}: AvatarProps) => {
	const [imageError, setImageError] = useState(false);
	const showImage = Boolean(src) && !imageError;
	const initials = getInitials(name);
	const accessibleName = alt ?? name;

	const fallbackContent = initials ? (
		<span className={styles['avatar__initials']} aria-hidden="true">
			{initials}
		</span>
	) : (
		<Icon icon={User} size={ICON_SIZE[size]} variant="primary" />
	);

	return (
		<span
			className={cn(styles.avatar, styles[`avatar--${size}`], className)}
			role={showImage ? undefined : 'img'}
			aria-label={showImage ? undefined : accessibleName}
		>
			{showImage ? (
				<img
					src={src}
					alt={accessibleName}
					className={styles['avatar__image']}
					onError={() => setImageError(true)}
				/>
			) : (
				fallbackContent
			)}
		</span>
	);
};
