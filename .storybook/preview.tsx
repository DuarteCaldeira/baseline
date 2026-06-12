import type { Preview } from '@storybook/react';

import '../src/styles/globals.scss';
import './preview.scss';

const preview: Preview = {
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /date$/i,
			},
		},
		backgrounds: { disable: true },
		a11y: {
			config: {},
		},
	},
	globalTypes: {
		theme: {
			description: 'Global theme',
			defaultValue: 'light',
			toolbar: {
				title: 'Theme',
				icon: 'circlehollow',
				items: ['light', 'dark'],
				dynamicTitle: true,
			},
		},
	},
	decorators: [
		(Story, context) => {
			const theme = (context.globals['theme'] as string) ?? 'light';
			document.documentElement.setAttribute('data-theme', theme);

			return (
				<div className="sb-preview-canvas">
					<div className="sb-story-wrapper">
						<Story />
					</div>
				</div>
			);
		},
	],
};

export default preview;
