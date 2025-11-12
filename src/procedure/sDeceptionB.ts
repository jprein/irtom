import { gsap } from 'gsap';
import { swapSlides } from '../util/slideVisibility';
import { sleep } from '../util/helpers';
import { hideTwoOptions } from '../util/hideTwoOptions';
import { showTwoOptions } from '../util/showTwoOptions';
import type { SvgInHtml } from '../types';

export default async ({ currentSlide, previousSlide }) => {
	// Name of slide
	const slidePrefix = 's-deception-b';

	// Store correct response
	data.procedure[data.currentSlide].correct = 'right';

	// Swap slides
	swapSlides(currentSlide, previousSlide);
	data.simpleSlideCounter++;

	// Trial-specific animation
	// Get all relevant elements
	const girl = document.getElementById(
		`link-${slidePrefix}-${data.community}-girl`,
	) as SvgInHtml;
	const girlDrinking = document.getElementById(
		`link-${slidePrefix}-${data.community}-girl-drinking`,
	) as SvgInHtml;
	const girlRightNay = document.getElementById(
		`link-${slidePrefix}-${data.community}-girl-right-nay`,
	) as SvgInHtml;
	const girlFrontAngry = document.getElementById(
		`link-${slidePrefix}-${data.community}-girl-front-angry`,
	) as SvgInHtml;
	const girlCup = document.getElementById(
		`link-${slidePrefix}-${data.community}-girl-cup`,
	) as SvgInHtml;
	const girlBackCup = document.getElementById(
		`link-${slidePrefix}-${data.community}-girl-back-cup`,
	) as SvgInHtml;
	const girlFrontCup = document.getElementById(
		`link-${slidePrefix}-${data.community}-girl-front-cup`,
	) as SvgInHtml;
	const boyWithWater = document.getElementById(
		`link-${slidePrefix}-${data.community}-boy-water`,
	) as SvgInHtml;
	const boyWithVineger = document.getElementById(
		`link-${slidePrefix}-${data.community}-boy-vinegar`,
	) as SvgInHtml;
	const boyWithBottles = document.getElementById(
		`link-${slidePrefix}-${data.community}-boy-bottles`,
	) as SvgInHtml;
	const boy = document.getElementById(
		`link-${slidePrefix}-${data.community}-boy`,
	) as SvgInHtml;
	const boyWithCup = document.getElementById(
		`link-${slidePrefix}-${data.community}-boy-cup`,
	) as SvgInHtml;
	const boyLeft = document.getElementById(
		`link-${slidePrefix}-${data.community}-boy-left`,
	) as SvgInHtml;
	const boyLaughing = document.getElementById(
		`link-${slidePrefix}-${data.community}-boy-laughing`,
	) as SvgInHtml;
	const boySlightRight = document.getElementById(
		`link-${slidePrefix}-${data.community}-boy-slightright-standing`,
	) as SvgInHtml;
	const fridgeClosed = document.getElementById(
		`${slidePrefix}-fridge-closed`,
	) as SvgInHtml;
	const fridgeEmpty = document.getElementById(
		`${slidePrefix}-fridge-open-empty`,
	) as SvgInHtml;
	const fridgeOpen = document.getElementById(
		`${slidePrefix}-fridge-open`,
	) as SvgInHtml;
	const purpleCup = document.getElementById(
		`${slidePrefix}-cup-purple`,
	) as SvgInHtml;
	const yellowCup = document.getElementById(
		`${slidePrefix}-cup-yellow`,
	) as SvgInHtml;
	const blueCup = document.getElementById(
		`${slidePrefix}-cup-blue`,
	) as SvgInHtml;
	const water = document.getElementById(`${slidePrefix}-water`) as SvgInHtml;
	const vinegar = document.getElementById(
		`${slidePrefix}-vinegar`,
	) as SvgInHtml;
	const waterAfter = document.getElementById(
		`${slidePrefix}-water-after`,
	) as SvgInHtml;
	const vinegarAfter = document.getElementById(
		`${slidePrefix}-vinegar-after`,
	) as SvgInHtml;
	// Define animation function
	async function showAnimation() {
		gsap.set(
			[
				boy,
				boyWithWater,
				boyWithVineger,
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
				fridgeClosed,
				fridgeEmpty,
				fridgeOpen,
				yellowCup,
				blueCup,
				purpleCup,
				water,
				vinegar,
				waterAfter,
				vinegarAfter,
			],
			{
				autoAlpha: 0,
			},
		);

		gsap.set([girl, boy, water, vinegar, fridgeClosed, blueCup, yellowCup], {
			autoAlpha: 1,
		});

		gsap.set([girl], { autoAlpha: 1, x: -1200 });

		await data.sprite.playPromise(`${slidePrefix}-1`);

		await gsap
			.timeline()
			.to(boy, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-2`][1] / 1000 - 3,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-2`);
				},
			})
			.to([boy, vinegar], {
				autoAlpha: 0,
				duration: 0.5,
			})
			.to(
				[boyWithVineger],
				{
					autoAlpha: 1,
					duration: 0.5,
				},
				'<',
			)
			.to([boyWithVineger], {
				delay: 1,
				autoAlpha: 0,
				duration: 0.5,
			})
			.to(
				[boy, vinegarAfter],
				{
					autoAlpha: 1,
					duration: 0.5,
				},
				'<',
			)
			.to([boy, water], {
				delay: 1,
				autoAlpha: 0,
				duration: 0.5,
			})
			.to(
				[boyWithWater],
				{
					autoAlpha: 1,
					duration: 0.5,
				},
				'<',
			)
			.to([boyWithWater], {
				delay: 1,
				autoAlpha: 0,
				duration: 0.5,
			})
			.to(
				[boy, waterAfter],
				{
					autoAlpha: 1,
					duration: 0.5,
				},
				'<',
			)
			.to(boy, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-3`][1] / 1000 - 3,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-3`);
				},
			})
			.to([fridgeEmpty, boyWithBottles], {
				autoAlpha: 1,
				duration: 0.5,
			})
			.to(
				[fridgeClosed, boy, waterAfter, vinegarAfter],
				{
					autoAlpha: 0,
					duration: 0.5,
				},
				'<',
			)
			.to(boyWithBottles, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-4`][1] / 1000,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-4`);
				},
			})
			.to([fridgeOpen, boy], {
				autoAlpha: 1,
				duration: 0.5,
			})
			.to(
				[fridgeEmpty, boyWithBottles],
				{
					autoAlpha: 0,
					duration: 0.5,
				},
				'<',
			)
			.to([fridgeClosed], {
				delay: 2,
				autoAlpha: 1,
				duration: 0.5,
			})
			.to(
				[fridgeOpen],
				{
					autoAlpha: 0,
					duration: 0.5,
				},
				'<',
			)
			.to(girl, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-5`][1] / 1000,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-5`);
				},
			})
			.to(
				[girl],
				{
					x: 0,
					autoAlpha: 1,
					duration: 3,
				},
				'<',
			)
			.to(girl, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-6`][1] / 1000 - 2,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-6`);
				},
			})
			.to([boy, blueCup], {
				autoAlpha: 0,
				duration: 0.5,
			})
			.to(
				[boyWithCup],
				{
					autoAlpha: 1,
					duration: 0.5,
				},
				'<',
			)
			.to([boyWithCup, girl], {
				delay: 1,
				autoAlpha: 0,
				duration: 0.5,
			})
			.to(
				[boy, girlDrinking],
				{
					autoAlpha: 1,
					duration: 0.5,
				},
				'<',
			)
			.to(girl, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-7`][1] / 1000,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-7`);
				},
			})
			.to([girlDrinking], {
				autoAlpha: 0,
				duration: 0.5,
			})
			.to(
				[girlRightNay, blueCup],
				{
					autoAlpha: 1,
					duration: 0.5,
				},
				'<',
			)
			.to(girlRightNay, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-8`][1] / 1000 - 1,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-8`);
				},
			})
			.to(girlRightNay, {
				autoAlpha: 0,
				duration: 0.5,
			})
			.to(
				girlFrontAngry,
				{
					autoAlpha: 1,
					duration: 0.5,
				},
				'<',
			)
			.to(boy, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-9`][1] / 1000,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-9`);
				},
			})
			.to(boy, {
				autoAlpha: 0,
				duration: 0.5,
			})
			.to(
				boyLaughing,
				{
					autoAlpha: 1,
					duration: 0.5,
				},
				'<',
			)
			// .to([boyLaughing, girlFrontAngry], {
			// 	delay: 1,
			// 	autoAlpha: 0,
			// 	duration: 0.5,
			// })
			.to([girl], {
				x: +1600,
			})
			.to([boy], {
				x: -1200,
			})
			.to([girl], {
				autoAlpha: 1,
			})
			.to([boy], {
				autoAlpha: 1,
			})
			.to(boyLaughing, {
				delay: 1,
				x: +1200,
				duration: 3,
			})
			.to(
				girlFrontAngry,
				{
					x: -1200,
					duration: 3,
				},
				'<',
			)
			.to(boy, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-10`][1] / 1000 - 2,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-10`);
				},
			})
			.to(
				purpleCup,
				{
					autoAlpha: 1,
				},
				'<',
			)
			.to(
				[blueCup, yellowCup],
				{
					autoAlpha: 0,
				},
				'<',
			)
			.to(boy, {
				delay: 1,
				x: -400,
				duration: 3,
			})
			.to(
				girl,
				{
					x: +400,
					duration: 3,
				},
				'<',
			)
			.to(girl, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-11`][1] / 1000,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-11`);
				},
			})
			.to(girl, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-12`][1] / 1000,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-12`);
				},
			})
			.to([girl, purpleCup], {
				autoAlpha: 0,
				duration: 0.5,
			})
			.to(
				[girlFrontCup],
				{
					autoAlpha: 1,
					duration: 0.5,
				},
				'<',
			)
			.to([girlFrontCup], {
				delay: 1,
				autoAlpha: 0,
				duration: 0.5,
			})
			.to(
				[girlBackCup],
				{
					autoAlpha: 1,
					duration: 0.5,
				},
				'<',
			)
			.to([fridgeClosed], {
				delay: 1,
				autoAlpha: 0,
				duration: 0.5,
			})
			.to(
				[fridgeOpen],
				{
					autoAlpha: 1,
					duration: 0.5,
				},
				'<',
			)
			.to(girlBackCup, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-13`][1] / 1000,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-13`);
				},
			})
			.to([fridgeOpen], {
				delay: 1,
				autoAlpha: 0,
				duration: 0.5,
			})
			.to(
				[fridgeClosed],
				{
					autoAlpha: 1,
					duration: 0.5,
				},
				'<',
			)
			.to([girlBackCup], {
				delay: 1,
				autoAlpha: 0,
				duration: 0.5,
			})
			.to(
				[girlFrontCup],
				{
					autoAlpha: 1,
					duration: 0.5,
				},
				'<',
			)
			.to(girlFrontCup, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-14`][1] / 1000,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-14`);
				},
			})
			.to([girlFrontCup], {
				autoAlpha: 0,
			})
			.to(
				[girlCup],
				{
					x: -300,
					autoAlpha: 1,
				},
				'<',
			);

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
