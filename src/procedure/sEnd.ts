import { swapSlides } from '../../src/util/slideVisibility';
import { exitFullscreen } from '../../src/util/helpers';
import config from '../config.yaml';
import { gsap } from 'gsap';
import type { SvgInHtml } from '../../src/types';

const PROCEDURE_FINISHED_EVENT = 'irtom:procedure-finished';

export default async ({ currentSlide, previousSlide }) => {
	// swap slides automatically (don’t touch this)
	swapSlides(currentSlide, previousSlide);
	let procedureFinished = false;

	window.addEventListener(
		PROCEDURE_FINISHED_EVENT,
		() => {
			procedureFinished = true;
		},
		{ once: true }
	);

	data.procedure[data.currentSlide].dimension = 'training';
	data.procedure[data.currentSlide].analyse = false;

	const speaker = document.getElementById('link-s-end-speaker') as SvgInHtml;
	const nextButton = document.getElementById('link-s-end-next') as SvgInHtml;
	gsap.set(nextButton, { autoAlpha: 0, pointerEvents: 'none' });

	// Play audio and show next button on speaker click
	speaker.addEventListener(
		'click',
		async () => {
			if (!data.sprite?.playPromise) {
				if (config.devmode.on) {
					console.warn('Audio sprite is unavailable on s-end speaker click.');
				}
				return;
			}
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

	// Do not block the procedure loop on this slide.
	// Final data saving should start immediately when entering s-end.
	nextButton.addEventListener(
		'click',
		() => {
			if (!config.devmode.on) {
				exitFullscreen(data.isIOS);
			}

			if (procedureFinished) {
				window.location.href = './goodbye.html';
				return;
			}

			// Redirect only after the procedure emits its finalized event.
			window.addEventListener(
				PROCEDURE_FINISHED_EVENT,
				() => {
					window.location.href = './goodbye.html';
				},
				{ once: true }
			);
		},
		{ once: true }
	);
};
