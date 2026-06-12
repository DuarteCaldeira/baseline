import { useId } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

import { Stack } from '@/components/layout/stack';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { useMounted } from '@/hooks/useMounted';
import { cn } from '@/utils/cn';

import type { DrawerProps } from './Drawer.types';
import { useDrawer } from './useDrawer';
import styles from './Drawer.module.scss';

export type { DrawerProps, DrawerSide } from './Drawer.types';

export const Drawer = ({
	isOpen,
	onClose,
	title,
	footer,
	children,
	side = 'right',
	size = 'md',
	closeOnBackdropClick = true,
}: DrawerProps) => {
	const titleId = useId();
	const mounted = useMounted();

	const {
		dialogRef,
		present,
		closing,
		handleOverlayClick,
		handleDialogClick,
		handleDialogKeyDown,
		handlePanelAnimationEnd,
	} = useDrawer({ isOpen, onClose, closeOnBackdropClick });

	if (!mounted || !present) return null;

	return createPortal(
		<div
			className={cn(
				styles['drawer-overlay'],
				closing && styles['drawer-overlay--closing']
			)}
			onClick={handleOverlayClick}
		>
			<div
				ref={dialogRef}
				role="dialog"
				aria-modal="true"
				aria-labelledby={title ? titleId : undefined}
				tabIndex={-1}
				className={cn(
					styles.drawer,
					styles[`drawer--${side}`],
					styles[`drawer--${size}`],
					closing && styles['drawer--closing']
				)}
				onClick={handleDialogClick}
				onKeyDown={handleDialogKeyDown}
				onAnimationEnd={handlePanelAnimationEnd}
			>
				<Stack
					as="header"
					direction="row"
					justify={title ? 'between' : 'end'}
					align="center"
					className={cn(
						styles['drawer__header'],
						!title && styles['drawer__header--no-title']
					)}
				>
					{title && (
						<h2 id={titleId} className={styles['drawer__title']}>
							{title}
						</h2>
					)}
					<Button
						type="button"
						variant="ghost"
						size="sm"
						iconOnly
						onClick={onClose}
						aria-label="Close drawer"
					>
						<Icon icon={X} size="sm" />
					</Button>
				</Stack>
				<div className={styles['drawer__body']}>{children}</div>
				{footer && (
					<Stack
						as="footer"
						direction="row"
						justify="end"
						gap="2"
						className={styles['drawer__footer']}
					>
						{footer}
					</Stack>
				)}
			</div>
		</div>,
		document.body
	);
};
