import { gsap } from 'gsap';
import { swapSlides } from '../util/slideVisibility';
import { sleep } from '../util/helpers';
import { hideTwoOptions } from '../util/hideTwoOptions';
import { showTwoOptions } from '../util/showTwoOptions';
import type { SvgInHtml } from '../types';
import {
	hideBlockingState,
	showBlockingState,
} from '../util/showOrHideBlockState';

export default async ({ currentSlide, previousSlide }) => {
	// Name of slide
	const slidePrefix = 's-deception-b';

	// Store correct response
	data.procedure[data.currentSlide].correct = 'right';
	data.procedure[data.currentSlide].dimension = 'deception';
	data.procedure[data.currentSlide].analyse = true;

	// Swap slides
	swapSlides(currentSlide, previousSlide);
	data.simpleSlideCounter++;

	// Trial-specific animation
	// Get all relevant elements
	const girl = document.getElementById(
		`link-${slidePrefix}-${data.community}-girl`
	) as SvgInHtml;
	const girlDrinking = document.getElementById(
		`link-${slidePrefix}-${data.community}-girl-drinking`
	) as SvgInHtml;
	const girlRightNay = document.getElementById(
		`link-${slidePrefix}-${data.community}-girl-right-nay`
	) as SvgInHtml;
	const girlFrontAngry = document.getElementById(
		`link-${slidePrefix}-${data.community}-girl-front-angry`
	) as SvgInHtml;
	const girlCup = document.getElementById(
		`link-${slidePrefix}-${data.community}-girl-cup`
	) as SvgInHtml;
	const girlBackCup = document.getElementById(
		`link-${slidePrefix}-${data.community}-girl-back-cup`
	) as SvgInHtml;
	const girlFrontCup = document.getElementById(
		`link-${slidePrefix}-${data.community}-girl-front-cup`
	) as SvgInHtml;
	const boyWithWater = document.getElementById(
		`link-${slidePrefix}-${data.community}-boy-water`
	) as SvgInHtml;
	const boyWithVinegar = document.getElementById(
		`link-${slidePrefix}-${data.community}-boy-vinegar`
	) as SvgInHtml;
	const boyWithBottles = document.getElementById(
		`link-${slidePrefix}-${data.community}-boy-bottles`
	) as SvgInHtml;
	const boy = document.getElementById(
		`link-${slidePrefix}-${data.community}-boy`
	) as SvgInHtml;
	const boyWithCup = document.getElementById(
		`link-${slidePrefix}-${data.community}-boy-cup`
	) as SvgInHtml;
	const boyLeft = document.getElementById(
		`link-${slidePrefix}-${data.community}-boy-left`
	) as SvgInHtml;
	const boyLaughing = document.getElementById(
		`link-${slidePrefix}-${data.community}-boy-laughing`
	) as SvgInHtml;
	const boySlightRight = document.getElementById(
		`link-${slidePrefix}-${data.community}-boy-slightright-standing`
	) as SvgInHtml;
	const cupboardClosed = document.getElementById(
		`${slidePrefix}-cupboard-closed`
	) as SvgInHtml;
	const cupboardEmpty = document.getElementById(
		`${slidePrefix}-cupboard-open-empty`
	) as SvgInHtml;
	const cupboardOpen = document.getElementById(
		`${slidePrefix}-cupboard-open`
	) as SvgInHtml;
	const purpleCup = document.getElementById(
		`${slidePrefix}-cup-purple`
	) as SvgInHtml;
	const yellowCup = document.getElementById(
		`${slidePrefix}-cup-yellow`
	) as SvgInHtml;
	const blueCup = document.getElementById(
		`${slidePrefix}-cup-blue`
	) as SvgInHtml;
	const water = document.getElementById(`${slidePrefix}-water`) as SvgInHtml;
	const vinegar = document.getElementById(
		`${slidePrefix}-vinegar`
	) as SvgInHtml;
	const waterAfter = document.getElementById(
		`${slidePrefix}-water-after`
	) as SvgInHtml;
	const vinegarAfter = document.getElementById(
		`${slidePrefix}-vinegar-after`
	) as SvgInHtml;
	// Define animation function
	async function showAnimation() {
		gsap.set(
			[
				boyWithWater,
				boyWithVinegar,
				boyWithBottles,
				boyLaughing,
				boyWithCup,
				boyLeft,
				boySlightRight,
				girl,
				girlDrinking,
				girlBackCup,
				girlCup,
				girlFrontAngry,
				girlFrontCup,
				girlRightNay,
				cupboardEmpty,
				cupboardOpen,
				purpleCup,
				waterAfter,
				vinegarAfter,
			],
			{
				autoAlpha: 0,
			}
		);

		gsap.set([water, vinegar, cupboardClosed, blueCup, yellowCup], {
			autoAlpha: 1,
		});

		gsap.set(girl, { autoAlpha: 1, x: -1200 });
		gsap.set(boy, { autoAlpha: 1, x: 0 });
		gsap.set(girlFrontAngry, { autoAlpha: 0, x: 0 });
		gsap.set(boyLaughing, { autoAlpha: 0, x: 0 });

		await data.sprite.playPromise(`${slidePrefix}-1`);

		const tl = await gsap.timeline();
		tl.to(boy, {
			delay: 0.2,
			onStart: () => {
				data.sprite.play(`${slidePrefix}-2`);
			},
		})
			.to([boy, vinegar], {
				autoAlpha: 0,
				duration: 0.1,
			})
			.to(boyWithVinegar, { autoAlpha: 1, duration: 0.1 }, '<')
			.to(boyWithVinegar, { delay: 1, autoAlpha: 0, duration: 0.1 })
			.to(
				[boy, vinegarAfter],
				{
					autoAlpha: 1,
					duration: 0.1,
				},
				'<'
			)
			.to([boy, water], { delay: 1, autoAlpha: 0, duration: 0.1 })
			.to(boyWithWater, { autoAlpha: 1, duration: 0.1 }, '<')
			.to(boyWithWater, { autoAlpha: 1, duration: 0.1 }, '<')
			.to(boyWithWater, { delay: 1, autoAlpha: 0, duration: 0.1 })
			.to(
				[boy, waterAfter],
				{
					autoAlpha: 1,
					duration: 0.1,
				},
				'<'
			)
			.to([cupboardEmpty, boyWithBottles], {
				delay: data.spriteJSON.sprite[`${slidePrefix}-2`][1] / 1000 - 3,
				autoAlpha: 1,
				duration: 0.1,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-3`);
				},
			})
			.to(
				[cupboardClosed, boy, waterAfter, vinegarAfter],
				{
					autoAlpha: 0,
					duration: 0.1,
				},
				'<'
			)
			.to([cupboardOpen, boy], {
				delay: 1,
				autoAlpha: 1,
				duration: 0.1,
			})
			.to(
				[cupboardEmpty, boyWithBottles],
				{
					autoAlpha: 0,
					duration: 0.1,
				},
				'<'
			)
			.to(cupboardClosed, { delay: 1, autoAlpha: 1, duration: 0.1 })
			.to(cupboardOpen, { autoAlpha: 0, duration: 0.1 }, '<')
			.to(girl, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-3`][1] / 1000 - 2,
				duration: 2,
				x: 0,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-4`);
				},
			})
			.to([boy, blueCup], {
				delay: data.spriteJSON.sprite[`${slidePrefix}-4`][1] / 1000 - 1,
				autoAlpha: 0,
				duration: 0.1,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-5`);
				},
			})
			.to(boyWithCup, { autoAlpha: 1, duration: 0.1 }, '<')
			.to([boyWithCup, girl], {
				delay: 2,
				autoAlpha: 0,
				duration: 0.1,
			})
			.to(
				[boy, girlDrinking],
				{
					autoAlpha: 1,
					duration: 0.1,
				},
				'<'
			)
			.to(girlDrinking, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-5`][1] / 1000 - 1,
				autoAlpha: 0,
				duration: 0.1,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-6`);
				},
			})
			.to(
				[girlRightNay, blueCup],
				{
					autoAlpha: 1,
					duration: 0.1,
				},
				'<'
			)
			.to(girlRightNay, { delay: 2, autoAlpha: 0, duration: 0.1 })
			.to(girlFrontAngry, { autoAlpha: 1, duration: 0.1 }, '<')
			.to(boy, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-6`][1] / 1000 - 2,
				autoAlpha: 0,
				duration: 0.1,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-7`);
				},
			})
			.to(boyLaughing, { autoAlpha: 1, duration: 0.1 }, '<')
			.to(boy, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-7`][1] / 1000,
				autoAlpha: 1,
				duration: 0.1,
			})
			.to(boyLaughing, { autoAlpha: 0, duration: 0.1 }, '<')
			.to(girl, { autoAlpha: 1, duration: 0.1 }, '<')
			.to(girlFrontAngry, { autoAlpha: 0, duration: 0.1 }, '<')
			.to(girl, {
				duration: 2,
				x: -1000,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-8`);
				},
			})
			.to(boy, { x: 1200, duration: 2 }, '<')
			.to(purpleCup, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-8`][1] / 1000 - 1,
				autoAlpha: 1,
				duration: 0.1,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-9`);
				},
			})
			.to(
				[blueCup, yellowCup],
				{
					autoAlpha: 0,
					duration: 0.1,
				},
				'<'
			)
			.to(boy, { x: -1200, duration: 0 }, '<')
			.to(girl, { x: 1600, duration: 0 }, '<')
			.to(boy, {
				delay: 1,
				x: -400,
				duration: 2,
			})
			.to(girl, { x: +400, duration: 2 }, '<')
			.to(boy, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-9`][1] / 1000 - 2,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-10`);
				},
			})
			.to([girl, purpleCup], {
				delay: data.spriteJSON.sprite[`${slidePrefix}-10`][1] / 1000,
				autoAlpha: 0,
				duration: 0.1,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-11`);
				},
			})
			.to(girlFrontCup, { autoAlpha: 1, duration: 0.1 }, '<')
			.to(girlFrontCup, { delay: 1, autoAlpha: 0, duration: 0.1 })
			.to(girlBackCup, { autoAlpha: 1, duration: 0.1 }, '<')
			.to(cupboardClosed, { delay: 1, autoAlpha: 0, duration: 0.1 })
			.to(cupboardEmpty, { autoAlpha: 1, duration: 0.1 }, '<')
			.to(cupboardEmpty, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-11`][1] / 1000 - 2,
				autoAlpha: 0,
				duration: 0.1,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-12`);
				},
			})
			.to(cupboardClosed, { autoAlpha: 1, duration: 0.1 }, '<')
			.to(girlBackCup, { delay: 1, autoAlpha: 0, duration: 0.1 })
			.to(girlFrontCup, { autoAlpha: 1, duration: 0.1 }, '<')
			.to(girlCup, { x: -500, duration: 0.1 }, '<')
			.to(girlFrontCup, { delay: 1, autoAlpha: 0, duration: 0.1 })
			.to(girlCup, { autoAlpha: 1, duration: 0.1 }, '<');

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
