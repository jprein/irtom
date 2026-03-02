import type { SvgInHtml } from '../types';
import { gsap } from 'gsap';

export const addSpinner = async () => {
	const parentBlock = document.getElementById(
		's-blocking-state',
	) as SvgInHtml | null;
	if (!parentBlock) return;
	parentBlock.removeAttribute('visibility');

	gsap.set('#link-leuphana-cube', {
		transformOrigin: '50% 50%',
	});
	gsap.to('#link-leuphana-cube', {
		id: 'blocking-state-animation',
		duration: 1,
		rotation: 360,
		repeat: -1,
		ease: 'none',
	});
};

export const hideSpinner = async () => {
	const parentBlock = document.getElementById(
		's-blocking-state',
	) as SvgInHtml | null;
	if (!parentBlock) return;
	parentBlock.removeAttribute('visibility');

	const blockingStateAnimation = gsap.getById('blocking-state-animation');
	if (blockingStateAnimation) blockingStateAnimation.kill();
	parentBlock.setAttribute('visibility', 'hidden');
};
