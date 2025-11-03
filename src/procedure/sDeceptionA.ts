import { gsap } from 'gsap';
import { swapSlides } from '../util/slideVisibility';
import { sleep } from '../util/helpers';
import { hideTwoOptions } from '../util/hideTwoOptions';
import { showTwoOptions } from '../util/showTwoOptions';
import type { SvgInHtml } from '../types';

export default async ({ currentSlide, previousSlide }) => {
	// Name of slide
	const slidePrefix = 's-deception-a';

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
	const boy = document.getElementById(
		`link-${slidePrefix}-${data.community}-boy`,
	) as SvgInHtml;
	const girlSpeaking = document.getElementById(
		`link-${slidePrefix}-${data.community}-girl-speaking`,
	) as SvgInHtml;
	const girlAngry = document.getElementById(
		`link-${slidePrefix}-${data.community}-girl-front-angry`,
	) as SvgInHtml;
	const womenCake = document.getElementById(
		`link-${slidePrefix}-${data.community}-woman-cake`,
	) as SvgInHtml;
	const women = document.getElementById(
		`link-${slidePrefix}-${data.community}-woman`,
	) as SvgInHtml;
	const womenPointing = document.getElementById(
		`link-${slidePrefix}-${data.community}-woman-pointing`,
	) as SvgInHtml;
	const cake = document.getElementById(
		`${slidePrefix}-cake-plate`,
	) as SvgInHtml;
	const fridgeClosed = document.getElementById(
		`${slidePrefix}-fridge-closed`,
	) as SvgInHtml;
	const fridgeOpenWithCake = document.getElementById(
		`${slidePrefix}-fridge-cake`,
	) as SvgInHtml;
	const fridgeOpen = document.getElementById(
		`${slidePrefix}-fridge-open`,
	) as SvgInHtml;

	// Define animation function
	async function showAnimation() {
		gsap.set(
			[
				girl,
				womenCake,
				girlSpeaking,
				womenPointing,
				boy,
				cake,
				fridgeClosed,
				fridgeOpen,
				fridgeOpenWithCake,
				girlAngry,
			],
			{
				autoAlpha: 0,
			},
		);

		gsap.set([girl, women, boy, cake, fridgeClosed], {
			autoAlpha: 1,
		});

		gsap.set([boy], { autoAlpha: 1, x: +1200 });
		gsap.set([women], { autoAlpha: 1, x: +1200 });

		await data.sprite.playPromise(`${slidePrefix}-1`);

		await gsap
			.timeline()
			.to(women, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-2`][1] / 1000 - 2,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-2`);
				},
			})
			.to(
				women,
				{
					x: 0,
					duration: 3,
				},
				'<',
			)
			.to(women, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-3`][1] / 1000 - 2,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-3`);
				},
			})
			.to(womenPointing, {
				autoAlpha: 1,
				duration: 0.5,
			})
			.to(
				women,
				{
					autoAlpha: 0,
					duration: 0.5,
				},
				'<',
			)
			.to(women, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-4`][1] / 1000,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-4`);
				},
			})
			.to(womenCake, {
				autoAlpha: 1,
				duration: 0.5,
			})
			.to(
				[womenPointing, cake],
				{
					autoAlpha: 0,
					duration: 0.5,
				},
				'<',
			)
			.to(fridgeOpen, {
				autoAlpha: 1,
				duration: 0.5,
			})
			.to(
				fridgeClosed,
				{
					autoAlpha: 0,
					duration: 0.5,
				},
				'<',
			)
			.to([fridgeOpenWithCake, women], {
				delay: 2,
				autoAlpha: 1,
				duration: 0.5,
			})
			.to(
				[fridgeOpen, womenCake],
				{
					autoAlpha: 0,
					duration: 0.5,
				},
				'<',
			)
			.to(women, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-5`][1] / 1000,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-5`);
				},
			})
			.to([fridgeClosed, women], {
				autoAlpha: 1,
				duration: 0.5,
			})
			.to(
				[womenPointing, fridgeOpenWithCake],
				{
					autoAlpha: 0,
					duration: 0.5,
				},
				'<',
			)
			.to(women, {
				x: +1200,
				duration: 3,
			})
			.to(girl, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-6`][1] / 1000,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-6`);
				},
			})
			.to(boy, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-7`][1] / 1000,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-7`);
				},
			})
			.to(boy, {
				x: 0,
				duration: 3,
			})
			.to(girl, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-8`][1] / 1000,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-8`);
				},
			})
			.to(girlSpeaking, {
				autoAlpha: 1,
				duration: 0.5,
			})
			.to(
				girl,
				{
					autoAlpha: 0,
					duration: 0.5,
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
