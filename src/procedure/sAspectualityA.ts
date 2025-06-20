import { gsap } from 'gsap';
import type { SvgInHtml } from '../types';
import { swapSlides } from '../util/slideVisibility';
import { sleep } from '../util/helpers';
import { hideTwoOptions } from '../util/hideTwoOptions';
import { showTwoOptions } from '../util/showTwoOptions';

export default async ({ currentSlide, previousSlide }) => {
	// Name of slide
	const slidePrefix = 's-aspectuality-a';

	// Store correct response
	data.procedure[data.currentSlide].correct = 'right';

	// Swap slides
	swapSlides(currentSlide, previousSlide);
	data.simpleSlideCounter++;

	// Trial-specific animation
	// Get all relevant elements
	const boy = document.getElementById(
		`link-${slidePrefix}-${data.community}-boy`,
	) as SvgInHtml;
	const boyLeft = document.getElementById(
		`link-${slidePrefix}-${data.community}-boy-left-standing`,
	) as SvgInHtml;
	const boyRight = document.getElementById(
		`link-${slidePrefix}-${data.community}-boy-right-standing`,
	) as SvgInHtml;
	const man = document.getElementById(
		`link-${slidePrefix}-${data.community}-man`,
	) as SvgInHtml;
	const manCook = document.getElementById(
		`link-${slidePrefix}-${data.community}-man-cook`,
	) as SvgInHtml;
	const manCookCut = document.getElementById(
		`link-${slidePrefix}-${data.community}-man-cook-cut`,
	) as SvgInHtml;
	const bubble = document.getElementById(
		`${slidePrefix}-thoughtbubble`,
	) as SvgInHtml;

	// Define animation function
	async function showAnimation() {
		// Initially hide some agent elements
		gsap.set([boyLeft, boyRight, manCook, manCookCut, bubble], {
			autoAlpha: 0,
			x: 0,
		});
		gsap.set([man], {
			autoAlpha: 1,
			x: 0,
			y: 0,
			scale: 1,
		});
		gsap.set(boy, { autoAlpha: 1, x: -1200 });

		// Play initial audio
		await data.sprite.playPromise(`${slidePrefix}-1`);

		// Animation sequence
		await gsap
			.timeline()
			.to([bubble, manCookCut], { autoAlpha: 1, duration: 0.1 })
			.to([bubble, manCookCut], {
				delay: 2,
				autoAlpha: 0,
				duration: 0.1,
				onComplete: () => {
					data.sprite.play(`${slidePrefix}-2`);
				},
			})
			.to(boy, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-2`][1] / 1000 - 2,
				x: 0,
				duration: 3,
				onComplete: () => {
					data.sprite.play(`${slidePrefix}-3`);
				},
			})
			.to(man, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-3`][1] / 1000,
				x: 710,
				y: 50,
				scale: 0.6,
				duration: 3,
			})
			.to(
				boy,
				{
					autoAlpha: 0,
					duration: 0.1,
				},
				'<+=0.5',
			)
			.to(boyRight, { autoAlpha: 1, duration: 0.1 }, '<')
			.to(man, {
				delay: 1,
				autoAlpha: 0,
				duration: 0.1,
				onComplete: () => {
					data.sprite.play(`${slidePrefix}-4`);
				},
			})
			.to(manCook, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-4`][1] / 1000,
				autoAlpha: 1,
				duration: 0.1,
				onComplete: () => {
					data.sprite.play(`${slidePrefix}-5`);
				},
			})
			.to(manCook, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-5`][1] / 1000,
				x: -950,
				duration: 3,
			})
			.to(boyRight, { autoAlpha: 0, duration: 0.1 }, '-=0.5')
			.to(boyLeft, { autoAlpha: 1, duration: 0.1 }, '<')
			.to(manCook, { delay: 1, autoAlpha: 0, duration: 0.1 })
			.to(boyLeft, { delay: 1, autoAlpha: 0, duration: 0.1 })
			.to(boy, { autoAlpha: 1, duration: 0.1 }, '<');
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
