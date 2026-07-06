import type { ReactNode } from 'react';

import { X } from 'lucide-react';

import { Stack } from '@/components/layout/stack';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { cn } from '@/utils/cn';

type OverlayPanelFrameProps = {
	title?: string;
	titleId: string;
	footer?: ReactNode;
	children: ReactNode;
	onClose: () => void;
	closeLabel: string;
	classNames: {
		header: string;
		headerNoTitle: string;
		title: string;
		body: string;
		footer: string;
	};
};

export const OverlayPanelFrame = ({
	title,
	titleId,
	footer,
	children,
	onClose,
	closeLabel,
	classNames,
}: OverlayPanelFrameProps) => (
	<>
		<Stack
			as="header"
			direction="row"
			justify={title ? 'between' : 'end'}
			align="center"
			className={cn(classNames.header, !title && classNames.headerNoTitle)}
		>
			{title && (
				<h2 id={titleId} className={classNames.title}>
					{title}
				</h2>
			)}
			<Button
				type="button"
				variant="ghost"
				size="sm"
				iconOnly
				onClick={onClose}
				aria-label={closeLabel}
			>
				<Icon icon={X} size="sm" />
			</Button>
		</Stack>
		<div className={classNames.body}>{children}</div>
		{footer && (
			<Stack
				as="footer"
				direction="row"
				justify="end"
				gap="sm"
				className={classNames.footer}
			>
				{footer}
			</Stack>
		)}
	</>
);
