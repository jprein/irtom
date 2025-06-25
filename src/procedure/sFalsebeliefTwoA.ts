import { gsap } from 'gsap';
import type { SvgInHtml } from '../types';
import { swapSlides } from '../util/slideVisibility';
import { sleep } from '../util/helpers';
import { hideTwoOptions } from '../util/hideTwoOptions';
import { showTwoOptions } from '../util/showTwoOptions';

export default async ({ currentSlide, previousSlide }) => {
	// Name of slide
	const slidePrefix = 's-falsebelief-two-a';

	// Store correct response
	data.procedure[data.currentSlide].correct = 'left';

	// Swap slides
	swapSlides(currentSlide, previousSlide);
	data.simpleSlideCounter++;

	// Trial-specific animation
	// Get all relevant elements
	const girl = document.getElementById(
		`link-${slidePrefix}-${data.community}-girl`,
	) as SvgInHtml;
	const girlHiding = document.getElementById(
		`link-${slidePrefix}-${data.community}-girl-hiding`,
	) as SvgInHtml;
	const girlClimbing = document.getElementById(
		`link-${slidePrefix}-${data.community}-girl-climbing`,
	) as SvgInHtml;
	const boy = document.getElementById(
		`link-${slidePrefix}-${data.community}-boy`,
	) as SvgInHtml;
	const boySlightRight = document.getElementById(
		`link-${slidePrefix}-${data.community}-boy-slightright`,
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
		gsap.set([girlHiding, girlClimbing, boySlightRight, dogLying], {
			autoAlpha: 0,
			x: 0,
		});
		gsap.set([girl, boy], {
			autoAlpha: 1,
			x: 0,
		});
		gsap.set(dogRunning, { x: -1200, autoAlpha: 1 });

		// Play initial audio
		await data.sprite.playPromise(`${slidePrefix}-1`);

		// Animation sequence
		await gsap
			.timeline()
			.to(dogRunning, {
				x: 0,
				duration: 3,
				onComplete: () => {
					data.sprite.play(`${slidePrefix}-2`);
				},
			})
			.to(dogRunning, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-2`][1] / 1000 - 0.5,
				autoAlpha: 0,
				duration: 0.1,
			})
			.to(dogLying, { autoAlpha: 1, duration: 0.1 }, '<')
			.to(dogLying, {
				delay: 1,
				autoAlpha: 0,
				duration: 0.5,
				onComplete: () => {
					data.sprite.play(`${slidePrefix}-3`);
				},
			})
			.to(girl, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-3`][1] / 1000,
				x: -1200,
				duration: 3,
			})
			.to(
				boy,
				{
					x: 1200,
					duration: 3,
					onComplete: () => {
						data.sprite.play(`${slidePrefix}-4`);
					},
				},
				'<',
			)
			.to(girl, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-4`][1] / 1000 - 3,
				x: -600,
				duration: 2,
			})
			.to(girl, { delay: 1, autoAlpha: 0, duration: 0.1 })
			.to(girlClimbing, { autoAlpha: 1, duration: 0.1 }, '<')
			.to(girlClimbing, { delay: 1, autoAlpha: 0, duration: 0.1 })
			.to(girlHiding, { autoAlpha: 1, duration: 0.1 }, '<')
			.to(girlHiding, {
				delay: 1,
				autoAlpha: 0,
				duration: 0.1,
				onComplete: () => {
					data.sprite.play(`${slidePrefix}-5`);
				},
			})
			.to(boy, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-5`][1] / 1000 - 1,
				x: -300,
				duration: 3,
			})
			.to(boy, { delay: 1, autoAlpha: 0, duration: 0.1 })
			.to(
				boySlightRight,
				{
					autoAlpha: 1,
					duration: 0.1,
					onComplete: () => {
						data.sprite.play(`${slidePrefix}-6`);
					},
				},
				'<',
			)
			.to(girlHiding, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-6`][1] / 1000 - 5,
				autoAlpha: 1,
				duration: 0.1,
			})
			.to(dogLying, {
				delay: 5.5,
				autoAlpha: 1,
				duration: 0.1,
				onComplete: () => {
					data.sprite.play(`${slidePrefix}-7`);
				},
			})
			.to(dogLying, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-7`][1] / 1000 - 2,
				autoAlpha: 0,
				duration: 0.1,
			})
			.to(dogRunning, { autoAlpha: 1, duration: 0.1 }, '<')
			.to(dogRunning, {
				delay: 1,
				x: 700,
				duration: 3,
				onComplete: () => {
					data.sprite.play(`${slidePrefix}-8`);
				},
			})
			.to(dogRunning, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-8`][1] / 1000 - 1,
				autoAlpha: 0,
				duration: 0.1,
			})
			.to(dogLying, { x: 650, autoAlpha: 1, duration: 0 }, '<')
			.to(dogLying, {
				delay: 2,
				autoAlpha: 0,
				duration: 0.1,
				onComplete: () => {
					data.sprite.play(`${slidePrefix}-9`);
				},
			})
			.to(girlHiding, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-9`][1] / 1000,
				autoAlpha: 0,
				duration: 0.1,
			})
			.to(boySlightRight, {
				delay: 1,
				autoAlpha: 0,
				duration: 0.1,
			})
			.to(boy, { autoAlpha: 1, duration: 0.1 }, '<')
			.to(boy, {
				delay: 1,
				x: 1200,
				duration: 4,
				onComplete: () => {
					data.sprite.play(`${slidePrefix}-10`);
				},
			})
			.to(girlHiding, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-10`][1] / 1000 - 2,
				autoAlpha: 1,
				duration: 0.1,
			})
			.to(girlHiding, { delay: 1, autoAlpha: 0, duration: 0.1 })
			.to(girlClimbing, { autoAlpha: 1, duration: 0.1 }, '<')
			.to(girlClimbing, { delay: 1, autoAlpha: 0, duration: 0.1 })
			.to(girl, { autoAlpha: 1, duration: 0.1 }, '<')
			.to(girl, { delay: 1, x: -1200, duration: 2 });
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
