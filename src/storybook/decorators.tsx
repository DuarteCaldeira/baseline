import type { Decorator } from '@storybook/react';

/** Full-width white surface panel on the canvas background. */
export const withSurface: Decorator = (Story) => (
	<div className="sb-surface">
		<Story />
	</div>
);

/** Compact white surface panel for centered stories. */
export const withSurfaceInline: Decorator = (Story) => (
	<div className="sb-surface sb-surface--inline">
		<Story />
	</div>
);

/** White surface panel with a max-width constraint. */
export const withSurfaceNarrow: Decorator = (Story) => (
	<div className="sb-surface sb-surface--narrow">
		<Story />
	</div>
);
