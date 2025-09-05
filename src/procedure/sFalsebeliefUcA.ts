import { swapSlides } from '../util/slideVisibility';
import { sleep } from '../util/helpers';
import { hideTwoOptions } from '../util/hideTwoOptions';
import { showTwoOptions } from '../util/showTwoOptions';
import type { SvgInHtml } from '../types';
import gsap from 'gsap';

export default async ({ currentSlide, previousSlide }) => {
	// Name of slide
	const slidePrefix = 's-falsebelief-uc-a';

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
	const girlWithShoes = document.getElementById(
		`link-${slidePrefix}-${data.community}-girl-shoes`,
	) as SvgInHtml;
	const girlWithBook = document.getElementById(
		`link-${slidePrefix}-${data.community}-girl-book`,
	) as SvgInHtml;
	const boy = document.getElementById(
		`link-${slidePrefix}-${data.community}-boy`,
	) as SvgInHtml;
	const boxClosed = document.getElementById(
		`${slidePrefix}-box-closed`,
	) as SvgInHtml;
	const boxOpenShoes = document.getElementById(
		`${slidePrefix}-box-shoes`,
	) as SvgInHtml;
	const boxOpenBook = document.getElementById(
		`${slidePrefix}-box-book`,
	) as SvgInHtml;

	// Define animation function
	async function showAnimation() {
		gsap.set(
			[
				girl,
				girlWithShoes,
				girlWithBook,
				boy,
				boxClosed,
				boxOpenShoes,
				boxOpenBook,
			],
			{
				autoAlpha: 0,
				x: 0,
			},
		);
		gsap.set([girlWithBook, boxClosed, boy], {
			autoAlpha: 1,
			x: 0,
		});
		gsap.set(girlWithBook, { x: -1200 });
		gsap.set(boy, { x: 1200 });

		await data.sprite.playPromise(`${slidePrefix}-1`);

		await gsap
			.timeline()
			.to(girlWithBook, {
				onStart: () => {
					data.sprite.play(`${slidePrefix}-2`);
				},
			})
			.to(
				girlWithBook,
				{
					x: 0,
					duration: 3,
					delay: data.spriteJSON.sprite[`${slidePrefix}-3`][1] / 1000,
				},
				'<',
			)
			.to(boxClosed, {
				duration: 0.5,
				delay: data.spriteJSON.sprite[`${slidePrefix}-3`][1] / 1000,
				autoAlpha: 0,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-3`);
				},
			})
			.to(
				boxOpenShoes,
				{
					autoAlpha: 1,
					duration: 0.5,
				},
				'<',
			)
			.to(girlWithShoes, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-4`][1] / 1000,
				autoAlpha: 1,
				duration: 0.5,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-4`);
				},
			})
			.to(
				girlWithBook,
				{
					autoAlpha: 0,
					duration: 0.5,
				},
				'<',
			)
			.to(
				boxOpenBook,
				{
					autoAlpha: 1,
					duration: 0.5,
				},
				'<',
			)
			.to(
				boxOpenShoes,
				{
					autoAlpha: 0,
					duration: 0.5,
				},
				'<',
			)
			.to(boxClosed, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-5`][1] / 1000 + 3,
				autoAlpha: 1,
				duration: 0.5,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-5`);
				},
			})
			.to(
				boxOpenBook,
				{
					autoAlpha: 0,
					duration: 0.5,
				},
				'<',
			)
			.to(
				girlWithShoes,
				{
					x: -1200,
					duration: 3,
				},
				'<',
			)
			.to(boy, {
				autoAlpha: 1,
				x: 0,
				duration: 3,
				delay: data.spriteJSON.sprite[`${slidePrefix}-6`][1] / 1000 + 2,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-6`);
				},
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
