import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode } from 'react';

import type { ButtonGroupOrientation } from './ButtonGroup.types';

type GroupChildProps = {
	'data-button-group-item'?: ButtonGroupOrientation;
};

export const assignGroupItemAttributes = (
	children: ReactNode,
	orientation: ButtonGroupOrientation
): ReactNode =>
	Children.map(children, (child) => {
		if (!isValidElement(child)) return child;

		return cloneElement(child as ReactElement<GroupChildProps>, {
			'data-button-group-item': orientation,
		});
	});
