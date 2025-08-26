import { swapSlides } from '../util/slideVisibility';
import { sleep } from '../util/helpers';
import { hideTwoOptions } from '../util/hideTwoOptions';
import { showTwoOptions } from '../util/showTwoOptions';
import type { SvgInHtml } from '../types';
import gsap from 'gsap';

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
				delay: data.spriteJSON.sprite[`${slidePrefix}-2`][1] / 1000,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-2`);
				},
			})
			.to(boyFront, {
				autoAlpha: 0,
				duration: 0.5,
			})
			.to(
				boyWithCycle,
				{
					autoAlpha: 1,
					duration: 0.5,
				},
				'<',
			)
			.to(girlFront, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-3`][1] / 1000,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-3`);
				},
			})
			.to(girlFront, {
				autoAlpha: 0,
				duration: 0.5,
			})
			.to(
				girlWithSpringBike,
				{
					autoAlpha: 1,
					duration: 0.5,
				},
				'<',
			);

		await sleep(2000);
	}
	// In beginning, hide response options
	await hideTwoOptions(slidePrefix);

	// Show animation
	await showAnimation();

	// Short break before showing response options
	await sleep(1000);

	// Show left/right response options and store participant response
	await showTwoOptions(slidePrefix);
};
