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
	// for dev mode if no previous slide / response exists, default to left
	const naySide =
		data.previousSlide && data.procedure[data.previousSlide]
			? data.procedure[data.previousSlide].response || 'left'
			: 'left';
	// yaySide is opposite, so where the girl thinks the boy hides
	const yaySide = naySide === 'left' ? 'right' : 'left';

	// Store correct response
	data.procedure[data.currentSlide].correct = yaySide;

	// Trial-specific animation
	// Get all relevant elements
	const girl = document.getElementById(
		`link-${slidePrefix}-${data.community}-girl`,
	) as SvgInHtml;
	const girlNay = document.getElementById(
		`link-${slidePrefix}-${data.community}-girl-${naySide}-pointing`,
	) as SvgInHtml;
	const girlYay = document.getElementById(
		`link-${slidePrefix}-${data.community}-girl-${yaySide}-pointing`,
	) as SvgInHtml;

	// Define animation function
	async function showAnimation() {
		// Initially hide some agent elements
		gsap.set([girlNay, girlYay], { autoAlpha: 0 });
		gsap.set(girl, { autoAlpha: 1, x: -1200 });

		await data.sprite.playPromise(`${slidePrefix}-1`);

		// await data.sprite.playPromise(`${slidePrefix}-${naySide}-nay`);
		await gsap
			.timeline()
			.to(girl, {
				delay: 0.5,
				x: 0,
				duration: 3,
				onComplete: () => {
					data.sprite.play(`${slidePrefix}-${naySide}-nay`);
				},
			})
			.to(girl, {
				delay:
					data.spriteJSON.sprite[`${slidePrefix}-${naySide}-nay`][1] / 1000,
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
	}

	// In beginning, hide response options
	await hideTwoOptions(slidePrefix);

	// Show animation
	await showAnimation();

	// Short break before response choices
	await sleep(1000);

	// Show left/right response options and store participant response
	await showTwoOptions(slidePrefix);
};
