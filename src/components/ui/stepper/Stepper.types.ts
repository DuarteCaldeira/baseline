import type { ReactNode } from 'react';

export type Step = {
	id?: string;
	label: string;
	description?: string;
	content?: ReactNode;
};

export type StepStatus = 'complete' | 'current' | 'upcoming';
