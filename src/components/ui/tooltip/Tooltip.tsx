import { Children, cloneElement, isValidElement, useRef } from 'react';
import type { HTMLAttributes, ReactElement, ReactNode } from 'react';

import { FloatingPortal } from '@/components/patterns/floating-portal';
import { useFloatingPosition } from '@/hooks/useFloatingPosition';
import { useMounted } from '@/hooks/useMounted';
import { cn } from '@/utils/cn';

import styles from './Tooltip.module.scss';
import type { TooltipPlacement } from './Tooltip.types';
import { useTooltip } from './useTooltip';

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

	const { style, placement: resolvedPlacement, position } = useFloatingPosition({
		isOpen,
		triggerRef,
		floatingRef: bubbleRef,
		preferredPlacement: placement,
		variant: 'tooltip',
	});

	if (!isValidElement(children)) {
		throw new Error(
			'Tooltip expects a single valid React element as its child.'
		);
	}

	const child = Children.only(children);
	const triggerProps = getTriggerProps(child.props);

	return (
		<span ref={triggerRef} className={styles.tooltip}>
			{cloneElement(child, triggerProps)}
			<FloatingPortal mounted={mounted} isOpen={isOpen}>
				<span
					ref={bubbleRef}
					role="tooltip"
					id={tooltipId}
					className={cn(
						styles['tooltip__bubble'],
						!position && styles['tooltip__bubble--measuring']
					)}
					style={style}
				>
					<span
						className={cn(
							styles['tooltip__arrow'],
							styles[`tooltip__arrow--${resolvedPlacement}`]
						)}
						aria-hidden="true"
					/>
					{content}
				</span>
			</FloatingPortal>
		</span>
	);
};
