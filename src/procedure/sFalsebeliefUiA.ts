import { gsap } from 'gsap';
import type { SvgInHtml } from '../types';
import { swapSlides } from '../util/slideVisibility';
import { sleep } from '../util/helpers';
import { hideTwoOptions } from '../util/hideTwoOptions';
import { showTwoOptions } from '../util/showTwoOptions';

export default async ({ currentSlide, previousSlide }) => {
	// Name of slide
	const slidePrefix = 's-falsebelief-ui-a';

	// Store correct response
	data.procedure[data.currentSlide].correct = 'left';

	// Swap slides
	swapSlides(currentSlide, previousSlide);
	data.simpleSlideCounter++;

	// Trial-specific animation
	// Get all relevant elements
	const girlLeft = document.getElementById(
		`link-${slidePrefix}-${data.community}-girl-left-standing`,
	) as SvgInHtml;
	const girlFront = document.getElementById(
		`link-${slidePrefix}-${data.community}-girl-front`,
	) as SvgInHtml;
	const womanStanding = document.getElementById(
		`link-${slidePrefix}-${data.community}-woman-standing`,
	) as SvgInHtml;
	const womanApron = document.getElementById(
		`link-${slidePrefix}-${data.community}-woman-apron`,
	) as SvgInHtml;
	const keyHole = document.getElementById(
		`s-false-belief-ui-a-keyhole`,
	) as SvgInHtml;
	const yellowDoorClose = document.getElementById(
		`${slidePrefix}-door-yc`,
	) as SvgInHtml;

	const yellowDoorOpen = document.getElementById(
		`${slidePrefix}-door-yo`,
	) as SvgInHtml;

	const blueDoorClose = document.getElementById(
		`${slidePrefix}-door-bc`,
	) as SvgInHtml;

	const blueDoorOpen = document.getElementById(
		`${slidePrefix}-door-bo`,
	) as SvgInHtml;

	const blueDoorOpenApron = document.getElementById(
		`${slidePrefix}-door-bo-apron`,
	) as SvgInHtml;

	// Define animation function
	// Define animation function
	async function showAnimation() {
		// Initially hide some agent elements
		gsap.set(
			[
				womanStanding,
				womanApron,
				girlLeft,
				girlFront,
				keyHole,
				yellowDoorClose,
				yellowDoorOpen,
				blueDoorClose,
				blueDoorOpen,
				blueDoorOpenApron,
			],
			{
				autoAlpha: 0,
				x: 0,
			},
		);
		gsap.set([girlFront, womanApron, yellowDoorClose, blueDoorClose], {
			autoAlpha: 1,
			x: 0,
		});
		gsap.set(womanStanding, { x: -600 });

		await data.sprite.playPromise(`${slidePrefix}-1`);

		await gsap
			.timeline()
			.to(girlFront, {
				x: +1200,
				duration: 3,
				delay: data.spriteJSON.sprite[`${slidePrefix}-2`][1] / 1000 - 2,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-2`);
				},
			})
			.to(womanApron, {
				x: -500,
				duration: 3,
				delay: data.spriteJSON.sprite[`${slidePrefix}-3`][1] / 1000 - 4,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-3`);
				},
			})
			.to([blueDoorOpen], {
				autoAlpha: 1,
				duration: 0.5,
			})
			.to(
				[blueDoorClose],
				{
					autoAlpha: 0,
					duration: 0.5,
				},
				'<',
			)
			.to(womanApron, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-4`][1] / 1000,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-4`);
				},
			})
			.to([womanStanding, blueDoorOpenApron], {
				autoAlpha: 1,
				duration: 0.5,
			})
			.to(
				[womanApron, blueDoorOpen],
				{
					autoAlpha: 0,
					duration: 0.5,
				},
				'<',
			)
			.to(womanStanding, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-5`][1] / 1000 + 2,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-5`);
				},
			})
			.to(
				blueDoorOpenApron,
				{
					autoAlpha: 0,
					duration: 0.5,
					delay: 2,
				},
				'<',
			)
			.to(
				blueDoorClose,
				{
					autoAlpha: 1,
					duration: 0.5,
				},
				'<',
			)
			.to(womanStanding, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-6`][1] / 1000 - 2,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-6`);
				},
			})
			.to(womanStanding, {
				x: +500,
				duration: 3,
				delay: 1,
			})
			.to(yellowDoorClose, {
				autoAlpha: 0,
				duration: 0.5,
			})
			.to(
				yellowDoorOpen,
				{
					autoAlpha: 1,
					duration: 0.5,
				},
				'<',
			)
			.to(womanStanding, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-7`][1] / 1000 - 2,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-7`);
				},
			})
			.to(womanStanding, {
				duration: 0.5,
				autoAlpha: 0,
			})
			.to(
				yellowDoorClose,
				{
					autoAlpha: 1,
					duration: 0.5,
				},
				'<',
			)
			.to(
				yellowDoorOpen,
				{
					autoAlpha: 0,
					duration: 0.5,
				},
				'<',
			)
			.to(girlFront, {
				x: 0,
				duration: 3,
				delay: data.spriteJSON.sprite[`${slidePrefix}-8`][1] / 1000 + 2,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-8`);
				},
			})
			.to(girlFront, {
				x: -550,
				duration: 3,
				delay: data.spriteJSON.sprite[`${slidePrefix}-9`][1] / 1000,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-9`);
				},
			})
			.to(girlFront, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-10`][1] / 1000,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-10`);
				},
			})
			.to(girlFront, {
				autoAlpha: 0,
				duration: 0.5,
			})
			.to(
				girlLeft,
				{
					autoAlpha: 1,
					duration: 0.5,
				},
				'<',
			)
			.to(keyHole, {
				autoAlpha: 1,
				duration: 0.5,
				delay: 2,
			});

		await sleep(2000);
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
