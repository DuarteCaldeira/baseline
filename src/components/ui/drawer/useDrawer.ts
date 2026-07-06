import {
	type AnimationEvent,
	type KeyboardEvent,
	type MouseEvent,
	type RefObject,
	useCallback,
	useEffect,
	useState,
} from 'react';

import { useOverlayBehavior } from '@/hooks/useOverlayBehavior';

type DrawerPhase = 'hidden' | 'visible' | 'exiting';

type UseDrawerOptions = {
	isOpen: boolean;
	onClose: () => void;
	closeOnBackdropClick: boolean;
};

type UseDrawerReturn = {
	dialogRef: RefObject<HTMLDivElement | null>;
	present: boolean;
	closing: boolean;
	handleOverlayClick: () => void;
	handleDialogClick: (event: MouseEvent) => void;
	handleDialogKeyDown: (event: KeyboardEvent) => void;
	handlePanelAnimationEnd: (event: AnimationEvent<HTMLDivElement>) => void;
};

const resolvePhase = (isOpen: boolean, phase: DrawerPhase): DrawerPhase => {
	if (isOpen) return 'visible';
	if (phase === 'visible') return 'exiting';
	return phase;
};

export const useDrawer = ({
	isOpen,
	onClose,
	closeOnBackdropClick,
}: UseDrawerOptions): UseDrawerReturn => {
	const [phase, setPhase] = useState<DrawerPhase>(
		isOpen ? 'visible' : 'hidden'
	);

	const present = phase !== 'hidden';
	const closing = phase === 'exiting';

	const {
		dialogRef,
		handleOverlayClick,
		handleDialogClick,
		handleDialogKeyDown,
	} = useOverlayBehavior({ isOpen: present, onClose, closeOnBackdropClick });

	useEffect(() => {
		setPhase((current) => resolvePhase(isOpen, current));
	}, [isOpen]);

	const handlePanelAnimationEnd = useCallback(
		(event: AnimationEvent<HTMLDivElement>) => {
			if (event.target !== event.currentTarget) return;

			setPhase((current) => (current === 'exiting' ? 'hidden' : current));
		},
		[]
	);

	return {
		dialogRef,
		present,
		closing,
		handleOverlayClick,
		handleDialogClick,
		handleDialogKeyDown,
		handlePanelAnimationEnd,
	};
};
