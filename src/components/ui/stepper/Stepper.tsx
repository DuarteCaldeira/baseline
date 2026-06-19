import { useId } from 'react';

import { Stack } from '@/components/layout/stack';
import { Button } from '@/components/ui/button';
import { useControllableState } from '@/hooks/useControllableState';

import { StepItem } from './StepItem';
import styles from './Stepper.module.scss';
import type { Step } from './Stepper.types';
import { getStepStatus } from './Stepper.utils';

export type StepperProps = {
	steps: Step[];
	currentStep?: number;
	defaultStep?: number;
	onStepChange?: (step: number) => void;
	previousLabel?: string;
	nextLabel?: string;
};

export const Stepper = ({
	steps,
	currentStep: controlledStep,
	defaultStep = 0,
	onStepChange,
	previousLabel = 'Previous',
	nextLabel = 'Next',
}: StepperProps) => {
	const baseId = useId();

	const { value: activeStep = 0, setValue } = useControllableState({
		value: controlledStep,
		defaultValue: defaultStep,
		onChange: onStepChange,
	});

	const updateStep = (next: number) => {
		setValue(Math.min(Math.max(next, 0), steps.length - 1));
	};

	return (
		<Stack gap="xl">
			<Stack as="ol" direction="row" align="start" aria-label="Progress">
				{steps.map((step, index) => (
					<StepItem
						key={step.id ?? `${step.label}-${index}`}
						step={step}
						index={index}
						id={`${baseId}-step-${index}`}
						status={getStepStatus(index, activeStep)}
					/>
				))}
			</Stack>

			<div
				id={`${baseId}-panel`}
				role="region"
				aria-labelledby={`${baseId}-step-${activeStep}`}
				className={styles['stepper__content']}
			>
				{steps[activeStep]?.content ?? null}
			</div>

			<Stack direction="row" justify="end" gap="md">
				<Button
					variant="secondary"
					onClick={() => updateStep(activeStep - 1)}
					disabled={activeStep === 0}
				>
					{previousLabel}
				</Button>
				<Button
					onClick={() => updateStep(activeStep + 1)}
					disabled={activeStep === steps.length - 1}
				>
					{nextLabel}
				</Button>
			</Stack>
		</Stack>
	);
};
