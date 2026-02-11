import { gsap } from 'gsap';
import type { SvgInHtml } from '../../src/types';
import { swapSlides } from '../../src/util/slideVisibility';
import { sleep } from '../../src/util/helpers';
import { hideTwoOptions } from '../../src/util/hideTwoOptions';
import { showTwoOptions } from '../../src/util/showTwoOptions';
import {
	hideBlockingState,
	showBlockingState,
} from '../util/showOrHideBlockState';

export default async ({ currentSlide, previousSlide }) => {
	// Name of slide
	const slidePrefix = 's-knowledgeaccess-b';

	// Store correct response
	data.procedure[data.currentSlide].correct = 'right';

	// Swap slides
	swapSlides(currentSlide, previousSlide);
	data.simpleSlideCounter++;

	// Trial-specific animation
	// Get all relevant elements
	const girlHandsup = document.getElementById(
		`link-${slidePrefix}-${data.community}-girl-handsup`,
	) as SvgInHtml;
	const girl = document.getElementById(
		`link-${slidePrefix}-${data.community}-girl`,
	) as SvgInHtml;
	const boyHandsup = document.getElementById(
		`link-${slidePrefix}-${data.community}-boy-handsup`,
	) as SvgInHtml;
	const boy = document.getElementById(
		`link-${slidePrefix}-${data.community}-boy`,
	) as SvgInHtml;
	const boxOpen = document.getElementById(
		`${slidePrefix}-box-open`,
	) as SvgInHtml;
	const boxClosed = document.getElementById(
		`${slidePrefix}-box-closed`,
	) as SvgInHtml;

	// Define animation function
	async function showAnimation() {
		// Initially hide some agent elements
		gsap.set(boy, { x: -1200 });
		gsap.set([girlHandsup, boyHandsup, boxOpen], { autoAlpha: 0 });
		gsap.set(girl, { x: 0, autoAlpha: 1 });

		// Play initial audio
		await data.sprite.playPromise(`${slidePrefix}-1`);

		// Animation sequence
		const tl = await gsap.timeline();

		tl.to([girl, boxClosed], {
			delay: 0.5,
			autoAlpha: 0,
			duration: 0.1,
		})
			.to(
				[girlHandsup, boxOpen],
				{
					autoAlpha: 1,
					duration: 0.1,
				},
				'<',
			)
			.to([girlHandsup, boxOpen], {
				delay: data.spriteJSON.sprite[`${slidePrefix}-2`][1] / 1000 - 1,
				autoAlpha: 0,
				duration: 0.1,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-2`);
				},
			})
			.to([girl, boxClosed], { autoAlpha: 1, duration: 0.1 }, '<')
			.to(girl, {
				delay: 0.5,
				x: 1100,
				duration: 2,
			})
			.to(boy, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-3`][1] / 1000 + 1,
				x: 0,
				duration: 2,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-3`);
				},
			})
			.to(boxClosed, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-4`][1] / 1000 - 1,
				x: 50,
				y: -400,
				duration: 0.1,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-4`);
				},
			})
			.to(boy, { delay: 1, autoAlpha: 0, duration: 0.1 })
			.to(boyHandsup, { autoAlpha: 1, duration: 0.1 }, '<')
			.to(boxClosed, { x: 0, y: -700, duration: 1, repeat: 1, yoyo: true })
			.to(boyHandsup, { delay: 1, autoAlpha: 0, duration: 0.1 })
			.to(
				boy,
				{
					autoAlpha: 1,
					duration: 0.1,
					onComplete: () => {
						data.sprite.play(`${slidePrefix}-5`);
					},
				},
				'<',
			)
			.to(boxClosed, { y: 0, duration: 1 })
			.to(boy, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-5`][1] / 1000 - 1,
				x: -1200,
				duration: 2,
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
