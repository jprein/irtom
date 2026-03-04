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
import { on } from 'events';

export default async ({ currentSlide, previousSlide }) => {
	// Name of slide
	const slidePrefix = 's-falsebelief-col-a';

	// Store correct response
	data.procedure[data.currentSlide].correct = 'right';
	data.procedure[data.currentSlide].dimension = 'falsebelief';
	data.procedure[data.currentSlide].analyse = true;

	// Swap slides
	swapSlides(currentSlide, previousSlide);
	data.simpleSlideCounter++;

	// Trial-specific animation
	// Get all relevant elements
	const girl = document.getElementById(
		`link-${slidePrefix}-${data.community}-girl`,
	) as SvgInHtml;
	const girlKneeling = document.getElementById(
		`link-${slidePrefix}-${data.community}-girl-kneeling`,
	) as SvgInHtml;
	const dogRunning = document.getElementById(
		`link-${slidePrefix}-dog-running`,
	) as SvgInHtml;
	const dogLying = document.getElementById(
		`link-${slidePrefix}-dog-lying`,
	) as SvgInHtml;

	// Define animation function
	async function showAnimation() {
		// Initially hide some agent elements
		gsap.set([girlKneeling, dogLying], {
			autoAlpha: 0,
			x: 0,
		});
		gsap.set(girl, {
			autoAlpha: 1,
			x: 0,
		});
		gsap.set(dogRunning, { autoAlpha: 1, x: 1200 });

		// Play initial audio
		// await data.sprite.playPromise(`${slidePrefix}-1`);

		// Animation sequence
		const tl = await gsap.timeline();
		tl.to(dogRunning, {
			onStart: () => {
				data.sprite.play(`${slidePrefix}-1`);
			},
		})
			.to(dogRunning, {
				delay: 1.5,
				x: 0,
				duration: 2,
			})
			.to(dogRunning, {
				delay: 1,
				autoAlpha: 0,
				duration: 0.1,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-2`);
				},
			})
			.to(dogLying, { autoAlpha: 1, duration: 0.1 }, '<')
			.to(girl, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-2`][1] / 1000 + 1,
				autoAlpha: 0,
				duration: 0.1,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-3`);
				},
			})
			.to(girlKneeling, { autoAlpha: 1, duration: 0.1 }, '<')
			.to(dogLying, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-3`][1] / 1000,
				autoAlpha: 0,
				duration: 0.5,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-4`);
				},
			})
			.to(girlKneeling, { delay: 1, autoAlpha: 0, duration: 0.1 })
			.to(girl, { autoAlpha: 1, duration: 0.1 }, '<')
			.to(girl, {
				delay: 2,
				x: -1200,
				duration: 2,
			})
			.to(dogLying, {
				onStart: () => {
					data.sprite.play(`${slidePrefix}-5`);
				},
			})
			.to(dogLying, {
				delay: 1,
				autoAlpha: 1,
				duration: 0.1,
			})
			.to(dogLying, {
				delay: 2,
				autoAlpha: 0,
				duration: 0.1,
			})
			.to(dogRunning, { autoAlpha: 1, duration: 0.1 }, '<')
			.to(dogRunning, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-5`][1] / 1000 - 3,
				x: -550,
				duration: 2,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-6`);
				},
			})
			.to(dogRunning, {
				delay: 1.5,
				autoAlpha: 0,
				duration: 0.1,
			})
			.to(dogLying, { autoAlpha: 1, x: -630, duration: 0 }, '<')
			.to(dogLying, {
				delay: 1.5,
				autoAlpha: 0,
				duration: 0.1,
			});

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
