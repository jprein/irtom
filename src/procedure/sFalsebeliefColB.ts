import { gsap } from 'gsap';
import type { SvgInHtml } from '../types';
import { swapSlides } from '../util/slideVisibility';
import { sleep } from '../util/helpers';
import { hideThreeOptions } from '../util/hideThreeOptions';
import { showThreeOptions } from '../util/showThreeOptions';

export default async ({ currentSlide, previousSlide }) => {
	// Name of slide
	const slidePrefix = 's-falsebelief-col-b';

	// Store correct response
	data.procedure[data.currentSlide].correct = 'right';

	// Swap slides
	swapSlides(currentSlide, previousSlide);
	data.simpleSlideCounter++;

	// Add trial-specific animation
	const boy = document.getElementById(
		`link-${slidePrefix}-${data.community}-boy`,
	) as SvgInHtml;
	const boyTeddy = document.getElementById(
		`link-${slidePrefix}-${data.community}-boy-teddy`,
	) as SvgInHtml;
	const boyHandsup = document.getElementById(
		`link-${slidePrefix}-${data.community}-boy-handsup`,
	) as SvgInHtml;
	const girl = document.getElementById(
		`link-${slidePrefix}-${data.community}-girl`,
	) as SvgInHtml;
	const girlTeddy = document.getElementById(
		`link-${slidePrefix}-${data.community}-girl-teddy`,
	) as SvgInHtml;
	const girlHandsup = document.getElementById(
		`link-${slidePrefix}-${data.community}-girl-handsup`,
	) as SvgInHtml;
	const man = document.getElementById(
		`link-${slidePrefix}-${data.community}-man`,
	) as SvgInHtml;
	const manTeddy = document.getElementById(
		`link-${slidePrefix}-${data.community}-man-teddy`,
	) as SvgInHtml;
	const manHandsup = document.getElementById(
		`link-${slidePrefix}-${data.community}-man-handsup`,
	) as SvgInHtml;
	const boxAOpen = document.getElementById(
		`${slidePrefix}-boxA-open`,
	) as SvgInHtml;
	const boxAClosed = document.getElementById(
		`${slidePrefix}-boxA-closed`,
	) as SvgInHtml;
	const boxBOpen = document.getElementById(
		`${slidePrefix}-boxB-open`,
	) as SvgInHtml;
	const boxBClosed = document.getElementById(
		`${slidePrefix}-boxB-closed`,
	) as SvgInHtml;
	const boxCOpen = document.getElementById(
		`${slidePrefix}-boxC-open`,
	) as SvgInHtml;
	const boxCClosed = document.getElementById(
		`${slidePrefix}-boxC-closed`,
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
				manHandsup,
				boxAOpen,
				boxBOpen,
				boxCOpen,
			],
			{
				x: 0,
				autoAlpha: 0,
			},
		);
		gsap.set([girl, boy, manTeddy, boxAClosed, boxBClosed, boxCClosed], {
			x: 0,
			autoAlpha: 1,
		});

		await data.sprite.playPromise(`${slidePrefix}-1`);

		await gsap
			.timeline()
			// first, animate man moving teddy into central box B
			.to(manTeddy, {
				onStart: () => {
					data.sprite.play(`${slidePrefix}-2`);
				},
			})
			.to([manTeddy, boxBClosed], {
				delay: data.spriteJSON.sprite[`${slidePrefix}-2`][1] / 1000,
				autoAlpha: 0,
				duration: 0.1,
			})
			.to(
				[manHandsup, boxBOpen],
				{
					autoAlpha: 1,
					duration: 0.1,
					onComplete: () => {
						data.sprite.play(`${slidePrefix}-3`);
					},
				},
				'<',
			)
			.to([manHandsup, boxBOpen], {
				delay: data.spriteJSON.sprite[`${slidePrefix}-3`][1] / 1000,
				autoAlpha: 0,
				duration: 0.1,
			})
			.to([man, boxBClosed], { autoAlpha: 1, duration: 0.1 }, '<')
			.to(man, {
				delay: 1,
				x: 1200,
				duration: 3,
				onComplete: () => {
					data.sprite.play(`${slidePrefix}-4`);
				},
			})
			// second, animate girl taking teddy from central box B and moving it to right box C
			.to(girl, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-4`][1] / 1000 - 3,
				x: -220,
				y: 100,
				duration: 1,
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
				'<',
			)
			.to([girlHandsup, boxBOpen], { delay: 1, autoAlpha: 0, duration: 0.1 })
			.to(
				[girlTeddy, boxBClosed],
				{
					autoAlpha: 1,
					duration: 0.1,
					onComplete: () => {
						data.sprite.play(`${slidePrefix}-5`);
					},
				},
				'<',
			)
			.to(girlTeddy, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-5`][1] / 1000 - 1,
				x: 360,
				duration: 2,
				onComplete: () => {
					data.sprite.play(`${slidePrefix}-6`);
				},
			})
			.to([girl, girlHandsup], { x: 360, duration: 0 })
			.to([girlTeddy, boxCClosed], {
				delay: data.spriteJSON.sprite[`${slidePrefix}-6`][1] / 1000 + 0.5,
				autoAlpha: 0,
				duration: 0.1,
			})
			.to(
				[girlHandsup, boxCOpen],
				{
					autoAlpha: 1,
					duration: 0.1,
				},
				'<',
			)
			.to([girlHandsup, boxCOpen], {
				delay: 1,
				autoAlpha: 0,
				duration: 0.1,
				onComplete: () => {
					data.sprite.play(`${slidePrefix}-7`);
				},
			})
			.to([girl, boxCClosed], { autoAlpha: 1, duration: 0.1 }, '<')
			.to(girl, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-7`][1] / 1000,
				x: 1200,
				duration: 2,
				onComplete: () => {
					data.sprite.play(`${slidePrefix}-8`);
				},
			})
			// third, animate boy taking teddy from right box C and moving it to left box A
			.to(boy, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-8`][1] / 1000 - 3,
				x: 860,
				y: 100,
				duration: 4,
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
				'<',
			)
			.to([boyHandsup, boxCOpen], { delay: 1, autoAlpha: 0, duration: 0.1 })
			.to(
				[boyTeddy, boxCClosed],
				{
					autoAlpha: 1,
					duration: 0.1,
					onComplete: () => {
						data.sprite.play(`${slidePrefix}-9`);
					},
				},
				'<',
			)
			.to(boyTeddy, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-9`][1] / 1000 - 1,
				x: -360,
				duration: 4,
				onComplete: () => {
					data.sprite.play(`${slidePrefix}-10`);
				},
			})
			.to([boy, boyHandsup], { x: -360, duration: 0 })
			.to([boyTeddy, boxAClosed], {
				delay: data.spriteJSON.sprite[`${slidePrefix}-10`][1] / 1000,
				autoAlpha: 0,
				duration: 0.1,
			})
			.to(
				[boyHandsup, boxAOpen],
				{
					autoAlpha: 1,
					duration: 0.1,
				},
				'<',
			)
			.to([boyHandsup, boxAOpen], {
				delay: 1,
				autoAlpha: 0,
				duration: 0.1,
				onComplete: () => {
					data.sprite.play(`${slidePrefix}-11`);
				},
			})
			.to([boy, boxAClosed], { autoAlpha: 1, duration: 0.1 }, '<')
			.to(boy, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-11`][1] / 1000,
				x: -1200,
				duration: 2,
			});
	}

	// In beginning, hide yes/no choice
	await hideThreeOptions(slidePrefix);

	// Show animation
	await showAnimation();

	// Short break before showing response options
	await sleep(1000);

	// Show yes/no choice and store participant response
	await showThreeOptions(slidePrefix);
};
