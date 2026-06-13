import { cloneElement, isValidElement } from 'react';
import type { KeyboardEvent, MouseEvent, ReactElement, Ref } from 'react';

import { Button } from '@/components/ui/button';

import type { MenuTriggerChildProps, MenuTriggerProps } from '../Menu.types';
import { buildTriggerProps, mergeRefs } from '../Menu.utils';
import { useMenuContext } from '../MenuContext';

export const MenuTrigger = ({ children }: MenuTriggerProps) => {
	const context = useMenuContext();
	const triggerProps = buildTriggerProps(context);

	if (typeof children === 'string' || !isValidElement(children)) {
		return (
			<Button
				ref={context.triggerRef as Ref<HTMLButtonElement>}
				type="button"
				variant="ghost"
				size="sm"
				{...triggerProps}
			>
				{children}
			</Button>
		);
	}

	const child = children as ReactElement<MenuTriggerChildProps>;

	return cloneElement(child, {
		...triggerProps,
		ref: mergeRefs(context.triggerRef, child.props.ref),
		onClick: (event: MouseEvent<HTMLElement>) => {
			child.props.onClick?.(event);
			if (event.defaultPrevented) return;
			triggerProps.onClick(event);
		},
		onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
			child.props.onKeyDown?.(event);
			if (event.defaultPrevented) return;
			triggerProps.onKeyDown(event);
		},
		disabled: child.props.disabled,
		'data-disabled': child.props.disabled ? 'true' : undefined,
	});
};
