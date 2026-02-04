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
	const phonesound = document.getElementById(
		`${slidePrefix}-phonesound`,
	) as SvgInHtml;

	// Define animation function
	async function showAnimation() {
		// Initially hide some agent elements
		gsap.set(
			[
				girlWatchingfilm,
				girlFilming,
				dogLying,
				dogBarking,
				dogRunning,
				phonesound,
			],
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
				},
				'<',
			)
			.to(dogBarking, {
				delay: data.spriteJSON.sprite[`dog`][1] / 1000,
				autoAlpha: 1,
				duration: 0.1,
				onStart: () => {
					data.sprite.play(`dog`);
				},
			})
			.to(
				dogStanding,
				{
					autoAlpha: 0,
					duration: 0.1,
				},
				'<',
			)
			.to(dogBarking, { delay: 1.5, autoAlpha: 0, duration: 0.1 })
			.to(
				dogStanding,
				{
					autoAlpha: 1,
					duration: 0.1,
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
					delay: data.spriteJSON.sprite[`${slidePrefix}-2`][1] / 1000 - 2,
					autoAlpha: 0,
					duration: 0.1,
					onStart: () => {
						data.sprite.play(`${slidePrefix}-2`);
					},
				},
				'<',
			)
			.to(dogRunning, { autoAlpha: 1, duration: 0.1 }, '<')
			.to(dogRunning, { x: 300, duration: 1.5 })
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
			})
			.to(girl, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-3`][1] / 1000,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-3`);
				},
			})
			.to(girlWatchingfilm, {
				autoAlpha: 1,
				duration: 0.1,
				delay: data.spriteJSON.sprite[`dog`][1] / 1000 + 2,
				onStart: () => {
					data.sprite.play(`dog`);
				},
			})
			.to(
				[girl],
				{
					autoAlpha: 0,
					duration: 0.1,
				},
				'<',
			)
			.to([girlWatchingfilm], {
				delay: 2,
				autoAlpha: 0,
				duration: 0.1,
			})
			.to(girl, { autoAlpha: 1, duration: 0.1 }, '<')
			.to(girl, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-4`][1] / 1000,
				x: -170,
				y: -100,
				scale: 0.8,
				duration: 2,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-4`);
				},
			})
			.to(girl, {
				delay: 1,
				autoAlpha: 0,
				duration: 0.1,
			})
			.to(boy, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-5`][1] / 1000,
				x: 0,
				duration: 2,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-5`);
				},
			})
			.to(boy, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-6`][1] / 1000 - 2,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-6`);
				},
			})
			.to(phonesound, {
				autoAlpha: 1,
				duration: 0.1,
				delay: data.spriteJSON.sprite[`dog`][1] / 1000 + 2,
				onStart: () => {
					data.sprite.play(`dog`);
				},
			})
			.to(phonesound, { delay: 2, autoAlpha: 0, duration: 0.1 });

		await sleep(1000);
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
