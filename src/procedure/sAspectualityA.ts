import { gsap } from 'gsap';
import type { SvgInHtml } from '../types';
import { swapSlides } from '../util/slideVisibility';
import { sleep } from '../util/helpers';
import { hideTwoOptions } from '../util/hideTwoOptions';
import { showTwoOptions } from '../util/showTwoOptions';
import {
	hideBlockingState,
	showBlockingState,
} from '../util/showOrHideBlockState';

export default async ({ currentSlide, previousSlide }) => {
	// Name of slide
	const slidePrefix = 's-aspectuality-a';

	// Store correct response
	data.procedure[data.currentSlide].correct = 'right';
	data.procedure[data.currentSlide].dimension = 'aspectuality';
	data.procedure[data.currentSlide].analyse = true;

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
	const boyWaving = document.getElementById(
		`link-${slidePrefix}-${data.community}-boy-left-waving`,
	) as SvgInHtml;
	const boyRight = document.getElementById(
		`link-${slidePrefix}-${data.community}-boy-right-standing`,
	) as SvgInHtml;
	const woman = document.getElementById(
		`link-${slidePrefix}-${data.community}-woman`,
	) as SvgInHtml;
	const womanDoctor = document.getElementById(
		`link-${slidePrefix}-${data.community}-woman-doctor`,
	) as SvgInHtml;

	// Define animation function
	async function showAnimation() {
		// Initially hide some agent elements
		gsap.set([boy, boyLeft, boyWaving, boyRight, womanDoctor], {
			autoAlpha: 0,
			x: 0,
		});
		gsap.set([womanDoctor], {
			autoAlpha: 1,
			x: 0,
			y: 0,
			scale: 1,
		});
		gsap.set(boy, { autoAlpha: 1, x: -1200 });
		gsap.set(woman, { scale: 1, x: 15, y: 30, autoAlpha: 0 });

		// Play initial audio
		await data.sprite.playPromise(`${slidePrefix}-1`);

		// Animation sequence
		const tl = await gsap.timeline();

		tl.to(boy, {
			delay: 1.5,
			x: 0,
			duration: 2,
			onStart: () => {
				data.sprite.play(`${slidePrefix}-2`);
			},
		})
			.to(womanDoctor, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-2`][1] / 1000,
				x: -350,
				y: 200,
				scale: 0.5,
				duration: 2,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-3`);
				},
			})
			.to(boy, {
				delay: 0.5,
				autoAlpha: 0,
				duration: 0.1,
			})
			.to(boyLeft, { autoAlpha: 1, duration: 0.1 }, '<')
			.to(womanDoctor, {
				delay: 1,
				autoAlpha: 0,
				duration: 0.1,
			})
			.to(boyLeft, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-3`][1] / 1000 - 0.5,
				autoAlpha: 1,
				duration: 0.1,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-4`);
				},
			})
			.to(woman, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-4`][1] / 1000 + 0.5,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-5`);
				},
			})
			.to(woman, {
				delay: 2,
				autoAlpha: 1,
				duration: 0.1,
			})
			.to(woman, {
				delay: 1,
				scale: 1.7,
				x: 300,
				y: -100,
				duration: 2,
			})
			.to(woman, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-5`][1] / 1000 - 3.5,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-6`);
				},
			})
			.to(boyLeft, {
				delay: 1,
				autoAlpha: 0,
				duration: 0.1,
			})
			.to(boyWaving, { autoAlpha: 1, duration: 0.1 }, '<')
			.to(boyWaving, {
				delay: 1,
				autoAlpha: 0,
				duration: 0.1,
			})
			.to(boyLeft, { autoAlpha: 1, duration: 0.1 }, '<')
			.to(woman, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-6`][1] / 1000 - 1,
				x: 1150,
				y: -50,
				scale: 0.8,
				duration: 2.5,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-7`);
				},
			})
			.to(boyRight, { autoAlpha: 1, duration: 0.1 }, '-=2')
			.to(boyLeft, { autoAlpha: 0, duration: 0.1 }, '<')
			.to(woman, { delay: 1, autoAlpha: 0, duration: 0.1 })
			.to(boyRight, { delay: 0, autoAlpha: 0, duration: 0.1 })
			.to(boy, { autoAlpha: 1, duration: 0.1 }, '<');

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
