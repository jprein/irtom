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
	// response stores what participant likes (left or right), boy agent always likes the opposite
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
	//gsap.set(girl, { x: 1200 });
	gsap.set([girlNay, girlYay], { autoAlpha: 0 });

	// For the case that Max doesn't like the cracker but the cucumber
	//if (naySide === 'left') {
	await data.sprite.playPromise(`${slidePrefix}-${naySide}-nay`);
	// Max first tries the cracker on the left
	await gsap
		.timeline()
		.to(girl, {
			autoAlpha: 0,
			duration: 0.1,
		})
		.to(
			girlYay,
			{
				//delay: data.spriteJSON.sprite[`${slidePrefix}-2`][1] / 1000,
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
				//delay: data.spriteJSON.sprite[`${slidePrefix}-2`][1] / 1000,
				autoAlpha: 0,
				duration: 0.1,
			},
			'<',
		);

	await sleep(1000);

	// Show left/right response options and store participant response
	await showTwoOptions(slidePrefix);
};
