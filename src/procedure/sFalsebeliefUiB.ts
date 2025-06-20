import { gsap } from 'gsap';
import type { SvgInHtml } from '../types';
import { swapSlides } from '../util/slideVisibility';
import { sleep } from '../util/helpers';
import { hideTwoOptions } from '../util/hideTwoOptions';
import { showTwoOptions } from '../util/showTwoOptions';

export default async ({ currentSlide, previousSlide }) => {
	// Name of slide
	const slidePrefix = 's-falsebelief-ui-b';

	// Store correct response
	data.procedure[data.currentSlide].correct = 'left';

	// Swap slides
	swapSlides(currentSlide, previousSlide);
	data.simpleSlideCounter++;

	// Trial-specific animation
	// Get all relevant elements
	const boy = document.getElementById(
		`link-${slidePrefix}-${data.community}-boy`,
	) as SvgInHtml;
	const girl = document.getElementById(
		`link-${slidePrefix}-${data.community}-girl`,
	) as SvgInHtml;
	const girlWatchingfilm = document.getElementById(
		`link-${slidePrefix}-${data.community}-girl-watchingfilm`,
	) as SvgInHtml;
	const girlFilming = document.getElementById(
		`link-${slidePrefix}-${data.community}-girl-filming`,
	) as SvgInHtml;
	const dogStanding = document.getElementById(
		`link-${slidePrefix}-dog-standing`,
	) as SvgInHtml;
	const dogLying = document.getElementById(
		`link-${slidePrefix}-dog-lying`,
	) as SvgInHtml;
	const dogBarking = document.getElementById(
		`link-${slidePrefix}-dog-barking`,
	) as SvgInHtml;
	const dogRunning = document.getElementById(
		`link-${slidePrefix}-dog-running`,
	) as SvgInHtml;
	const housewall = document.getElementById(
		`${slidePrefix}-housewall`,
	) as SvgInHtml;

	// Define animation function
	async function showAnimation() {
		// Initially hide some agent elements
		gsap.set(
			[girlWatchingfilm, girlFilming, dogLying, dogBarking, dogRunning],
			{
				autoAlpha: 0,
				x: 0,
			},
		);
		gsap.set([girl, dogStanding], {
			autoAlpha: 1,
			x: 0,
			y: 0,
		});
		gsap.set(boy, { autoAlpha: 1, x: -1400 });

		// Play initial audio
		await data.sprite.playPromise(`${slidePrefix}-1`);

		// Animation sequence
		await gsap
			.timeline()
			.to(girl, { autoAlpha: 0, duration: 0.1 })
			.to(
				girlFilming,
				{
					autoAlpha: 1,
					duration: 0.1,
					onComplete: () => data.sprite.playPromise(`${slidePrefix}-2`),
				},
				'<',
			)
			.to(dogStanding, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-2`][1] / 1000 - 1,
				autoAlpha: 0,
				duration: 0.1,
			})
			.to(dogBarking, { autoAlpha: 1, duration: 0.1 }, '<')
			.to(dogBarking, { delay: 1.5, autoAlpha: 0, duration: 0.1 })
			.to(
				dogStanding,
				{
					autoAlpha: 1,
					duration: 0.1,
					onComplete: () => data.sprite.playPromise(`${slidePrefix}-3`),
				},
				'<',
			)
			.to(
				girlFilming,
				{
					delay: 1,
					autoAlpha: 0,
					duration: 0.1,
				},
				'<',
			)
			.to(girl, { autoAlpha: 1, duration: 0.1 }, '<')
			.to(
				dogStanding,
				{
					delay: data.spriteJSON.sprite[`${slidePrefix}-3`][1] / 1000 - 2,
					autoAlpha: 0,
					duration: 0.1,
				},
				'<',
			)
			.to(dogRunning, { autoAlpha: 1, duration: 0.1 }, '<')
			.to(dogRunning, { x: 300, duration: 2 })
			.to(dogRunning, {
				autoAlpha: 0,
				duration: 0.1,
			})
			.to(
				dogLying,
				{
					autoAlpha: 1,
					duration: 0.1,
				},
				'<',
			)
			.to(dogLying, {
				delay: 1.5,
				autoAlpha: 0,
				duration: 0.1,
				onComplete: () => data.sprite.playPromise(`${slidePrefix}-4`),
			})
			.to(girl, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-4`][1] / 1000 - 2,
				autoAlpha: 0,
				duration: 0.1,
			})
			.to(
				[girlWatchingfilm],
				{
					autoAlpha: 1,
					duration: 0.1,
				},
				'<',
			)
			.to([girlWatchingfilm], {
				delay: 3,
				autoAlpha: 0,
				duration: 0.1,
				onComplete: () => data.sprite.playPromise(`${slidePrefix}-5`),
			})
			.to(girl, { autoAlpha: 1, duration: 0.1 }, '<')
			.to(girl, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-5`][1] / 1000 - 2,
				x: -170,
				y: -100,
				scale: 0.8,
				duration: 2,
			})
			.to(girl, {
				delay: 1,
				autoAlpha: 0,
				duration: 0.1,
				onComplete: () => data.sprite.playPromise(`${slidePrefix}-6`),
			})
			.to(boy, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-6`][1] / 1000,
				x: 0,
				duration: 5,
				onComplete: () => data.sprite.playPromise(`${slidePrefix}-7`),
			})
			.to(housewall, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-7`][1] / 1000 - 2,
				autoAlpha: 0.5,
				duration: 0.5,
			})
			.to(housewall, { delay: 2, autoAlpha: 1, duration: 0.5 });
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
