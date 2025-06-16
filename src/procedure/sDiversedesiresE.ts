import { gsap } from 'gsap';
import type { SvgInHtml } from '../types';
import { swapSlides } from '../util/slideVisibility';
import { sleep } from '../util/helpers';
import { hideTwoOptions } from '../util/hideTwoOptions';
import { showTwoOptions } from '../util/showTwoOptions';

export default async ({ currentSlide, previousSlide }) => {
	// Name of slide
	const slidePrefix = 's-diversedesires-e';

	// Store correct response
	data.procedure[data.currentSlide].correct = 'right';

	// Swap slides
	swapSlides(currentSlide, previousSlide);
	data.simpleSlideCounter++;

	// Get all relevant elements
	const boy = document.getElementById(
		`link-${slidePrefix}-${data.community}-boy`,
	) as SvgInHtml;
	const boyNay = document.getElementById(
		`link-${slidePrefix}-${data.community}-boy-nay`,
	) as SvgInHtml;
	const boyYay = document.getElementById(
		`link-${slidePrefix}-${data.community}-boy-yay`,
	) as SvgInHtml;

	// Define animation function
	async function showAnimation() {
		// Initially hide some agent elements
		gsap.set(boy, { x: 1200 });
		gsap.set([boyYay, boyNay], { opacity: 0 });

		// Play initial audio
		await data.sprite.playPromise(`${slidePrefix}-1`);

		// Animation sequence
		await gsap
			.timeline()
			.to(boy, {
				x: 0,
				duration: 3,
				onComplete: () => {
					data.sprite.play(`${slidePrefix}-2`);
				},
			})
			.to(boy, {
				delay: 0.5,
				autoAlpha: 0,
				duration: 0.1,
			})
			.to(
				boyNay,
				{
					autoAlpha: 1,
					duration: 0.1,
				},
				'<',
			)
			.to(boyNay, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-2`][1] / 1000,
				autoAlpha: 0,
				duration: 0.1,
			})
			.to(boy, { autoAlpha: 1, duration: 0.1 }, '<')
			.to(boy, {
				delay: 1,
				autoAlpha: 0,
				duration: 0.1,
				onComplete: () => {
					data.sprite.play(`${slidePrefix}-3`);
				},
			})
			.to(
				boyYay,
				{
					autoAlpha: 1,
					duration: 0.1,
				},
				'<',
			)
			.to(boyYay, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-3`][1] / 1000 + 1,
				autoAlpha: 0,
				duration: 0.1,
				onComplete: () => {
					data.sprite.play(`${slidePrefix}-4`);
				},
			})
			.to(boy, { autoAlpha: 1, duration: 0.1 }, '<')
			.to(boy, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-4`][1] / 1000,
				x: -1200,
				duration: 3,
			});
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
