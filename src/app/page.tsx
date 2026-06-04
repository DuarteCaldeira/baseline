import { Container } from '@/components/layout/container';
import { Stack } from '@/components/layout/stack';
import { Button } from '@/components/ui/button';

import styles from './page.module.scss';

export default function HomePage() {
	return (
		<main className={styles.main}>
			<Container size="md">
				<Stack gap="6" align="center">
					<h1 className={styles.heading}>Baseline</h1>
					<p className={styles.description}>
						A minimal React starter with Next.js, TypeScript, and SCSS modules.
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
			</Container>
		</main>
	);
}
