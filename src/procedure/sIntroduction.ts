import { gsap } from 'gsap';
import { swapSlides } from '../../src/util/slideVisibility';
import { getResponse } from '../../src/util/getResponse';
import type { SvgInHtml } from '../../src/types';
import { isPauseResponse } from '../util/pauseControls';

export default async ({ currentSlide, previousSlide }) => {
	data.procedure[data.currentSlide].dimension = 'training';
	data.procedure[data.currentSlide].analyse = false;

	// show slide
	swapSlides(currentSlide, previousSlide);

	//const audio = document.getElementById('audio') as HTMLMediaElement;
	const speaker = document.getElementById(
		'link-s-introduction-speaker'
	) as SvgInHtml;
	const nextButton = document.getElementById(
		'link-s-introduction-next'
	) as SvgInHtml;
	gsap.set(nextButton, { autoAlpha: 0, pointerEvents: 'none' });

	speaker.addEventListener(
		'click',
		async () => {
			await data.sprite.playPromise('s-introduction');

			// Keep this transition instant to avoid first-slide latency on slower devices.
			gsap.set(speaker, { autoAlpha: 0, pointerEvents: 'none' });
			gsap.set(nextButton, {
				autoAlpha: 1,
				pointerEvents: 'auto',
			});
		},
		{ once: true }
	);

	const response = await getResponse(nextButton.id);
	if (isPauseResponse(response)) {
		return;
	}
};
