import { hideNextOption, showNextOption } from './hideNextOption';
import { gsap } from 'gsap';

export const hideBlockingState = async (slidePrefix: string) => {
	await hideNextOption(slidePrefix);
	gsap.set(`#${slidePrefix}-block`, { autoAlpha: 0 });
};
export const showBlockingState = async (slidePrefix: string) => {
	gsap.set(`#${slidePrefix}-block`, { autoAlpha: 1 });
	await showNextOption(slidePrefix);
};
