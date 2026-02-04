import type { SvgInHtml } from '../../src/types';
import { sleep } from '../../src/util/helpers';
import { hideTwoOptions } from '../../src/util/hideTwoOptions';
import { showTwoOptions } from '../../src/util/showTwoOptions';
import { swapSlides } from '../../src/util/slideVisibility';
import { gsap } from 'gsap';
import { hideBlockingState } from '../util/showOrHideBlockState';

export default async ({ currentSlide, previousSlide }) => {
	// Name of slide
	const slidePrefix = 's-diversebeliefs-a';

	// Store correct response
	data.procedure[data.currentSlide].correct = '';

	// Swap slides
	swapSlides(currentSlide, previousSlide);
	data.simpleSlideCounter++;

	// Get relevant elements
	const dog = document.getElementById(`link-${slidePrefix}-dog`) as SvgInHtml;

	// Define animation function
	async function showAnimation() {
		gsap.set(dog, { autoAlpha: 1 });
		await data.sprite.playPromise(`${slidePrefix}-1`);
		await gsap.timeline().to(dog, {
			autoAlpha: 0,
			duration: 1,
		});
	}

	// In beginning, hide response options
	await hideTwoOptions(slidePrefix);
	await hideBlockingState(slidePrefix);

	// Show animation
	await showAnimation();

	// Short break before showing response options
	await sleep(1000);

	// Show response options
	await showTwoOptions(slidePrefix);
	//await showBlockingState(slidePrefix);
};
