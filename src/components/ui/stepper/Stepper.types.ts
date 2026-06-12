export type Step = {
	id?: string;
	label: string;
	description?: string;
};

export type StepStatus = 'complete' | 'current' | 'upcoming';
