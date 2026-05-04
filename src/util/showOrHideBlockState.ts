import type { SvgInHtml } from '../types';
import { hideNextOption, showNextOption } from './hideNextOption';
import { gsap } from 'gsap';

export const hideBlockingState = async () => {
	await hideNextOption();
	gsap.set(`#s-block`, { autoAlpha: 0 });
	const pauseParentBlock = document.getElementById('s-pause-state') as SvgInHtml;
	if ( pauseParentBlock) {
		pauseParentBlock.setAttribute('visibility', 'hidden');
	}
};
export const showBlockingState = async () => {
	const pauseParentBlock = document.getElementById('s-pause-state') as SvgInHtml;
	if ( pauseParentBlock) {
		pauseParentBlock.setAttribute('visibility', 'visible');
		gsap.set(`#s-block`, { autoAlpha: 1 });
		await showNextOption();
	}
};
