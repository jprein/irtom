import { gsap } from 'gsap';
import { swapSlides } from '../util/slideVisibility';
import { sleep } from '../util/helpers';
import { hideTwoOptions } from '../util/hideTwoOptions';
import { showTwoOptions } from '../util/showTwoOptions';
import type { SvgInHtml } from '../types';
import {
	hideBlockingState,
	showBlockingState,
} from '../util/showOrHideBlockState';

export default async ({ currentSlide, previousSlide }) => {
	// Name of slide
	const slidePrefix = 's-pretense-a';

	// Store correct response
	data.procedure[data.currentSlide].correct = 'right';

	// Swap slides
	swapSlides(currentSlide, previousSlide);
	data.simpleSlideCounter++;

	// Trial-specific animation
	// Get all relevant elements
	const boyFront = document.getElementById(
		`link-${slidePrefix}-${data.community}-boy-front`,
	) as SvgInHtml;
	const boyWithCycle = document.getElementById(
		`link-${slidePrefix}-${data.community}-boy-bike`,
	) as SvgInHtml;
	const girlFront = document.getElementById(
		`link-${slidePrefix}-${data.community}-girl-front`,
	) as SvgInHtml;
	const girlWithSpringBike = document.getElementById(
		`link-${slidePrefix}-${data.community}-girl-springbike`,
	) as SvgInHtml;

	// Define animation function
	async function showAnimation() {
		gsap.set([girlFront, boyWithCycle, boyFront, girlWithSpringBike], {
			autoAlpha: 0,
			x: 0,
		});
		gsap.set([boyFront, girlFront], {
			autoAlpha: 1,
			x: 0,
		});

		await data.sprite.playPromise(`${slidePrefix}-1`);

		await gsap
			.timeline()
			.to(boyFront, {
				onStart: () => {
					data.sprite.play(`${slidePrefix}-2`);
				},
			})
			.to(boyFront, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-2`][1] / 1000,
				autoAlpha: 0,
				duration: 0.1,
			})
			.to(
				boyWithCycle,
				{
					autoAlpha: 1,
					duration: 0.1,
				},
				'<',
			)
			.to(girlFront, {
				onStart: () => {
					data.sprite.play(`${slidePrefix}-3`);
				},
			})
			.to(girlFront, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-3`][1] / 1000,
				autoAlpha: 0,
				duration: 0.1,
			})
			.to(
				girlWithSpringBike,
				{
					autoAlpha: 1,
					duration: 0.1,
				},
				'<',
			);
	}
	// In beginning, hide response options
	await hideTwoOptions(slidePrefix);
	await hideBlockingState(slidePrefix);

	// Show animation
	await showAnimation();

	// Short break before showing response options
	await sleep(500);

	// Show left/right response options and store participant response
	const stopBlockingState = await showTwoOptions(slidePrefix);
	if (!stopBlockingState) await showBlockingState(slidePrefix);
};
