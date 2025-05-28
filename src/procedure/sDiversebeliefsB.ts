import { gsap } from 'gsap';
import type { SvgInHtml } from '../types';
import { swapSlides } from '../util/slideVisibility';
import { sleep } from '../util/helpers';
import { hideTwoOptions } from '../util/hideTwoOptions';
import { showTwoOptions } from '../util/showTwoOptions';

export default async ({ currentSlide, previousSlide }) => {
	// Name of slide
	const slidePrefix = 's-diversebeliefs-b';

	// Swap slides
	swapSlides(currentSlide, previousSlide);
	data.simpleSlideCounter++;

	// Get response from previous slide with interactive choice
	// response stores what participant chose (left or right)
	// code naySide as the side that the participant chose, so the girl DOES NOT think the boy is there
	// yaySide is opposite, so where the girl thinks the boy hides
	const naySide = data.procedure[data.previousSlide].response;
	const yaySide = naySide === 'left' ? 'right' : 'left';

	// Store correct response
	data.procedure[data.currentSlide].correct = yaySide;

	// In beginning, hide response options
	await hideTwoOptions(slidePrefix);

	// Trial-specific animation
	gsap.defaults({ ease: 'none' });

	// Get all relevant elements
	const girl = document.getElementById(`${slidePrefix}-girl`) as SvgInHtml;
	const girlNay = document.getElementById(
		`${slidePrefix}-girl-${naySide}`,
	) as SvgInHtml;
	const girlYay = document.getElementById(
		`${slidePrefix}-girl-${yaySide}`,
	) as SvgInHtml;

	// Initially hide some agent elements
	gsap.set([girlNay, girlYay], { autoAlpha: 0 });

	await data.sprite.playPromise(`${slidePrefix}-${naySide}-nay`);
	await gsap
		.timeline()
		.to(girl, {
			autoAlpha: 0,
			duration: 0.1,
		})
		.to(
			girlYay,
			{
				autoAlpha: 1,
				duration: 0.1,
			},
			'<',
		)
		.to(girl, {
			delay: 1,
			autoAlpha: 1,
			duration: 0.1,
		})
		.to(
			girlYay,
			{
				autoAlpha: 0,
				duration: 0.1,
			},
			'<',
		);

	await sleep(1000);

	// Show left/right response options and store participant response
	await showTwoOptions(slidePrefix);
};
