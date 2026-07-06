import { useId } from 'react';
import { createPortal } from 'react-dom';

import { Overlay } from '@/components/patterns/overlay';
import { OverlayPanelFrame } from '@/components/ui/overlay-panel/OverlayPanelFrame';
import { useMounted } from '@/hooks/useMounted';
import { cn } from '@/utils/cn';

import styles from './Drawer.module.scss';
import type { DrawerProps } from './Drawer.types';
import { useDrawer } from './useDrawer';

export type { DrawerSide } from './Drawer.types';

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
		<Overlay blur slowEnter closing={closing} onClick={handleOverlayClick}>
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
				<OverlayPanelFrame
					title={title}
					titleId={titleId}
					footer={footer}
					onClose={onClose}
					closeLabel="Close drawer"
					classNames={{
						header: styles['drawer__header'],
						headerNoTitle: styles['drawer__header--no-title'],
						title: styles['drawer__title'],
						body: styles['drawer__body'],
						footer: styles['drawer__footer'],
					}}
				>
					{children}
				</OverlayPanelFrame>
			</div>
		</Overlay>,
		document.body
	);
};
