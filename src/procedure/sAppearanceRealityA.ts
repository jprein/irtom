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
	const slidePrefix = 's-appearance-reality-a';

	// Store correct response
	data.procedure[data.currentSlide].correct = 'left';

	// Swap slides
	swapSlides(currentSlide, previousSlide);
	data.simpleSlideCounter++;

	// Trial-specific animation
	// Get all relevant elements
	const girl = document.getElementById(
		`link-${slidePrefix}-${data.community}-girl`,
	) as SvgInHtml;
	const boy = document.getElementById(
		`link-${slidePrefix}-${data.community}-boy`,
	) as SvgInHtml;
	const boyWithGlass = document.getElementById(
		`link-${slidePrefix}-${data.community}-boy-glass`,
	) as SvgInHtml;
	const boyLemonadeUp = document.getElementById(
		`link-${slidePrefix}-${data.community}-boy-lemonade-up`,
	) as SvgInHtml;
	const boyLemonadeDown = document.getElementById(
		`link-${slidePrefix}-${data.community}-boy-lemonade-down`,
	) as SvgInHtml;
	const fridgeClosed = document.getElementById(
		`${slidePrefix}-fridge-closed`,
	) as SvgInHtml;
	const fridgeOpen = document.getElementById(
		`${slidePrefix}-fridge-open`,
	) as SvgInHtml;
	const fridgeOpenWithGlass = document.getElementById(
		`${slidePrefix}-fridge-glass`,
	) as SvgInHtml;
	const glass = document.getElementById(`${slidePrefix}-glass`) as SvgInHtml;
	const glassEmpty = document.getElementById(
		`${slidePrefix}-glass-empty`,
	) as SvgInHtml;
	const box = document.getElementById(`${slidePrefix}-boxes`) as SvgInHtml;
	const boxEmpty = document.getElementById(
		`${slidePrefix}-boxes-empty`,
	) as SvgInHtml;
	// const boxWithEmptyBottle = document.getElementById(
	// 	`${slidePrefix}-boxes`,
	// ) as SvgInHtml;
	const lemonadeOpen = document.getElementById(
		`${slidePrefix}-lemonade-open`,
	) as SvgInHtml;
	const lemonadeClosed = document.getElementById(
		`${slidePrefix}-lemonade-closeds`,
	) as SvgInHtml;
	// const lemonadeOpenEmpty = document.getElementById(
	// 	`${slidePrefix}-lemonade-open-Empty`,
	// ) as SvgInHtml;
	// const lemonadeClosedEmpty = document.getElementById(
	// 	`${slidePrefix}-lemonade-closed-empty`,
	// ) as SvgInHtml;
	async function showAnimation() {
		gsap.set(
			[
				boyLemonadeDown,
				boyLemonadeUp,
				boyWithGlass,
				boy,
				girl,
				fridgeClosed,
				fridgeOpen,
				fridgeOpenWithGlass,
				glass,
				glassEmpty,
				box,
				boxEmpty,
				lemonadeOpen,
				lemonadeClosed,
				// lemonadeOpenEmpty,
				// lemonadeClosedEmpty,
				// boxWithEmptyBottle,
			],
			{
				autoAlpha: 0,
			},
		);

		gsap.set([girl, boy, box, glassEmpty, fridgeClosed], {
			autoAlpha: 1,
		});

		gsap.set([boy], { autoAlpha: 1, x: +1200 });
		gsap.set([girl], { autoAlpha: 1, x: -1200 });

		await data.sprite.playPromise(`${slidePrefix}-1`);

		await gsap
			.timeline()
			.to(boy, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-2`][1] / 1000 - 1,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-2`);
				},
			})
			.to(
				boy,
				{
					x: 0,
					duration: 2,
				},
				'<',
			)
			.to(boy, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-3`][1] / 1000 - 2,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-3`);
				},
			})
			.to([boy, box], {
				autoAlpha: 0,
				duration: 0.1,
			})
			.to(
				[boyLemonadeUp, boxEmpty],
				{
					autoAlpha: 1,
					duration: 0.1,
				},
				'<',
			)
			.to([boyLemonadeUp, glassEmpty], {
				delay: 1,
				autoAlpha: 0,
				duration: 0.1,
			})
			.to(
				[boyLemonadeDown, glass],
				{
					autoAlpha: 1,
					duration: 0.1,
				},
				'<',
			)
			.to([boyLemonadeDown], {
				delay: 1,
				autoAlpha: 0,
				duration: 0.1,
			})
			.to(
				[boy, lemonadeOpen],
				{
					autoAlpha: 1,
					duration: 0.1,
				},
				'<',
			)
			.to(boy, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-4`][1] / 1000 + 2,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-4`);
				},
			})
			.to([glass, boy, fridgeClosed], {
				autoAlpha: 0,
				duration: 0.1,
			})
			.to(
				[boyWithGlass, fridgeOpen],
				{
					autoAlpha: 1,
					duration: 0.1,
				},
				'<',
			)
			.to([boyWithGlass, fridgeOpen], {
				delay: 1,
				autoAlpha: 0,
				duration: 0.1,
			})
			.to(
				[boy, fridgeOpenWithGlass],
				{
					autoAlpha: 1,
					duration: 0.1,
				},
				'<',
			)
			.to(fridgeOpenWithGlass, {
				delay: 1,
				autoAlpha: 0,
				duration: 0.1,
			})
			.to(
				fridgeClosed,
				{
					autoAlpha: 1,
					duration: 0.1,
				},
				'<',
			)
			.to(boy, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-5`][1] / 1000 - 3,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-5`);
				},
			})

			.to(lemonadeOpen, {
				delay: 1,
				autoAlpha: 0,
				duration: 0.1,
			})
			.to(
				lemonadeClosed,
				{
					autoAlpha: 1,
					duration: 0.1,
				},
				'<',
			)
			.to(lemonadeClosed, {
				delay: 1,
				autoAlpha: 0,
				duration: 0.1,
			})
			.to(
				box,
				{
					autoAlpha: 1,
					duration: 0.1,
				},
				'<',
			)
			.to(boy, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-6`][1] / 1000 + 1,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-6`);
				},
			})
			.to(boy, {
				duration: 2,
				x: +1200,
			})
			.to(girl, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-7`][1] / 1000,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-7`);
				},
			})
			.to(
				girl,
				{
					duration: 2,
					x: 0,
				},
				'<',
			);

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
