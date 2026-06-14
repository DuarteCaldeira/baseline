import { cn } from '@/utils/cn';

import { StepIndicator } from './StepIndicator';
import type { Step, StepStatus } from './Stepper.types';
import styles from './Stepper.module.scss';

type StepItemProps = {
	step: Step;
	index: number;
	id: string;
	status: StepStatus;
};

export const StepItem = ({ step, index, id, status }: StepItemProps) => (
	<li
		id={id}
		className={cn(styles.step, styles[`step--${status}`])}
		aria-current={status === 'current' ? 'step' : undefined}
	>
		<span className={styles['step__indicator']} aria-hidden="true">
			<StepIndicator status={status} index={index} />
		</span>
		<span className={styles['step__label']}>{step.label}</span>
		{step.description && (
			<span className={styles['step__description']}>{step.description}</span>
		)}
	</li>
);
