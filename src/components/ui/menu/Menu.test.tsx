import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import userEvent from '@testing-library/user-event';
import { Copy, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { describe, expect, it, vi } from 'vitest';

import { Button } from '@/components/ui/button';

import {
	Menu,
	MenuContent,
	MenuItem,
	MenuLabel,
	MenuSeparator,
	MenuSub,
	MenuSubContent,
	MenuSubTrigger,
	MenuTrigger,
} from './Menu';

const openActionsMenu = async () => {
	await userEvent.click(screen.getByRole('button', { name: /actions/i }));
};

const renderActionsMenu = (content: ReactNode) =>
	render(
		<Menu>
			<MenuTrigger>
				<Button variant="secondary">Actions</Button>
			</MenuTrigger>
			<MenuContent>{content}</MenuContent>
		</Menu>
	);

describe('Menu', () => {
	describe('dropdown', () => {
		it('opens from the trigger, selects items, and closes', async () => {
			const onEdit = vi.fn();

			render(
				<Menu>
					<MenuTrigger>
						<Button
							variant="secondary"
							iconOnly
							icon={MoreHorizontal}
							aria-label="Row actions"
						/>
					</MenuTrigger>
					<MenuContent>
						<MenuItem icon={Pencil} onClick={onEdit}>
							Edit
						</MenuItem>
						<MenuItem icon={Copy}>Duplicate</MenuItem>
					</MenuContent>
				</Menu>
			);

			expect(screen.queryByRole('menu')).not.toBeInTheDocument();

			await userEvent.click(screen.getByRole('button', { name: /row actions/i }));
			expect(screen.getByRole('menuitem', { name: /duplicate/i })).toBeInTheDocument();

			await userEvent.click(screen.getByRole('menuitem', { name: /edit/i }));
			expect(onEdit).toHaveBeenCalledOnce();
			expect(screen.queryByRole('menu')).not.toBeInTheDocument();
		});

		it('renders labels, separators, destructive items, and disabled items', async () => {
			const onEdit = vi.fn();
			renderActionsMenu(
				<>
					<MenuLabel>Manage</MenuLabel>
					<MenuItem icon={Pencil}>Edit</MenuItem>
					<MenuSeparator />
					<MenuItem icon={Trash2} destructive>
						Delete
					</MenuItem>
					<MenuItem disabled onClick={onEdit}>
						Disabled
					</MenuItem>
				</>
			);

			await openActionsMenu();

			expect(screen.getByText('Manage')).toBeInTheDocument();
			expect(screen.getByRole('separator')).toBeInTheDocument();
			expect(screen.getByRole('menuitem', { name: /delete/i })).toHaveAttribute(
				'data-destructive',
				'true'
			);

			const disabledItem = screen.getByRole('menuitem', { name: /disabled/i });
			expect(disabledItem).toHaveAttribute('data-disabled', 'true');
			await userEvent.click(disabledItem);
			expect(onEdit).not.toHaveBeenCalled();
		});

		it('closes on Escape or pointer down outside', async () => {
			renderActionsMenu(<MenuItem>Edit</MenuItem>);

			await openActionsMenu();
			expect(screen.getByRole('menu')).toBeInTheDocument();

			await userEvent.keyboard('{Escape}');
			expect(screen.queryByRole('menu')).not.toBeInTheDocument();

			await openActionsMenu();
			fireEvent.pointerDown(document.body);
			expect(screen.queryByRole('menu')).not.toBeInTheDocument();
		});
	});

	describe('keyboard navigation', () => {
		it('moves focus with arrow, Home, and End keys', async () => {
			renderActionsMenu(
				<>
					<MenuItem>Edit</MenuItem>
					<MenuItem>Copy</MenuItem>
					<MenuItem>Paste</MenuItem>
				</>
			);

			await openActionsMenu();

			const edit = screen.getByRole('menuitem', { name: /edit/i });
			const copy = screen.getByRole('menuitem', { name: /copy/i });
			const paste = screen.getByRole('menuitem', { name: /paste/i });

			await waitFor(() => {
				expect(edit).toHaveFocus();
			});

			await userEvent.keyboard('{ArrowDown}');
			expect(copy).toHaveFocus();

			await userEvent.keyboard('{ArrowDown}');
			expect(paste).toHaveFocus();

			await userEvent.keyboard('{Home}');
			expect(edit).toHaveFocus();

			await userEvent.keyboard('{End}');
			expect(paste).toHaveFocus();
		});

		it('opens and closes submenus with ArrowRight, ArrowLeft, and Escape', async () => {
			renderActionsMenu(
				<MenuSub>
					<MenuSubTrigger>Share</MenuSubTrigger>
					<MenuSubContent>
						<MenuItem>Email</MenuItem>
					</MenuSubContent>
				</MenuSub>
			);

			await openActionsMenu();

			const shareTrigger = screen.getByRole('menuitem', { name: /^share$/i });
			shareTrigger.focus();
			await userEvent.keyboard('{ArrowRight}');

			await waitFor(() => {
				expect(screen.getAllByRole('menu')).toHaveLength(2);
			});

			const emailItem = screen.getByRole('menuitem', { name: /email/i });
			emailItem.focus();

			await userEvent.keyboard('{ArrowLeft}');
			await waitFor(() => {
				expect(screen.getAllByRole('menu')).toHaveLength(1);
			});

			fireEvent.mouseEnter(shareTrigger);
			await waitFor(() => {
				expect(screen.getAllByRole('menu')).toHaveLength(2);
			});

			emailItem.focus();
			await userEvent.keyboard('{Escape}');
			await waitFor(() => {
				expect(screen.getAllByRole('menu')).toHaveLength(1);
			});
		});
	});

	describe('submenus', () => {
		it('opens nested submenus on hover and keeps parents open', async () => {
			renderActionsMenu(
				<MenuSub>
					<MenuSubTrigger>Share</MenuSubTrigger>
					<MenuSubContent>
						<MenuItem>Email</MenuItem>
						<MenuSub>
							<MenuSubTrigger>Export</MenuSubTrigger>
							<MenuSubContent>
								<MenuItem>PDF</MenuItem>
								<MenuItem>CSV</MenuItem>
							</MenuSubContent>
						</MenuSub>
					</MenuSubContent>
				</MenuSub>
			);

			await openActionsMenu();
			await userEvent.hover(screen.getByRole('menuitem', { name: /^share$/i }));

			await waitFor(() => {
				expect(screen.getAllByRole('menu')).toHaveLength(2);
			});

			await userEvent.hover(screen.getByRole('menuitem', { name: /^export$/i }));

			await waitFor(() => {
				expect(screen.getAllByRole('menu')).toHaveLength(3);
			});

			expect(screen.getByRole('menuitem', { name: /pdf/i })).toBeInTheDocument();
			expect(screen.getByRole('menuitem', { name: /email/i })).toBeInTheDocument();
		});

		it('closes a sibling submenu when hovering another trigger', async () => {
			renderActionsMenu(
				<>
					<MenuSub>
						<MenuSubTrigger>Share</MenuSubTrigger>
						<MenuSubContent>
							<MenuItem>Email</MenuItem>
						</MenuSubContent>
					</MenuSub>
					<MenuSub>
						<MenuSubTrigger>More</MenuSubTrigger>
						<MenuSubContent>
							<MenuItem>Archive</MenuItem>
						</MenuSubContent>
					</MenuSub>
				</>
			);

			await openActionsMenu();

			const shareTrigger = screen.getByRole('menuitem', { name: /^share$/i });
			const moreTrigger = screen.getByRole('menuitem', { name: /^more$/i });

			fireEvent.mouseEnter(shareTrigger);
			await waitFor(() => {
				expect(screen.getByRole('menuitem', { name: /email/i })).toBeInTheDocument();
			});

			fireEvent.mouseEnter(moreTrigger);
			await waitFor(() => {
				expect(
					screen.queryByRole('menuitem', { name: /email/i })
				).not.toBeInTheDocument();
			});
			expect(screen.getByRole('menuitem', { name: /archive/i })).toBeInTheDocument();
		});
	});

	describe('hover highlight', () => {
		it('tracks highlight across flat items, nested levels, and parent items', async () => {
			renderActionsMenu(
				<>
					<MenuItem>Edit</MenuItem>
					<MenuItem>Copy</MenuItem>
					<MenuSub>
						<MenuSubTrigger>Share</MenuSubTrigger>
						<MenuSubContent>
							<MenuItem>Email</MenuItem>
							<MenuSub>
								<MenuSubTrigger>Export</MenuSubTrigger>
								<MenuSubContent>
									<MenuItem>PDF</MenuItem>
									<MenuItem>CSV</MenuItem>
								</MenuSubContent>
							</MenuSub>
						</MenuSubContent>
					</MenuSub>
				</>
			);

			await openActionsMenu();

			const edit = screen.getByRole('menuitem', { name: /edit/i });
			const copy = screen.getByRole('menuitem', { name: /copy/i });

			await userEvent.hover(copy);
			expect(copy).toHaveAttribute('data-highlighted', 'true');
			expect(edit).not.toHaveAttribute('data-highlighted');

			await userEvent.hover(screen.getByRole('menuitem', { name: /^share$/i }));
			await waitFor(() => {
				expect(screen.getAllByRole('menu')).toHaveLength(2);
			});

			const exportTrigger = screen.getByRole('menuitem', { name: /^export$/i });
			fireEvent.mouseEnter(exportTrigger);

			await waitFor(() => {
				expect(exportTrigger).toHaveAttribute('aria-expanded', 'true');
			});

			const pdfItem = screen.getByRole('menuitem', { name: /pdf/i });
			const csvItem = screen.getByRole('menuitem', { name: /csv/i });

			fireEvent.mouseEnter(pdfItem);
			expect(pdfItem).toHaveAttribute('data-highlighted', 'true');
			expect(exportTrigger).toHaveAttribute('data-submenu-open', 'true');
			expect(exportTrigger).not.toHaveAttribute('data-highlighted');
			expect(csvItem).not.toHaveAttribute('data-highlighted');

			fireEvent.mouseEnter(csvItem);
			expect(csvItem).toHaveAttribute('data-highlighted', 'true');
			expect(pdfItem).not.toHaveAttribute('data-highlighted');

			const emailItem = screen.getByRole('menuitem', { name: /email/i });
			fireEvent.mouseLeave(csvItem);
			fireEvent.mouseEnter(emailItem);

			expect(emailItem).toHaveAttribute('data-highlighted', 'true');
			expect(screen.queryByRole('menuitem', { name: /pdf/i })).not.toBeInTheDocument();
		});
	});

	describe('menubar', () => {
		it('renders links and opens nested dropdown triggers', async () => {
			render(
				<Menu variant="menubar">
					<MenuItem href="/">Home</MenuItem>
					<Menu>
						<MenuTrigger>Products</MenuTrigger>
						<MenuContent>
							<MenuItem href="/widgets">Widgets</MenuItem>
						</MenuContent>
					</Menu>
				</Menu>
			);

			expect(screen.getByRole('menubar')).toBeInTheDocument();
			expect(screen.getByRole('menuitem', { name: /home/i })).toHaveAttribute(
				'href',
				'/'
			);

			await userEvent.click(screen.getByRole('button', { name: /products/i }));

			expect(screen.getByRole('menu')).toBeInTheDocument();
			expect(screen.getByRole('menuitem', { name: /widgets/i })).toHaveAttribute(
				'href',
				'/widgets'
			);
		});

		it('accepts a custom menubar aria-label', () => {
			render(
				<Menu variant="menubar" aria-label="Main navigation">
					<MenuItem href="/">Home</MenuItem>
				</Menu>
			);

			expect(
				screen.getByRole('menubar', { name: 'Main navigation' })
			).toBeInTheDocument();
		});
	});
});
