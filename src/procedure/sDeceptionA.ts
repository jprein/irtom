import { gsap } from 'gsap';
import { swapSlides } from '../util/slideVisibility';
import { sleep } from '../util/helpers';
import type { SvgInHtml } from '../types';
import { showYesNoChoice } from '../util/showYesNoChoice';
import { hideYesNoChoice } from '../util/hideYesNoChoice';
import {
	hideBlockingState,
	showBlockingState,
} from '../util/showOrHideBlockState';

export default async ({ currentSlide, previousSlide }) => {
	// Name of slide
	const slidePrefix = 's-deception-a';
	const choicePrefix = 's-yesnochoice';

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

	// Define animation function
	async function showAnimation() {
		gsap.set(
			[girl, womenCake, girlSpeaking, womenPointing, boy, cake, girlAngry],
			{
				autoAlpha: 0,
			},
		);

		gsap.set([girl, women, boy, cake], {
			autoAlpha: 1,
		});

		gsap.set([boy], { autoAlpha: 1, x: +1200 });
		gsap.set([women], { autoAlpha: 1, x: +1200 });
		gsap.set([women, womenPointing, womenCake], { height: '925px' });

		await data.sprite.playPromise(`${slidePrefix}-1`);

		const tl = await gsap.timeline();
		tl.to(women, {
			delay: data.spriteJSON.sprite[`${slidePrefix}-2`][1] / 1000 - 1,
			onStart: () => {
				data.sprite.play(`${slidePrefix}-2`);
			},
		})
			.to(
				women,
				{
					x: 0,
					duration: 2,
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
				duration: 0.1,
			})
			.to(
				women,
				{
					autoAlpha: 0,
					duration: 0.1,
				},
				'<',
			)
			.to(girl, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-4`][1] / 1000 + 2,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-4`);
				},
			})
			.to(
				women,
				{
					autoAlpha: 1,
					duration: 0.1,
				},
				'<',
			)
			.to(
				womenPointing,
				{
					autoAlpha: 0,
					duration: 0.1,
				},
				'<',
			)
			.to(
				girlAngry,
				{
					autoAlpha: 1,
					duration: 0.1,
				},
				'<',
			)
			.to(
				girl,
				{
					autoAlpha: 0,
					duration: 0.1,
				},
				'<',
			)
			.to(women, {
				x: +1200,
				duration: 2,
				delay: data.spriteJSON.sprite[`${slidePrefix}-5`][1] / 1000 + 2,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-5`);
				},
			})
			.to(
				girlAngry,
				{
					x: -1200,
					duration: 2,
				},
				'<',
			)
			.to(
				girl,
				{
					x: -1200,
					duration: 0.1,
				},
				'<',
			)
			.to(girl, {
				autoAlpha: 1,
				duration: 0.1,
			})
			.to(
				cake,
				{
					autoAlpha: 0,
					duration: 0.1,
				},
				'<',
			)
			.to(girl, {
				x: 0,
				duration: 2,
				delay: data.spriteJSON.sprite[`${slidePrefix}-6`][1] / 1000 - 3,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-6`);
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
				delay: data.spriteJSON.sprite[`${slidePrefix}-7`][1] / 1000 + 2,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-7`);
				},
			})
			.to(girl, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-8`][1] / 1000,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-8`);
				},
			})
			.to(girlSpeaking, {
				autoAlpha: 1,
				duration: 0.1,
			})
			.to(
				girl,
				{
					autoAlpha: 0,
					duration: 0.1,
				},
				'<',
			)
			.to(girlSpeaking, {
				delay: data.spriteJSON.sprite[`${slidePrefix}-9`][1] / 1000 + 2,
				onStart: () => {
					data.sprite.play(`${slidePrefix}-9`);
				},
			})
			.to(girlSpeaking, {
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
			);

		await sleep(500);

		await tl.then();
		tl.kill();
	}
	// In beginning, hide response options
	await hideYesNoChoice(choicePrefix);
	await hideBlockingState(slidePrefix);

	// Show animation
	await showAnimation();

	// Short break before showing response options
	await sleep(500);

	// Show left/right response options and store participant response
	const stopBlockingState = await showYesNoChoice(slidePrefix, choicePrefix);
	if (!stopBlockingState) await showBlockingState(slidePrefix);
};
