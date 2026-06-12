import { Children, useState } from 'react';
import type { ReactNode } from 'react';

import { Check } from 'lucide-react';

import { Stack } from '@/components/layout/stack';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { cn } from '@/utils/cn';

import styles from './Stepper.module.scss';
import type { Step, StepStatus } from './Stepper.types';

export type StepperProps = {
	steps: Step[];
	/** One child per step — the active step's panel is rendered between the progress bar and the navigation buttons. */
	children?: ReactNode;
	currentStep?: number;
	defaultStep?: number;
	onStepChange?: (step: number) => void;
};

const getStepStatus = (index: number, currentStep: number): StepStatus => {
	if (index < currentStep) return 'complete';
	if (index === currentStep) return 'current';
	return 'upcoming';
};

const renderStepIndicator = (status: StepStatus, index: number) => {
	if (status === 'complete') {
		return <Icon icon={Check} size="sm" aria-hidden />;
	}

	return index + 1;
};

export const Stepper = ({
	steps,
	children,
	currentStep: controlledStep,
	defaultStep = 0,
	onStepChange,
}: StepperProps) => {
	const [internalStep, setInternalStep] = useState(defaultStep);
	const isControlled = controlledStep !== undefined;
	const activeStep = isControlled ? controlledStep : internalStep;

	const updateStep = (nextStep: number) => {
		const clampedStep = Math.min(Math.max(nextStep, 0), steps.length - 1);
		if (!isControlled) setInternalStep(clampedStep);
		onStepChange?.(clampedStep);
	};

	const stepPanels = Children.toArray(children);
	const activePanel = stepPanels[activeStep] ?? null;

	return (
		<Stack gap="6">
			<Stack as="ol" direction="row" align="start" aria-label="Progress">
				{steps.map((step, index) => {
					const status = getStepStatus(index, activeStep);

					return (
						<li
							key={step.label}
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
			</Stack>

			<div className={styles['step__content']}>{activePanel}</div>

			<Stack direction="row" justify="end" gap="3">
				<Button
					variant="secondary"
					onClick={() => updateStep(activeStep - 1)}
					disabled={activeStep === 0}
				>
					Anterior
				</Button>
				<Button
					onClick={() => updateStep(activeStep + 1)}
					disabled={activeStep === steps.length - 1}
				>
					Seguinte
				</Button>
			</Stack>
		</Stack>
	);
};
