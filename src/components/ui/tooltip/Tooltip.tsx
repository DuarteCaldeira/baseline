import { Children, cloneElement, isValidElement, useRef } from 'react';
import type {
	CSSProperties,
	HTMLAttributes,
	ReactElement,
	ReactNode,
} from 'react';
import { createPortal } from 'react-dom';

import { useMounted } from '@/hooks/useMounted';
import { cn } from '@/utils/cn';

import styles from './Tooltip.module.scss';
import type { TooltipPlacement } from './Tooltip.types';
import { useTooltip } from './useTooltip';
import { useTooltipPosition } from './useTooltipPosition';

export type TooltipProps = {
	content: ReactNode;
	children: ReactElement<HTMLAttributes<HTMLElement>>;
	placement?: TooltipPlacement;
};

export const Tooltip = ({
	content,
	children,
	placement = 'top',
}: TooltipProps) => {
	const triggerRef = useRef<HTMLSpanElement>(null);
	const bubbleRef = useRef<HTMLSpanElement>(null);
	const mounted = useMounted();

	const { isOpen, tooltipId, getTriggerProps } = useTooltip();

	const { position } = useTooltipPosition({
		isOpen,
		triggerRef,
		bubbleRef,
		preferredPlacement: placement,
	});

	if (!isValidElement(children)) {
		throw new Error(
			'Tooltip expects a single valid React element as its child.'
		);
	}

	const child = Children.only(children);
	const triggerProps = getTriggerProps(child.props);

	const bubbleStyle = {
		top: position?.top ?? 0,
		left: position?.left ?? 0,
		'--tooltip-arrow-offset': `${position?.arrowOffset ?? 0}px`,
	} as CSSProperties;

	const resolvedPlacement = position?.placement ?? placement;

	return (
		<span ref={triggerRef} className={styles.tooltip}>
			{cloneElement(child, triggerProps)}
			{mounted &&
				isOpen &&
				createPortal(
					<span
						ref={bubbleRef}
						role="tooltip"
						id={tooltipId}
						className={cn(
							styles['tooltip__bubble'],
							!position && styles['tooltip__bubble--measuring']
						)}
						style={bubbleStyle}
					>
						<span
							className={cn(
								styles['tooltip__arrow'],
								styles[`tooltip__arrow--${resolvedPlacement}`]
							)}
							aria-hidden="true"
						/>
						{content}
					</span>,
					document.body
				)}
		</span>
	);
};
