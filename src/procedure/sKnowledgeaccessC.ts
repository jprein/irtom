import { gsap } from 'gsap';
import type { SvgInHtml } from '../types';
import { swapSlides } from '../util/slideVisibility';
import { sleep } from '../util/helpers';
import { hideTwoOptions } from '../util/hideTwoOptions';
import { showTwoOptions } from '../util/showTwoOptions';

export default async ({ currentSlide, previousSlide }) => {
	// Name of slide
	const slidePrefix = 's-knowledgeaccess-c';

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
	const boy = document.getElementById(
		`link-${slidePrefix}-${data.community}-boy`,
	) as SvgInHtml;
	const boxOpen = document.getElementById(
		`${slidePrefix}-box-open`,
	) as SvgInHtml;
	const boxClosed = document.getElementById(
		`${slidePrefix}-box-closed`,
	) as SvgInHtml;
	const dog = document.getElementById(`link-${slidePrefix}-dog`) as SvgInHtml;

	// Define animation function
	async function showAnimation() {
		// Initially hide some agent elements
		gsap.set([boy, girl], { x: -1200 });
		gsap.set(dog, { x: 1200, autoAlpha: 1 });
		gsap.set([girlHandsup, boxOpen], { autoAlpha: 0 });

		// Animation sequence
		await gsap
			.timeline()
			.to(dog, {
				onStart: () => {
					data.sprite.play(`${slidePrefix}-1`);
				},
			})
			.to(dog, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-1`][1] / 1000 - 5,
				x: 0,
				duration: 3,
			})
			.to(boxOpen, { delay: 2, autoAlpha: 1, duration: 0.1 })
			.to(dog, { autoAlpha: 0, duration: 0.1 }, '<')
			.to(boxOpen, { delay: 1, autoAlpha: 0, duration: 0.1 })
			.to(
				boxClosed,
				{
					autoAlpha: 1,
					duration: 0.1,
					onComplete: () => {
						data.sprite.play(`${slidePrefix}-2`);
					},
				},
				'<',
			)
			.to(girl, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-2`][1] / 1000,
				x: 0,
				duration: 3,
				onComplete: () => {
					data.sprite.play(`${slidePrefix}-3`);
				},
			})
			.to(girl, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-3`][1] / 1000,
				autoAlpha: 0,
				duration: 0.1,
			})
			.to(
				girlHandsup,
				{
					autoAlpha: 1,
					duration: 0.1,
				},
				'<',
			)
			.to(boxClosed, {
				x: 50,
				y: -700,
				duration: 1,
				onComplete: () => {
					data.sprite.play(`${slidePrefix}-4`);
				},
			})
			.to(girlHandsup, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-4`][1] / 1000,
				autoAlpha: 0,
				duration: 0.1,
			})
			.to(
				girl,
				{
					autoAlpha: 1,
					duration: 0.1,
				},
				'<',
			)
			.to(boxClosed, {
				x: 0,
				y: 0,
				duration: 1,
			})
			.to(girl, {
				delay: 1,
				x: -1200,
				duration: 3,
				onComplete: () => {
					data.sprite.play(`${slidePrefix}-5`);
				},
			})
			.to(boy, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-5`][1] / 1000,
				x: 0,
				duration: 3,
				onComplete: () => {
					data.sprite.play(`${slidePrefix}-6`);
				},
			})
			.to(boy, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-6`][1] / 1000,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-7`);
				},
			})
			.to(boy, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-7`][1] / 1000,
				x: -1200,
				duration: 3,
			});
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
