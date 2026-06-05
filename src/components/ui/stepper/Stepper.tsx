import { X } from 'lucide-react';

import { Icon } from '@/components/ui/icon';
import { cn } from '@/utils/cn';

import type { Step } from './Stepper.types';
import styles from './Stepper.module.scss';

export type StepperProps = {
	steps: Step[];
	currentStep: number;
	className?: string;
};

type StepStatus = 'complete' | 'current' | 'upcoming';

const getStepStatus = (index: number, currentStep: number): StepStatus => {
	if (index < currentStep) return 'complete';
	if (index === currentStep) return 'current';
	return 'upcoming';
};

const renderStepIndicator = (status: StepStatus, index: number) => {
	if (status === 'complete') {
		return <Icon icon={X} size="sm" aria-hidden />;
	}

	return index + 1;
};

export const Stepper = ({ steps, currentStep, className }: StepperProps) => (
	<ol className={cn(styles.stepper, className)} aria-label="Progress">
		{steps.map((step, index) => {
			const status = getStepStatus(index, currentStep);

			return (
				<li
					key={index}
					className={cn(styles.step, styles[`step--${status}`])}
					aria-current={status === 'current' ? 'step' : undefined}
				>
					<span className={styles['step__indicator']} aria-hidden="true">
						{renderStepIndicator(status, index)}
					</span>
					<span className={styles['step__label']}>{step.label}</span>
					{step.description && (
						<span className={styles['step__description']}>
							{step.description}
						</span>
					)}
				</li>
			);
		})}
	</ol>
);
