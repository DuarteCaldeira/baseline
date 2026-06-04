import { cn } from '@/utils/cn';

import styles from './Stepper.module.scss';

export interface Step {
	label: string;
	description?: string;
}

export interface StepperProps {
	steps: Step[];
	currentStep: number;
	className?: string;
}

export function Stepper({ steps, currentStep, className }: StepperProps) {
	return (
		<ol className={cn(styles.stepper, className)} aria-label="Progress">
			{steps.map((step, index) => {
				const status =
					index < currentStep
						? 'complete'
						: index === currentStep
							? 'current'
							: 'upcoming';

				return (
					<li
						key={index}
						className={cn(styles.step, styles[`step--${status}`])}
						aria-current={status === 'current' ? 'step' : undefined}
					>
						<span className={styles.stepIndicator}>
							{status === 'complete' ? '✓' : index + 1}
						</span>
						<span className={styles.stepLabel}>{step.label}</span>
						{step.description && (
							<span className={styles.stepDescription}>{step.description}</span>
						)}
					</li>
				);
			})}
		</ol>
	);
}
