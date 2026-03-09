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
	const slidePrefix = 's-falsebelief-col-b';

	// Store correct response
	data.procedure[data.currentSlide].correct = 'right';
	data.procedure[data.currentSlide].dimension = 'falsebelief';
	data.procedure[data.currentSlide].analyse = true;

	// Swap slides
	swapSlides(currentSlide, previousSlide);
	data.simpleSlideCounter++;

	// Add trial-specific animation
	const boy = document.getElementById(
		`link-${slidePrefix}-${data.community}-boy`
	) as SvgInHtml;
	const boyTeddy = document.getElementById(
		`link-${slidePrefix}-${data.community}-boy-teddy`
	) as SvgInHtml;
	const boyHandsup = document.getElementById(
		`link-${slidePrefix}-${data.community}-boy-handsup`
	) as SvgInHtml;
	const girl = document.getElementById(
		`link-${slidePrefix}-${data.community}-girl`
	) as SvgInHtml;
	const girlTeddy = document.getElementById(
		`link-${slidePrefix}-${data.community}-girl-teddy`
	) as SvgInHtml;
	const girlHandsup = document.getElementById(
		`link-${slidePrefix}-${data.community}-girl-handsup`
	) as SvgInHtml;
	const man = document.getElementById(
		`link-${slidePrefix}-${data.community}-man`
	) as SvgInHtml;
	const manTeddy = document.getElementById(
		`link-${slidePrefix}-${data.community}-man-teddy`
	) as SvgInHtml;
	const manTeddySpeaking = document.getElementById(
		`link-${slidePrefix}-${data.community}-man-teddy-speaking`
	) as SvgInHtml;
	const manHandsup = document.getElementById(
		`link-${slidePrefix}-${data.community}-man-handsup`
	) as SvgInHtml;
	const boxAOpen = document.getElementById(
		`${slidePrefix}-boxA-open`
	) as SvgInHtml;
	const boxAClosed = document.getElementById(
		`${slidePrefix}-boxA-closed`
	) as SvgInHtml;
	const boxBOpen = document.getElementById(
		`${slidePrefix}-boxB-open`
	) as SvgInHtml;
	const boxBClosed = document.getElementById(
		`${slidePrefix}-boxB-closed`
	) as SvgInHtml;
	const boxCOpen = document.getElementById(
		`${slidePrefix}-boxC-open`
	) as SvgInHtml;
	const boxCClosed = document.getElementById(
		`${slidePrefix}-boxC-closed`
	) as SvgInHtml;

	// Define animation function
	async function showAnimation() {
		// Initially hide some elements
		gsap.set(
			[
				girlHandsup,
				girlTeddy,
				boyHandsup,
				boyTeddy,
				man,
				manTeddySpeaking,
				manHandsup,
				boxAOpen,
				boxBOpen,
				boxCOpen,
			],
			{
				x: 0,
				autoAlpha: 0,
			}
		);
		gsap.set([girl, boy, manTeddy, boxAClosed, boxBClosed, boxCClosed], {
			x: 0,
			autoAlpha: 1,
		});

		await data.sprite.playPromise(`${slidePrefix}-1`);

		const tl = await gsap.timeline();
		// first, animate man moving teddy into central box B
		tl.to(manTeddySpeaking, {
			autoAlpha: 1,
			duration: 0.1,
			onStart: () => {
				data.sprite.play(`${slidePrefix}-2`);
			},
		})
			.to(manTeddy, { autoAlpha: 0, duration: 0.1 }, '<')
			.to(manTeddySpeaking, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-2`][1] / 1000,
				autoAlpha: 0,
				duration: 0.1,
			})
			.to(manTeddy, { autoAlpha: 1, duration: 0.1 }, '<')
			.to([manTeddy, boxBClosed], {
				delay: 1,
				autoAlpha: 0,
				duration: 0.1,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-3`);
				},
			})
			.to(
				[manHandsup, boxBOpen],
				{
					autoAlpha: 1,
					duration: 0.1,
				},
				'<'
			)
			.to([manHandsup, boxBOpen], {
				delay: data.spriteJSON.sprite[`${slidePrefix}-3`][1] / 1000,
				autoAlpha: 0,
				duration: 0.1,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-4`);
				},
			})
			.to([man, boxBClosed], { autoAlpha: 1, duration: 0.1 }, '<')
			.to(man, {
				delay: 1,
				x: 1200,
				duration: 2,
			})
			// second, animate girl taking teddy from central box B and moving it to right box C
			.to(girl, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-4`][1] / 1000 - 1,
				x: -220,
				y: 100,
				duration: 1,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-5`);
				},
			})
			.to([girlTeddy, girlHandsup], { x: -220, y: 100, duration: 0 })
			.to([girl, boxBClosed], {
				delay: 2,
				autoAlpha: 0,
				duration: 0.1,
			})
			.to(
				[girlHandsup, boxBOpen],
				{
					autoAlpha: 1,
					duration: 0.1,
				},
				'<'
			)
			.to([girlHandsup, boxBOpen], { delay: 1, autoAlpha: 0, duration: 0.1 })
			.to(
				[girlTeddy, boxBClosed],
				{
					autoAlpha: 1,
					duration: 0.1,
				},
				'<'
			)
			.to(girlTeddy, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-5`][1] / 1000 - 3,
				x: 360,
				duration: 2,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-6`);
				},
			})
			.to([girl, girlHandsup], {
				delay: data.spriteJSON.sprite[`${slidePrefix}-6`][1] / 1000 - 2,
				x: 360,
				duration: 2,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-7`);
				},
			})
			.to([girlTeddy, boxCClosed], {
				autoAlpha: 0,
				duration: 0.1,
			})
			.to(
				[girlHandsup, boxCOpen],
				{
					autoAlpha: 1,
					duration: 0.1,
				},
				'<'
			)
			.to([girlHandsup, boxCOpen], {
				delay: 1,
				autoAlpha: 0,
				duration: 0.1,
			})
			.to([girl, boxCClosed], { autoAlpha: 1, duration: 0.1 }, '<')
			.to(girl, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-7`][1] / 1000 - 1,
				x: 1200,
				duration: 2,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-8`);
				},
			})
			// third, animate boy taking teddy from right box C and moving it to left box A
			.to(boy, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-8`][1] / 1000 - 1,
				x: 860,
				y: 100,
				duration: 2,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-9`);
				},
			})
			.to([boyTeddy, boyHandsup], { x: 860, y: 100, duration: 0 })
			.to([boy, boxCClosed], {
				delay: 1,
				autoAlpha: 0,
				duration: 0.1,
			})
			.to(
				[boyHandsup, boxCOpen],
				{
					autoAlpha: 1,
					duration: 0.1,
				},
				'<'
			)
			.to([boyHandsup, boxCOpen], { delay: 1, autoAlpha: 0, duration: 0.1 })
			.to(
				[boyTeddy, boxCClosed],
				{
					autoAlpha: 1,
					duration: 0.1,
				},
				'<'
			)
			.to(boyTeddy, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-9`][1] / 1000 - 4,
				x: -360,
				duration: 2,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-10`);
				},
			})
			.to([boy, boyHandsup], { x: -360, duration: 0 })
			.to([boyTeddy, boxAClosed], {
				delay: data.spriteJSON.sprite[`${slidePrefix}-10`][1] / 1000 - 1,
				autoAlpha: 0,
				duration: 0.1,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-11`);
				},
			})
			.to(
				[boyHandsup, boxAOpen],
				{
					autoAlpha: 1,
					duration: 0.1,
				},
				'<'
			)
			.to([boyHandsup, boxAOpen], {
				delay: 1,
				autoAlpha: 0,
				duration: 0.1,
			})
			.to([boy, boxAClosed], { autoAlpha: 1, duration: 0.1 }, '<')
			.to(boy, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-11`][1] / 1000 - 1,
				x: -1200,
				duration: 2,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-12`);
				},
			});

		await tl.then();
		await sleep(500);
		tl.kill();
	}

	// In beginning, hide yes/no choice
	await hideTwoOptions(slidePrefix);
	await hideBlockingState(slidePrefix);

	// Show animation
	await showAnimation();

	// Short break before showing response options
	await sleep(500);

	// Show yes/no choice and store participant response
	const stopBlockingState = await showTwoOptions(slidePrefix);
	if (!stopBlockingState) await showBlockingState(slidePrefix);
};
