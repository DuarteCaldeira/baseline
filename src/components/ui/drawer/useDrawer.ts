import {
	useCallback,
	useEffect,
	useState,
	type AnimationEvent,
	type KeyboardEvent,
	type MouseEvent,
	type RefObject,
} from 'react';

import { useModal } from '@/components/ui/modal/useModal';

type DrawerPhase = 'hidden' | 'visible' | 'exiting';

type UseDrawerOptions = {
	isOpen: boolean;
	onClose: () => void;
	closeOnBackdropClick: boolean;
};

type UseDrawerReturn = {
	dialogRef: RefObject<HTMLDivElement>;
	present: boolean;
	closing: boolean;
	handleOverlayClick: () => void;
	handleDialogClick: (e: MouseEvent) => void;
	handleDialogKeyDown: (e: KeyboardEvent) => void;
	handlePanelAnimationEnd: (e: AnimationEvent<HTMLDivElement>) => void;
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
	const [phase, setPhase] = useState<DrawerPhase>(isOpen ? 'visible' : 'hidden');

	const present = phase !== 'hidden';
	const closing = phase === 'exiting';

	const {
		dialogRef,
		handleOverlayClick,
		handleDialogClick,
		handleDialogKeyDown,
	} = useModal({ isOpen: present, onClose, closeOnBackdropClick });

	useEffect(() => {
		setPhase((current) => resolvePhase(isOpen, current));
	}, [isOpen]);

	const handlePanelAnimationEnd = useCallback(
		(e: AnimationEvent<HTMLDivElement>) => {
			if (e.target !== e.currentTarget) return;

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
