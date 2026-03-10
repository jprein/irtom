import { gsap } from 'gsap';
import { swapSlides } from '../util/slideVisibility';
import { sleep } from '../util/helpers';
import type { SvgInHtml } from '../types';
import { showYesNoChoice } from '../util/showYesNoChoice';
import { hideYesNoChoice } from '../util/hideYesNoChoice';
import {
	hideBlockingState,
	showBlockingState,
} from '../util/showOrHideBlockState';

export default async ({ currentSlide, previousSlide }) => {
	// Name of slide
	const slidePrefix = 's-deception-a';
	const choicePrefix = 's-yesnochoice';

	// Store correct response
	data.procedure[data.currentSlide].correct = 'no';
	data.procedure[data.currentSlide].dimension = 'deception';
	data.procedure[data.currentSlide].analyse = true;

	// Swap slides
	swapSlides(currentSlide, previousSlide);
	data.simpleSlideCounter++;

	// Trial-specific animation
	// Get all relevant elements
	const girl = document.getElementById(
		`link-${slidePrefix}-${data.community}-girl`
	) as SvgInHtml;
	const boy = document.getElementById(
		`link-${slidePrefix}-${data.community}-boy`
	) as SvgInHtml;
	const girlSpeaking = document.getElementById(
		`link-${slidePrefix}-${data.community}-girl-speaking`
	) as SvgInHtml;
	const girlAngry = document.getElementById(
		`link-${slidePrefix}-${data.community}-girl-front-angry`
	) as SvgInHtml;
	const woman = document.getElementById(
		`link-${slidePrefix}-${data.community}-woman`
	) as SvgInHtml;
	const womanPointing = document.getElementById(
		`link-${slidePrefix}-${data.community}-woman-pointing`
	) as SvgInHtml;
	const cake = document.getElementById(
		`${slidePrefix}-cake-plate`
	) as SvgInHtml;

	// Define animation function
	async function showAnimation() {
		gsap.set([womanPointing, girlSpeaking, girlAngry], {
			autoAlpha: 0,
		});

		gsap.set([girl, cake], {
			autoAlpha: 1,
		});

		gsap.set([boy], { autoAlpha: 1, x: +1200 });
		gsap.set([woman], { autoAlpha: 1, x: +1200 });

		await data.sprite.playPromise(`${slidePrefix}-1`);

		const tl = await gsap.timeline();
		tl.to(woman, {
			delay: 0.5,
			x: 0,
			duration: 2,
			onStart: () => {
				data.sprite.play(`${slidePrefix}-2`);
			},
		})
			.to(womanPointing, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-2`][1] / 1000 - 2,
				autoAlpha: 1,
				duration: 0.1,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-3`);
				},
			})
			.to(woman, { autoAlpha: 0, duration: 0.1 }, '<')
			.to(woman, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-3`][1] / 1000,
				autoAlpha: 1,
				duration: 0.1,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-4`);
				},
			})
			.to(womanPointing, { autoAlpha: 0, duration: 0.1 }, '<')
			.to(girlAngry, { autoAlpha: 1, duration: 0.1 }, '<')
			.to(girl, { autoAlpha: 0, duration: 0.1 }, '<')
			.to(woman, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-4`][1] / 1000 + 0.5,
				x: +1200,
				duration: 2,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-5`);
				},
			})
			.to(girlAngry, { autoAlpha: 0, duration: 0 }, '<')
			.to(girl, { autoAlpha: 1, duration: 0 }, '<')
			.to(girl, { x: -1200, duration: 2 }, '<')
			.to(girl, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-5`][1] / 1000,
				x: 0,
				duration: 2,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-6`);
				},
			})
			.to(cake, { autoAlpha: 0, duration: 0 }, '<')
			.to(boy, { x: 0, duration: 2 }, '<')
			.to(boy, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-6`][1] / 1000 - 1.5,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-7`);
				},
			})
			.to(girl, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-7`][1] / 1000,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-8`);
				},
			})
			.to(girlSpeaking, { autoAlpha: 1, duration: 0.1 })
			.to(girl, { autoAlpha: 0, duration: 0.1 }, '<')
			.to(girlSpeaking, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-8`][1] / 1000 - 0.5,
				autoAlpha: 0,
				duration: 0.1,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-9`);
				},
			})
			.to(girl, { autoAlpha: 1, duration: 0.1 }, '<');

		await tl.then();
		await sleep(1000);
		tl.kill();
	}
	// In beginning, hide response options
	await hideYesNoChoice(choicePrefix);
	await hideBlockingState(slidePrefix);

	// Show animation
	await showAnimation();

	// Short break before showing response options
	await sleep(500);

	// Show left/right response options and store participant response
	const stopBlockingState = await showYesNoChoice(slidePrefix, choicePrefix);
	if (!stopBlockingState) await showBlockingState(slidePrefix);
};
