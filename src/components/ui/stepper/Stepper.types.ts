export type Step = {
	label: string;
	description?: string;
};

export type StepStatus = 'complete' | 'current' | 'upcoming';
