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
	data.procedure[data.currentSlide].dimension = 'falsebelief';
	data.procedure[data.currentSlide].analyse = true;

	// Swap slides
	swapSlides(currentSlide, previousSlide);
	data.simpleSlideCounter++;

	// Trial-specific animation
	// Get all relevant elements
	const girlLeft = document.getElementById(
		`link-${slidePrefix}-${data.community}-girl-left-standing`
	) as SvgInHtml;
	const girl = document.getElementById(
		`link-${slidePrefix}-${data.community}-girl`
	) as SvgInHtml;
	const man = document.getElementById(
		`link-${slidePrefix}-${data.community}-man`
	) as SvgInHtml;
	const manApron = document.getElementById(
		`link-${slidePrefix}-${data.community}-man-apron`
	) as SvgInHtml;
	const keyHole = document.getElementById(
		`s-false-belief-ui-a-keyhole`
	) as SvgInHtml;
	const whiteDoorClose = document.getElementById(
		`${slidePrefix}-door-wc`
	) as SvgInHtml;

	const whiteDoorOpen = document.getElementById(
		`${slidePrefix}-door-wo`
	) as SvgInHtml;

	const brownDoorClose = document.getElementById(
		`${slidePrefix}-door-bc`
	) as SvgInHtml;

	const brownDoorOpen = document.getElementById(
		`${slidePrefix}-door-bo`
	) as SvgInHtml;

	const brownDoorOpenApron = document.getElementById(
		`${slidePrefix}-door-bo-apron`
	) as SvgInHtml;

	// Define animation function
	async function showAnimation() {
		// Initially hide some agent elements
		gsap.set(
			[girlLeft, keyHole, whiteDoorOpen, brownDoorOpen, brownDoorOpenApron],
			{
				autoAlpha: 0,
				x: 0,
			}
		);
		gsap.set([girl, manApron, whiteDoorClose, brownDoorClose], {
			autoAlpha: 1,
			x: 0,
		});
		gsap.set(man, { autoAlpha: 0, x: -450 });

		await data.sprite.playPromise(`${slidePrefix}-1`);

		const tl = await gsap.timeline();

		tl.to(girl, {
			delay: 0.5,
			x: +1000,
			duration: 2,
			onStart: () => {
				data.sprite.play(`${slidePrefix}-2`);
			},
		})
			.to(manApron, {
				x: -450,
				duration: 2,
				delay: data.spriteJSON.sprite[`${slidePrefix}-2`][1] / 1000,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-3`);
				},
			})
			.to(brownDoorOpen, { autoAlpha: 1, duration: 0.1 })
			.to(brownDoorClose, { autoAlpha: 0, duration: 0.1 }, '<')
			.to([man, brownDoorOpenApron], {
				delay: data.spriteJSON.sprite[`${slidePrefix}-3`][1] / 1000 - 1,
				autoAlpha: 1,
				duration: 0.1,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-4`);
				},
			})
			.to(
				[manApron, brownDoorOpen],
				{
					autoAlpha: 0,
					duration: 0.1,
				},
				'<'
			)
			.to(brownDoorOpenApron, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-4`][1] / 1000,
				autoAlpha: 0,
				duration: 0.1,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-5`);
				},
			})
			.to(brownDoorClose, { autoAlpha: 1, duration: 0.1 }, '<')
			.to(man, { x: +300, duration: 2 })
			.to(whiteDoorClose, { autoAlpha: 0, duration: 0.1 })
			.to(whiteDoorOpen, { autoAlpha: 1, duration: 0.1 }, '<')
			.to(man, {
				delay: 1,
				x: 400,
				y: -150,
				duration: 1.5,
			})
			.to(man, { y: 0, autoAlpha: 0, duration: 0 })
			.to(whiteDoorClose, { autoAlpha: 1, duration: 0.1 }, '<')
			.to(whiteDoorOpen, { autoAlpha: 0, duration: 0.1 }, '<')
			.to(girl, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-5`][1] / 1000,
				x: -100,
				duration: 2,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-6`);
				},
			})
			.to(girl, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-6`][1] / 1000,
				x: -500,
				y: -100,
				duration: 2,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-7`);
				},
			})
			.to(girl, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-7`][1] / 1000 - 1,
				autoAlpha: 0,
				duration: 0.1,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-8`);
				},
			})
			.to(girlLeft, { autoAlpha: 1, duration: 0.1 }, '<')
			.to(keyHole, {
				delay: 2,
				autoAlpha: 1,
				duration: 0,
			})
			.to(girlLeft, { autoAlpha: 0, duration: 0.1 })
			.to(girl, { x: -100, y: 0, autoAlpha: 1, duration: 0.1 }, '<')
			.to(keyHole, {
				delay: 3,
				autoAlpha: 0,
				duration: 0,
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
