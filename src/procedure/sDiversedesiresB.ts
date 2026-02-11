import { gsap } from 'gsap';
import type { SvgInHtml } from '../../src/types';
import { swapSlides } from '../../src/util/slideVisibility';
import { hideTwoOptions } from '../../src/util/hideTwoOptions';
import { showTwoOptions } from '../../src/util/showTwoOptions';
import { sleep } from '../../src/util/helpers';
import {
	hideBlockingState,
	showBlockingState,
} from '../util/showOrHideBlockState';

export default async ({ currentSlide, previousSlide }) => {
	// Name of slide
	const slidePrefix = 's-diversedesires-b';

	// Store correct response
	data.procedure[data.currentSlide].correct = 'right';

	// Swap slides
	swapSlides(currentSlide, previousSlide);
	data.simpleSlideCounter++;

	// Trial-specific animation
	// Get all relevant elements
	const girl = document.getElementById(
		`link-${slidePrefix}-${data.community}-girl`,
	) as SvgInHtml;
	const girlYay = document.getElementById(
		`link-${slidePrefix}-${data.community}-girl-yay`,
	) as SvgInHtml;
	const girlNay = document.getElementById(
		`link-${slidePrefix}-${data.community}-girl-nay`,
	) as SvgInHtml;
	const boy = document.getElementById(
		`link-${slidePrefix}-${data.community}-boy`,
	) as SvgInHtml;
	const boyNay = document.getElementById(
		`link-${slidePrefix}-${data.community}-boy-nay`,
	) as SvgInHtml;
	const boyYay = document.getElementById(
		`link-${slidePrefix}-${data.community}-boy-yay`,
	) as SvgInHtml;
	const carrot = document.getElementById(`${slidePrefix}-carrot`) as SvgInHtml;

	// Define animation function
	async function showAnimation() {
		// Initially hide some agent elements
		gsap.set(boy, { x: -1200 });
		gsap.set(girl, { x: 1200 });
		gsap.set([girlYay, girlNay, boyYay, boyNay], { opacity: 0 });
		gsap.set(carrot, { autoAlpha: 1 });

		// Play initial audio
		await data.sprite.playPromise(`${slidePrefix}-1`);
		// Animation sequence
		const tl = await gsap.timeline();
		tl.to(girl, {
			x: 0,
			duration: 2,
		})
			.to(girl, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-2`][1] / 1000 - 2,
				autoAlpha: 1,
				duration: 0.1,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-2`);
				},
			})
			.to(girlYay, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-3`][1] / 1000 + 1,
				autoAlpha: 1,
				duration: 0.1,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-3`);
				},
			})
			.to(girl, { autoAlpha: 0, duration: 0.1 }, '<')
			.to(girlYay, {
				delay: 3,
				autoAlpha: 0,
				duration: 0.1,
			})
			.to(girl, { autoAlpha: 1, duration: 0.1 }, '<')
			.to(girlNay, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-4`][1] / 1000,
				autoAlpha: 1,
				duration: 0.1,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-4`);
				},
			})
			.to(girl, { autoAlpha: 0, duration: 0.1 }, '<')
			.to(girlNay, {
				delay: 2,
				autoAlpha: 0,
				duration: 0.1,
			})
			.to(girl, { autoAlpha: 1, duration: 0.1 }, '<')
			.to(girl, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-5`][1] / 1000,
				x: -1200,
				duration: 2,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-5`);
				},
			})
			.to(boy, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-6`][1] / 1000,
				x: 0,
				duration: 2,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-6`);
				},
			})
			.to(boy, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-7`][1] / 1000,
				autoAlpha: 1,
				duration: 0.1,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-7`);
				},
			})
			.to(boyNay, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-8`][1] / 1000,
				autoAlpha: 1,
				duration: 0.1,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-8`);
				},
			})
			.to(boy, { autoAlpha: 0, duration: 0.1 }, '<')
			.to(boyNay, {
				delay: 2,
				autoAlpha: 0,
				duration: 0.1,
			})
			.to(boy, { autoAlpha: 1, duration: 0.1 }, '<')
			.to(boyYay, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-9`][1] / 1000,
				autoAlpha: 1,
				duration: 0.1,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-9`);
				},
			})
			.to(boy, { autoAlpha: 0, duration: 0.1 }, '<')
			.to(boyYay, {
				delay: 2,
				autoAlpha: 0,
				duration: 0.1,
			})
			.to(boy, { autoAlpha: 1, duration: 0.1 }, '<')
			.to(boy, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-10`][1] / 1000,
				x: 1200,
				duration: 2,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-10`);
				},
			})
			.to(carrot, { delay: 2, autoAlpha: 0, duration: 0.1 });

		await tl.then();
		await sleep(500);
		tl.kill();
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
