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
				duration: 2,
				delay: data.spriteJSON.sprite[`${slidePrefix}-2`][1] / 1000,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-2`);
				},
			})
			.to(womanApron, {
				x: -500,
				duration: 2,
				delay: data.spriteJSON.sprite[`${slidePrefix}-3`][1] / 1000 - 1,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-3`);
				},
			})
			.to([blueDoorOpen], {
				autoAlpha: 1,
				duration: 0.1,
			})
			.to(
				[blueDoorClose],
				{
					autoAlpha: 0,
					duration: 0.1,
				},
				'<',
			)
			.to(womanApron, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-4`][1] / 1000 - 2,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-4`);
				},
			})
			.to([womanStanding, blueDoorOpenApron], {
				autoAlpha: 1,
				duration: 0.1,
			})
			.to(
				[womanApron, blueDoorOpen],
				{
					autoAlpha: 0,
					duration: 0.1,
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
					duration: 0.1,
				},
				'<',
			)
			.to(
				blueDoorClose,
				{
					autoAlpha: 1,
					duration: 0.1,
				},
				'<',
			)
			.to(womanStanding, {
				x: +400,
				duration: 2,
			})
			.to(yellowDoorClose, {
				autoAlpha: 0,
				duration: 0.1,
			})
			.to(
				yellowDoorOpen,
				{
					autoAlpha: 1,
					duration: 0.1,
				},
				'<',
			)
			.to(womanStanding, {
				y: -200,
				duration: 2,
				delay: 1,
			})
			.to(womanStanding, {
				duration: 0.1,
				autoAlpha: 0,
			})
			.to(womanStanding, {
				y: 0,
			})
			.to(
				yellowDoorClose,
				{
					autoAlpha: 1,
					duration: 0.1,
				},
				'<',
			)
			.to(
				yellowDoorOpen,
				{
					autoAlpha: 0,
					duration: 0.1,
				},
				'<',
			)
			.to(girlFront, {
				x: 0,
				duration: 2,
				delay: data.spriteJSON.sprite[`${slidePrefix}-6`][1] / 1000,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-6`);
				},
			})
			.to(girlFront, {
				x: -550,
				duration: 2,
				delay: data.spriteJSON.sprite[`${slidePrefix}-7`][1] / 1000,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-7`);
				},
			})
			.to(girlFront, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-8`][1] / 1000 - 4,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-8`);
				},
			})
			.to(girlFront, {
				autoAlpha: 0,
				duration: 0.1,
			})
			.to(
				girlLeft,
				{
					autoAlpha: 1,
					duration: 0.1,
				},
				'<',
			)
			.to(keyHole, {
				autoAlpha: 1,
				duration: 0.1,
				delay: 2,
			})
			.to(keyHole, {
				delay: 2,
				autoAlpha: 0,
				duration: 0.1,
			});

		await sleep(1000);
	}

	// In beginning, hide response options
	await hideTwoOptions(slidePrefix);
	await hideBlockingState(slidePrefix);

	// Show animation
	await showAnimation();

	// Short break before showing response options
	await sleep(1000);

	// Show left/right response options and store participant response
	await showTwoOptions(slidePrefix);
	await showBlockingState(slidePrefix);
};
