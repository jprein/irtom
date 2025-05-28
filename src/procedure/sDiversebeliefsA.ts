import type { SvgInHtml } from '../types';
import { sleep } from '../util/helpers';
import { hideTwoOptions } from '../util/hideTwoOptions';
import { showTwoOptions } from '../util/showTwoOptions';
import { swapSlides } from '../util/slideVisibility';
import { gsap } from 'gsap';

export default async ({ currentSlide, previousSlide }) => {
	// Name of slide
	const slidePrefix = 's-diversebeliefs-a';

	// Store correct response
	data.procedure[data.currentSlide].correct = 'left';

	// Swap slides
	swapSlides(currentSlide, previousSlide);
	data.simpleSlideCounter++;

	// In beginning, hide response options
	await hideTwoOptions(slidePrefix);

	// Short break before showing response options
	await sleep(1000);

	const boy = document.getElementById(`${slidePrefix}-boy`) as SvgInHtml;
	await data.sprite.playPromise(`${slidePrefix}-1`);
	await gsap.timeline().to(boy, {
		autoAlpha: 0,
		duration: 1,
	});

	await showTwoOptions(slidePrefix);
};
