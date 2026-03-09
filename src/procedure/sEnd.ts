import { swapSlides } from '../../src/util/slideVisibility';
import { exitFullscreen } from '../../src/util/helpers';
import config from '../config.yaml';
import { gsap } from 'gsap';
import type { SvgInHtml } from '../../src/types';

export default async ({ currentSlide, previousSlide }) => {
	// swap slides automatically (don’t touch this)
	swapSlides(currentSlide, previousSlide);

	data.procedure[data.currentSlide].dimension = 'training';
	data.procedure[data.currentSlide].analyse = false;

	const speaker = document.getElementById('link-s-end-speaker') as SvgInHtml;
	const nextButton = document.getElementById('link-s-end-next') as SvgInHtml;
	gsap.set(nextButton, { autoAlpha: 0, pointerEvents: 'none' });

	// Play audio and show next button on speaker click
	speaker.addEventListener(
		'click',
		async () => {
			await data.sprite.playPromise('s-end');

			// Keep this transition instant to avoid first-slide latency on slower devices.
			gsap.set(speaker, { autoAlpha: 0, pointerEvents: 'none' });
			gsap.set(nextButton, {
				autoAlpha: 1,
				pointerEvents: 'auto',
			});
		},
		{ once: true }
	);

	// Wait for the next button click before returning
	await new Promise<void>((resolve) => {
		nextButton.addEventListener(
			'click',
			() => {
				if (!config.devmode.on) {
					exitFullscreen(data.isIOS);
				}
				window.location.href = './goodbye.html';
				resolve();
			},
			{ once: true }
		);
	});
};
