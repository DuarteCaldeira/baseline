import type { ComponentProps, ReactNode, RefObject } from 'react';

import { FormField } from '@/components/patterns/form-field';
import { cn } from '@/utils/cn';
import {
	type FieldControlProps,
	getFieldControlProps,
	getLabelId,
} from '@/utils/fieldIds';

import { Listbox } from './Listbox';
import { getListboxId } from './Listbox.utils';

type TriggerMeta = {
	labelId?: string;
	listboxId: string;
	fieldControlProps: FieldControlProps;
};

type ListboxFieldProps = {
	id: string;
	label?: string;
	required?: boolean;
	helperText?: string;
	error?: string;
	containerRef: RefObject<HTMLDivElement | null>;
	controlClassName: string;
	renderTrigger: (meta: TriggerMeta) => ReactNode;
	listboxProps: Omit<ComponentProps<typeof Listbox>, 'id' | 'labelId'>;
};

export const ListboxField = ({
	id,
	label,
	required,
	helperText,
	error,
	containerRef,
	controlClassName,
	renderTrigger,
	listboxProps,
}: ListboxFieldProps) => {
	const labelId = label ? getLabelId(id) : undefined;
	const listboxId = getListboxId(id);
	const fieldControlProps = getFieldControlProps(id, { helperText, error });

	return (
		<div ref={containerRef}>
			<FormField
				fieldId={id}
				label={label}
				required={required}
				helperText={helperText}
				error={error}
			>
				<div className={cn(controlClassName)}>
					{renderTrigger({ labelId, listboxId, fieldControlProps })}
					<Listbox id={id} labelId={labelId} {...listboxProps} />
				</div>
			</FormField>
		</div>
	);
};
