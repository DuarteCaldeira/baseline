import { Check } from 'lucide-react';

import { Icon } from '@/components/ui/icon';

import type { StepStatus } from './Stepper.types';

type StepIndicatorProps = {
	status: StepStatus;
	index: number;
};

export const StepIndicator = ({ status, index }: StepIndicatorProps) => {
	if (status === 'complete') return <Icon icon={Check} size="sm" />;
	return <>{index + 1}</>;
};
