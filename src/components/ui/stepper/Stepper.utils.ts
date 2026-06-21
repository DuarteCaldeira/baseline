import type { StepStatus } from './Stepper.types';

export const getStepStatus = (
	index: number,
	activeStep: number
): StepStatus => {
	if (index < activeStep) return 'complete';
	if (index === activeStep) return 'current';
	return 'upcoming';
};
