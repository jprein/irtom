import { gsap } from 'gsap';
import type { SvgInHtml } from '../types';
import { getResponse } from './getResponse';
import {
	hidePauseButton,
	isPauseResponse,
	setPauseControlContext,
	showPauseButton,
} from './pauseControls';

export const hideNextOption = async (slidePrefix: string) => {
	const nextButton = document.getElementById(
		`link-${slidePrefix}-next`
	) as SvgInHtml;

	setPauseControlContext(slidePrefix);
	hidePauseButton();
	gsap.set(nextButton, {
		autoAlpha: 0,
		pointerEvents: 'none',
	});
};

export const showNextOption = async (slidePrefix: string) => {
	const nextButton = document.getElementById(
		`link-${slidePrefix}-next`
	) as SvgInHtml;

	setPauseControlContext(slidePrefix);
	await gsap.timeline().set(nextButton, {
		delay: 0.2,
		autoAlpha: 1,
		duration: 0.1,
		pointerEvents: 'visible',
		cursor: 'pointer',
	});

	showPauseButton();
	const response = await getResponse(nextButton.id);
	setPauseControlContext(null);
	hidePauseButton();
	if (isPauseResponse(response)) {
		return;
	}
};
