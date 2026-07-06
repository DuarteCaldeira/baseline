import {
	type KeyboardEvent,
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react';

import { useDismissibleLayer } from '@/hooks/useDismissibleLayer';

import {
	focusMenuItem,
	focusMenubarItem,
	getMenuItems,
	getMenubarItems,
	isActivationKey,
	moveFocus,
	openSubmenuFromKeyboard,
	runMenuKeyHandler,
} from '../Menu.keyboard.utils';
import type { UseMenuOptions, UseMenuReturn } from '../Menu.types';

const SUBMENU_CLOSE_DELAY_MS = 120;

export const useMenu = ({
	variant,
	menuId,
	parentMenuId,
	activeSubmenu,
	setActiveSubmenu,
}: UseMenuOptions): UseMenuReturn => {
	const [isOpen, setIsOpen] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);
	const triggerRef = useRef<HTMLElement>(null);
	const contentRef = useRef<HTMLDivElement>(null);
	const menubarRef = useRef<HTMLDivElement>(null);
	const closeTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(
		undefined
	);

	const cancelSubmenuClose = useCallback(() => {
		if (!closeTimerRef.current) return;
		clearTimeout(closeTimerRef.current);
		closeTimerRef.current = undefined;
	}, []);

	useDismissibleLayer({
		isOpen: isOpen && variant !== 'menubar',
		onDismiss: () => {
			cancelSubmenuClose();
			if (variant === 'submenu' && activeSubmenu?.menuId === menuId) {
				setActiveSubmenu(null);
			}
			setIsOpen(false);
			triggerRef.current?.focus();
		},
		refs: [containerRef, contentRef],
		triggerRef,
		dismissOnEscape: false,
	});

	const close = useCallback(() => {
		cancelSubmenuClose();
		if (variant === 'submenu' && activeSubmenu?.menuId === menuId) {
			setActiveSubmenu(null);
		}
		setIsOpen(false);
		triggerRef.current?.focus();
	}, [activeSubmenu, cancelSubmenuClose, menuId, setActiveSubmenu, variant]);

	const scheduleSubmenuClose = useCallback(() => {
		if (variant !== 'submenu') return;
		cancelSubmenuClose();
		closeTimerRef.current = setTimeout(close, SUBMENU_CLOSE_DELAY_MS);
	}, [cancelSubmenuClose, close, variant]);

	const open = useCallback(() => {
		cancelSubmenuClose();
		if (variant === 'submenu' && parentMenuId) {
			setActiveSubmenu({ menuId, parentMenuId });
		}
		setIsOpen(true);
	}, [cancelSubmenuClose, menuId, parentMenuId, setActiveSubmenu, variant]);

	const toggle = useCallback(() => {
		if (isOpen) {
			close();
			return;
		}
		open();
	}, [isOpen, open, close]);

	useEffect(() => {
		if (variant !== 'submenu' || !isOpen || !parentMenuId) return;
		if (!activeSubmenu || activeSubmenu.menuId === menuId) return;
		if (activeSubmenu.parentMenuId === parentMenuId) {
			setIsOpen(false);
		}
	}, [activeSubmenu, isOpen, menuId, parentMenuId, variant]);

	useEffect(() => {
		if (!isOpen || variant === 'menubar') return;
		focusMenuItem(contentRef.current, 'first');
	}, [isOpen, variant]);

	const handleTriggerKeyDown = useCallback(
		(event: KeyboardEvent<HTMLElement>) => {
			if (variant === 'submenu') {
				runMenuKeyHandler(event, {
					ArrowRight: () => {
						event.preventDefault();
						open();
					},
					Enter: () => {
						event.preventDefault();
						open();
					},
					' ': () => {
						event.preventDefault();
						open();
					},
					ArrowLeft: () => {
						event.preventDefault();
						close();
					},
				});
				return;
			}

			runMenuKeyHandler(event, {
				ArrowDown: () => {
					event.preventDefault();
					if (!isOpen) open();
					else focusMenuItem(contentRef.current, 'first');
				},
				ArrowUp: () => {
					event.preventDefault();
					if (!isOpen) open();
					else focusMenuItem(contentRef.current, 'last');
				},
				Escape: () => {
					if (!isOpen) return;
					event.preventDefault();
					close();
				},
			});

			if (!event.defaultPrevented && isActivationKey(event)) {
				event.preventDefault();
				toggle();
			}
		},
		[close, isOpen, open, toggle, variant]
	);

	const handleContentKeyDown = useCallback(
		(event: KeyboardEvent<HTMLElement>) => {
			const items = getMenuItems(contentRef.current);
			const current = document.activeElement as HTMLElement;

			const navigate = (direction: 1 | -1) => {
				event.preventDefault();
				moveFocus(items, current, direction);
			};

			const closeMenu = (options?: { stopPropagation?: boolean }) => {
				event.preventDefault();
				if (options?.stopPropagation) event.stopPropagation();
				close();
			};

			if (variant === 'submenu') {
				runMenuKeyHandler(event, {
					ArrowDown: () => navigate(1),
					ArrowUp: () => navigate(-1),
					ArrowLeft: () => closeMenu({ stopPropagation: true }),
					Escape: () => closeMenu({ stopPropagation: true }),
				});
				return;
			}

			runMenuKeyHandler(event, {
				ArrowDown: () => navigate(1),
				ArrowUp: () => navigate(-1),
				ArrowRight: () => {
					if (!openSubmenuFromKeyboard(current)) return;
					event.preventDefault();
				},
				Home: () => {
					event.preventDefault();
					focusMenuItem(contentRef.current, 'first');
				},
				End: () => {
					event.preventDefault();
					focusMenuItem(contentRef.current, 'last');
				},
				Escape: () => closeMenu(),
				Tab: () => closeMenu(),
			});
		},
		[close, variant]
	);

	const handleMenubarKeyDown = useCallback(
		(event: KeyboardEvent<HTMLElement>) => {
			const items = getMenubarItems(menubarRef.current);
			const current = document.activeElement as HTMLElement;

			runMenuKeyHandler(event, {
				ArrowRight: () => {
					event.preventDefault();
					moveFocus(items, current, 1);
				},
				ArrowLeft: () => {
					event.preventDefault();
					moveFocus(items, current, -1);
				},
				Home: () => {
					event.preventDefault();
					focusMenubarItem(menubarRef.current, 'first');
				},
				End: () => {
					event.preventDefault();
					focusMenubarItem(menubarRef.current, 'last');
				},
			});
		},
		[]
	);

	return {
		isOpen,
		open,
		close,
		toggle,
		containerRef,
		triggerRef,
		contentRef,
		menubarRef,
		handleTriggerKeyDown,
		handleContentKeyDown,
		handleMenubarKeyDown,
		scheduleSubmenuClose,
		cancelSubmenuClose,
	};
};
