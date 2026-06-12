import { Container } from '@/components/layout/container';
import { Stack } from '@/components/layout/stack';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import styles from './page.module.scss';

const HomePage = () => (
	<main className={styles['page__main']}>
		<Container size="md">
			<Stack gap="10" align="center">
				<Stack gap="6" align="center">
					<span className={styles['page__badge']}>Design System Starter</span>
					<h1 className={styles['page__heading']}>Baseline</h1>
					<p className={styles['page__description']}>
						A minimal React starter with Next.js, TypeScript, and SCSS modules.
						Build fast. Ship clean.
					</p>
					<Stack direction="row" gap="3">
						<Button variant="primary" size="md">
							Get Started
						</Button>
						<Button variant="secondary" size="md">
							View Docs
						</Button>
					</Stack>
				</Stack>

				<div className={styles['page__divider']} />

				<Stack
					as="section"
					gap="6"
					align="stretch"
					className={styles['page__showcase']}
				>
					<p className={styles['page__showcase-label']}>Components</p>
					<Stack direction="row" gap="3" className={styles['page__button-row']}>
						<Button variant="primary">Primary</Button>
						<Button variant="secondary">Secondary</Button>
						<Button variant="ghost">Ghost</Button>
						<Button variant="primary" disabled>
							Disabled
						</Button>
					</Stack>
					<Stack direction="row" gap="4" className={styles['page__input-row']}>
						<Input
							id="demo-email"
							label="Email address"
							placeholder="you@example.com"
							helperText="We'll never share your email."
						/>
						<Input
							id="demo-error"
							label="Username"
							placeholder="johndoe"
							error="That username is already taken."
						/>
					</Stack>
				</Stack>
			</Stack>
		</Container>
	</main>
);

export default HomePage;
